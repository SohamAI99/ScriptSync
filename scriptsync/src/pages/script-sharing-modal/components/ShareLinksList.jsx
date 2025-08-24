import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ShareLinksList = ({
  links,
  onCopyLink,
  onRevokeLink,
  onEditPermission,
  permissionOptions
}) => {
  const [expandedLink, setExpandedLink] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getPermissionIcon = (permission) => {
    switch (permission) {
      case 'view': return 'Eye';
      case 'comment': return 'MessageCircle';
      case 'edit': return 'Edit';
      default: return 'Eye';
    }
  };

  const getPermissionColor = (permission) => {
    switch (permission) {
      case 'view': return 'text-blue-400';
      case 'comment': return 'text-yellow-400';
      case 'edit': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const handleToggleExpand = (linkId) => {
    setExpandedLink(expandedLink === linkId ? null : linkId);
  };

  const handleEditPermission = (linkId, newPermission) => {
    onEditPermission(linkId, newPermission);
    setEditingPermission(null);
  };

  const isExpired = (date) => {
    return date && new Date(date) < new Date();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Generated Share Links
        </h3>
        <div className="text-sm text-muted-foreground font-body">
          {links?.length} link{links?.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="space-y-4">
        {links?.map(link => (
          <div
            key={link?.id}
            className={`p-4 rounded-lg border transition-smooth ${
              isExpired(link?.expirationDate) 
                ? 'border-destructive/20 bg-destructive/5' :'border-border bg-muted hover:bg-white/5'
            }`}
          >
            {/* Link Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${
                  isExpired(link?.expirationDate) ? 'bg-destructive/10' : 'bg-primary/10'
                }`}>
                  <Icon 
                    name={getPermissionIcon(link?.permission)} 
                    size={16} 
                    className={isExpired(link?.expirationDate) ? 'text-destructive' : getPermissionColor(link?.permission)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${
                      isExpired(link?.expirationDate) 
                        ? 'bg-destructive/10 text-destructive' :'bg-primary/10 text-primary'
                    }`}>
                      {link?.permission?.toUpperCase()}
                    </span>
                    {link?.passwordProtected && (
                      <Icon name="Lock" size={12} className="text-muted-foreground" />
                    )}
                    {isExpired(link?.expirationDate) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-body font-medium">
                        EXPIRED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate font-mono">
                    {link?.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onCopyLink(link?.url)}
                  disabled={isExpired(link?.expirationDate)}
                  className="p-2 rounded-lg transition-smooth hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy link"
                >
                  <Icon name="Copy" size={16} className="text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleToggleExpand(link?.id)}
                  className="p-2 rounded-lg transition-smooth hover:bg-white/5"
                  title="View details"
                >
                  <Icon 
                    name={expandedLink === link?.id ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedLink === link?.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {/* Analytics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {link?.analytics?.views}
                    </div>
                    <div className="text-sm text-muted-foreground font-body">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {link?.analytics?.downloads}
                    </div>
                    <div className="text-sm text-muted-foreground font-body">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-body font-medium text-foreground">
                      {formatTimeAgo(link?.analytics?.lastAccessed)}
                    </div>
                    <div className="text-sm text-muted-foreground font-body">Last Accessed</div>
                  </div>
                </div>

                {/* Link Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2 text-foreground">{formatDate(link?.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <span className={`ml-2 ${isExpired(link?.expirationDate) ? 'text-destructive' : 'text-foreground'}`}>
                      {link?.expirationDate ? formatDate(link?.expirationDate) : 'Never'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  {/* Permission Editor */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground font-body">Permission:</span>
                    {editingPermission === link?.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={link?.permission}
                          onChange={(e) => handleEditPermission(link?.id, e?.target?.value)}
                          className="px-3 py-1 rounded-md bg-input border border-border text-foreground text-sm font-body focus:ring-2 focus:ring-primary focus:border-transparent"
                          disabled={isExpired(link?.expirationDate)}
                        >
                          {permissionOptions?.map(option => (
                            <option key={option?.value} value={option?.value}>
                              {option?.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingPermission(null)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-smooth"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingPermission(link?.id)}
                        disabled={isExpired(link?.expirationDate)}
                        className="flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-body font-medium text-primary hover:bg-primary/10 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{permissionOptions?.find(p => p?.value === link?.permission)?.label}</span>
                        <Icon name="Edit" size={12} />
                      </button>
                    )}
                  </div>

                  {/* Revoke Button */}
                  <button
                    onClick={() => onRevokeLink(link?.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-destructive border border-destructive/20 hover:bg-destructive/10 transition-smooth text-sm font-body"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Revoke Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareLinksList;