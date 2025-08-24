import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Pending Review',
      value: stats?.pendingReview,
      icon: 'Clock',
      color: 'text-warning bg-warning/10 border-warning/20',
      trend: stats?.pendingTrend,
      description: 'Scripts awaiting review'
    },
    {
      title: 'In Progress',
      value: stats?.inProgress,
      icon: 'Edit',
      color: 'text-secondary bg-secondary/10 border-secondary/20',
      trend: stats?.progressTrend,
      description: 'Currently being reviewed'
    },
    {
      title: 'Approved',
      value: stats?.approved,
      icon: 'CheckCircle',
      color: 'text-success bg-success/10 border-success/20',
      trend: stats?.approvedTrend,
      description: 'Completed this week'
    },
    {
      title: 'Issues',
      value: stats?.openIssues,
      icon: 'AlertTriangle',
      color: 'text-destructive bg-destructive/10 border-destructive/20',
      trend: stats?.issuesTrend,
      description: 'Open feedback items'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards?.map((stat, index) => (
        <div key={index} className="glass-effect border border-border rounded-lg p-6 transition-smooth hover:glass-effect-hover">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${stat?.color}`}>
              <Icon name={stat?.icon} size={24} />
            </div>
            
            {stat?.trend !== undefined && (
              <div className={`flex items-center space-x-1 ${getTrendColor(stat?.trend)}`}>
                <Icon name={getTrendIcon(stat?.trend)} size={16} />
                <span className="text-sm font-medium">
                  {Math.abs(stat?.trend)}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-heading font-bold text-foreground">
              {stat?.value?.toLocaleString()}
            </h3>
            <p className="text-sm font-body font-medium text-foreground">
              {stat?.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {stat?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;