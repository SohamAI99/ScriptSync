import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';



const ScriptCard = ({ script, onEdit, onShare, onDuplicate, onDelete }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(script?.title);
  const [showActions, setShowActions] = useState(false);

  const handleTitleEdit = () => {
    if (isEditing) {
      onEdit(script?.id, { title: editedTitle });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleTitleEdit();
    } else if (e?.key === 'Escape') {
      setEditedTitle(script?.title);
      setIsEditing(false);
    }
  };

  const handleCardClick = () => {
    if (!isEditing && !showActions) {
      navigate(`/script-editor/${script?.id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'text-warning';
      case 'review': return 'text-secondary';
      case 'approved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'screenplay': 'bg-primary/10 text-primary border-primary/20',
      'stage-play': 'bg-secondary/10 text-secondary border-secondary/20',
      'tv-script': 'bg-accent/10 text-accent border-accent/20',
      'short-film': 'bg-warning/10 text-warning border-warning/20'
    };
    return colors?.[category] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  return (
    <div 
      className="glass-effect border border-border rounded-xl p-6 transition-smooth hover:glass-effect-hover hover:shadow-elevated cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e?.target?.value)}
              onBlur={handleTitleEdit}
              onKeyDown={handleKeyPress}
              className="w-full bg-transparent text-lg font-heading font-bold text-foreground border-none outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1"
              autoFocus
              onClick={(e) => e?.stopPropagation()}
            />
          ) : (
            <h3 
              className="text-lg font-heading font-bold text-foreground truncate group-hover:text-primary transition-smooth"
              onClick={(e) => {
                e?.stopPropagation();
                setIsEditing(true);
              }}
            >
              {script?.title}
            </h3>
          )}
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-body font-medium border ${getCategoryColor(script?.category)}`}>
              {script?.category?.replace('-', ' ')}
            </span>
            <span className={`text-xs font-body capitalize ${getStatusColor(script?.status)}`}>
              {script?.status}
            </span>
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e?.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-2 rounded-lg transition-smooth hover:bg-white/5 opacity-0 group-hover:opacity-100"
          >
            <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-effect-hover border border-border rounded-lg shadow-elevated z-50">
              <div className="p-2">
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    navigate(`/script-editor/${script?.id}`);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth hover:bg-white/5 text-left"
                >
                  <Icon name="Edit" size={16} />
                  <span className="font-body">Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    onShare(script);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth hover:bg-white/5 text-left"
                >
                  <Icon name="Share2" size={16} />
                  <span className="font-body">Share</span>
                </button>
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    onDuplicate(script);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth hover:bg-white/5 text-left"
                >
                  <Icon name="Copy" size={16} />
                  <span className="font-body">Duplicate</span>
                </button>
                <hr className="my-2 border-border" />
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    onDelete(script);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth hover:bg-destructive/10 text-destructive text-left"
                >
                  <Icon name="Trash2" size={16} />
                  <span className="font-body">Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-body text-muted-foreground">Progress</span>
          <span className="text-sm font-body font-medium text-foreground">{script?.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-smooth"
            style={{ width: `${script?.progress}%` }}
          />
        </div>
      </div>
      {/* Collaborators */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {script?.collaborators?.slice(0, 3)?.map((collaborator) => (
              <div
                key={collaborator?.id}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center border-2 border-background"
                title={collaborator?.name}
              >
                <span className="text-xs font-medium text-white">
                  {collaborator?.name?.charAt(0)}
                </span>
              </div>
            ))}
            {script?.collaborators?.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                <span className="text-xs font-medium text-muted-foreground">
                  +{script?.collaborators?.length - 3}
                </span>
              </div>
            )}
          </div>
          {script?.activeCollaborators > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-success pulse-gentle" />
              <span className="text-xs text-muted-foreground font-body">
                {script?.activeCollaborators} active
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={14} />
          <span className="font-body">{script?.lastModified}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="FileText" size={14} />
          <span className="font-body">{script?.pages} pages</span>
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;