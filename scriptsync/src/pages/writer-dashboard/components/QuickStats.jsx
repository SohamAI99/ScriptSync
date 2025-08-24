import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Scripts',
      value: stats?.totalScripts || 0,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'In Progress',
      value: stats?.inProgress || 0,
      icon: 'Edit',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Collaborations',
      value: stats?.collaborations || 0,
      icon: 'Users',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'Completed',
      value: stats?.completed || 0,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems?.map((item, index) => (
        <div key={index} className="glass-effect border border-border rounded-xl p-4 transition-smooth hover:glass-effect-hover">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${item?.bgColor} flex items-center justify-center`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {item?.value}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                {item?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;