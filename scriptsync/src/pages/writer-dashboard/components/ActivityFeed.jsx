import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'commit': return 'GitCommit';
      case 'comment': return 'MessageCircle';
      case 'collaboration': return 'Users';
      case 'share': return 'Share2';
      case 'edit': return 'Edit';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'commit': return 'text-primary';
      case 'comment': return 'text-secondary';
      case 'collaboration': return 'text-accent';
      case 'share': return 'text-warning';
      case 'edit': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const displayedActivities = isExpanded ? activities : activities?.slice(0, 5);

  return (
    <div className="glass-effect border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-bold text-foreground">
          Recent Activity
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg transition-smooth hover:bg-white/5"
        >
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-muted-foreground" 
          />
        </button>
      </div>
      {/* Activity List */}
      <div className="space-y-4">
        {displayedActivities?.length > 0 ? (
          displayedActivities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3">
              {/* Activity Icon */}
              <div className={`w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={14} />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-body text-foreground">
                    <span className="font-medium">{activity?.user}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity?.action}</span>
                    {' '}
                    <span className="font-medium">{activity?.target}</span>
                  </p>
                  <span className="text-xs text-muted-foreground font-mono flex-shrink-0 ml-2">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                </div>
                
                {activity?.description && (
                  <p className="text-xs text-muted-foreground mt-1 font-body">
                    {activity?.description}
                  </p>
                )}

                {activity?.scriptTitle && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Icon name="FileText" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-body">
                      {activity?.scriptTitle}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-body">No recent activity</p>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Start writing to see your activity here
            </p>
          </div>
        )}
      </div>
      {/* Show More/Less */}
      {activities?.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center text-sm text-primary hover:text-primary/80 transition-smooth font-body"
          >
            {isExpanded ? 'Show Less' : `Show ${activities?.length - 5} More`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;