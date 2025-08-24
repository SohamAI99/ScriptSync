import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment': return 'MessageSquare';
      case 'approval': return 'CheckCircle';
      case 'submission': return 'Upload';
      case 'assignment': return 'UserPlus';
      case 'issue': return 'AlertCircle';
      case 'changes': return 'Edit';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'comment': return 'text-primary';
      case 'approval': return 'text-success';
      case 'submission': return 'text-secondary';
      case 'assignment': return 'text-warning';
      case 'issue': return 'text-destructive';
      case 'changes': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Recent Activity
        </h3>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-3 glass-effect rounded-lg border border-border">
            <div className={`w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-body font-medium text-foreground">
                  {activity?.user}
                </p>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-1">
                {activity?.action}
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  {activity?.scriptTitle}
                </span>
                {activity?.priority && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    activity?.priority === 'high' ? 'text-destructive bg-destructive/10' :
                    activity?.priority === 'medium'? 'text-warning bg-warning/10' : 'text-success bg-success/10'
                  }`}>
                    {activity?.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {activities?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-body">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;