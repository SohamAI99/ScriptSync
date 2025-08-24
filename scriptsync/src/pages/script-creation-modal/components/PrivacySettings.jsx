import React from 'react';
import Icon from '../../../components/AppIcon';

const PrivacySettings = ({ 
  selectedPrivacy, 
  onPrivacyChange, 
  error = null 
}) => {
  const privacyOptions = [
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can access this script',
      icon: 'Lock'
    },
    {
      value: 'team',
      label: 'Team Only',
      description: 'Only invited collaborators can access',
      icon: 'Users'
    },
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone with the link can view',
      icon: 'Globe'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-3">
          Privacy Settings
        </label>
        <p className="text-sm text-muted-foreground mb-4">
          Choose who can access your script
        </p>
      </div>
      <div className="space-y-3">
        {privacyOptions?.map((option) => (
          <label
            key={option?.value}
            className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-smooth ${
              selectedPrivacy === option?.value
                ? 'border-primary bg-primary/10 glow-primary' :'border-border hover:border-primary/50 hover:bg-white/5'
            }`}
          >
            <input
              type="radio"
              name="privacy"
              value={option?.value}
              checked={selectedPrivacy === option?.value}
              onChange={(e) => onPrivacyChange(e?.target?.value)}
              className="sr-only"
            />
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
              selectedPrivacy === option?.value
                ? 'border-primary bg-primary' :'border-muted-foreground'
            }`}>
              {selectedPrivacy === option?.value && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Icon 
                  name={option?.icon} 
                  size={16} 
                  className={selectedPrivacy === option?.value ? 'text-primary' : 'text-muted-foreground'} 
                />
                <span className={`font-body font-medium ${
                  selectedPrivacy === option?.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {option?.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {option?.description}
              </p>
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive font-body">{error}</p>
      )}
    </div>
  );
};

export default PrivacySettings;