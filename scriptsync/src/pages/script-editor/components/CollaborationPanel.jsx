import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CollaborationPanel = ({ 
  collaborators = [],
  comments = [],
  commits = [],
  onInviteUser = () => {},
  onAddComment = () => {},
  onResolveComment = () => {},
  onViewCommit = () => {},
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('presence');
  const [newComment, setNewComment] = useState('');

  const mockCollaborators = [];

  const mockComments = [];

  const mockCommits = [];

  const displayCollaborators = collaborators?.length > 0 ? collaborators : mockCollaborators;
  const displayComments = comments?.length > 0 ? comments : mockComments;
  const displayCommits = commits?.length > 0 ? commits : mockCommits;

  const tabs = [
    { id: 'presence', label: 'Live', icon: 'Users', count: displayCollaborators?.filter(c => c?.isActive)?.length },
    { id: 'comments', label: 'Comments', icon: 'MessageSquare', count: displayComments?.filter(c => !c?.isResolved)?.length },
    { id: 'history', label: 'History', icon: 'GitCommit', count: displayCommits?.length }
  ];

  const handleAddComment = () => {
    if (newComment?.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 transition-smooth ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <Icon name={tab?.icon} size={14} />
            <span className="text-xs font-body font-medium">{tab?.label}</span>
            {tab?.count > 0 && (
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'presence' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-body font-medium text-foreground">
                Active Collaborators
              </h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="UserPlus"
                onClick={onInviteUser}
                className="text-xs"
              >
                Invite
              </Button>
            </div>

            <div className="space-y-3">
              {displayCollaborators?.map((collaborator) => (
                <div
                  key={collaborator?.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-smooth"
                >
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: collaborator?.color }}
                    >
                      {collaborator?.name?.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      collaborator?.isActive ? 'bg-success' : 'bg-muted'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-foreground truncate">
                      {collaborator?.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="capitalize">{collaborator?.role}</span>
                      {collaborator?.isActive && collaborator?.cursor && (
                        <>
                          <span>•</span>
                          <span className="font-mono">Line {collaborator?.cursor?.line}</span>
                        </>
                      )}
                      {!collaborator?.isActive && (
                        <>
                          <span>•</span>
                          <span>{formatTime(collaborator?.lastSeen)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {collaborator?.isActive && (
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-body font-medium text-foreground">
                Comments & Feedback
              </h3>
            </div>

            {/* Add Comment */}
            <div className="mb-4 p-3 rounded-lg border border-border">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e?.target?.value)}
                placeholder="Add a comment..."
                className="w-full bg-transparent text-sm font-body text-foreground placeholder-muted-foreground resize-none border-none outline-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment?.trim()}
                >
                  Comment
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {displayComments?.map((comment) => (
                <div
                  key={comment?.id}
                  className={`p-3 rounded-lg border transition-smooth ${
                    comment?.isResolved
                      ? 'border-success/20 bg-success/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: comment?.authorColor }}
                      >
                        {comment?.author?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-body font-medium text-foreground">
                          {comment?.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Line {comment?.line} • {formatTime(comment?.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {!comment?.isResolved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Check"
                        onClick={() => onResolveComment(comment?.id)}
                        className="text-xs"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>

                  <p className="text-sm font-body text-foreground mb-2">
                    {comment?.content}
                  </p>

                  {comment?.replies?.length > 0 && (
                    <div className="ml-4 space-y-2 border-l-2 border-border pl-3">
                      {comment?.replies?.map((reply) => (
                        <div key={reply?.id} className="text-sm">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-body font-medium text-foreground">
                              {reply?.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(reply?.timestamp)}
                            </span>
                          </div>
                          <p className="font-body text-muted-foreground">
                            {reply?.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-body font-medium text-foreground">
                Commit History
              </h3>
            </div>

            <div className="space-y-3">
              {displayCommits?.map((commit, index) => (
                <button
                  key={commit?.id}
                  onClick={() => onViewCommit(commit)}
                  className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-white/5 transition-smooth text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {commit?.author?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-body font-medium text-foreground">
                          {commit?.author}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {commit?.hash} • {formatTime(commit?.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Latest
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-body text-foreground mb-2">
                    {commit?.message}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">{commit?.changes}</span>
                    <Icon name="ExternalLink" size={12} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;