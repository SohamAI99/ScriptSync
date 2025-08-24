import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ 
  items = [], 
  currentScript = null, 
  collaborators = [], 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const defaultItems = [
    { label: 'Dashboard', path: '/writer-dashboard' },
    { label: 'Scripts', path: '/writer-dashboard' }
  ];

  const breadcrumbItems = items?.length > 0 ? items : defaultItems;

  return (
    <nav className={`flex items-center space-x-2 text-sm font-body ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems?.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            {item?.path ? (
              <button
                onClick={() => handleNavigation(item?.path)}
                className="text-muted-foreground hover:text-foreground transition-smooth hover:underline"
              >
                {item?.label}
              </button>
            ) : (
              <span className="text-foreground font-medium">
                {item?.label}
              </span>
            )}
          </li>
        ))}
        
        {currentScript && (
          <li className="flex items-center">
            <Icon 
              name="ChevronRight" 
              size={16} 
              className="text-muted-foreground mx-2" 
            />
            <span className="text-foreground font-medium">
              {currentScript?.title}
            </span>
          </li>
        )}
      </ol>
      {/* Script Context Info */}
      {currentScript && (
        <div className="flex items-center ml-6 space-x-4">
          {/* Collaboration Status */}
          {collaborators?.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {collaborators?.slice(0, 3)?.map((collaborator, index) => (
                  <div
                    key={collaborator?.id}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center border-2 border-background pulse-gentle"
                    title={collaborator?.name}
                  >
                    <span className="text-xs font-medium text-white">
                      {collaborator?.name?.charAt(0)}
                    </span>
                  </div>
                ))}
                {collaborators?.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                    <span className="text-xs font-medium text-muted-foreground">
                      +{collaborators?.length - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {collaborators?.length} active
              </span>
            </div>
          )}

          {/* Script Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              currentScript?.status === 'draft' ? 'bg-warning' :
              currentScript?.status === 'review' ? 'bg-secondary' :
              currentScript?.status === 'approved'? 'bg-success' : 'bg-muted'
            }`} />
            <span className="text-xs text-muted-foreground capitalize">
              {currentScript?.status || 'Draft'}
            </span>
          </div>

          {/* Last Modified */}
          {currentScript?.lastModified && (
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {new Date(currentScript.lastModified)?.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default BreadcrumbNavigation;