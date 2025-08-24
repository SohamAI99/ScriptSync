import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingSpinner = ({ 
  message = 'Authenticating...', 
  size = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className={`${sizeClasses?.[size]} animate-spin text-primary`}>
        <Icon name="Loader2" size={size === 'sm' ? 16 : size === 'lg' ? 32 : 24} />
      </div>
      {message && (
        <p className={`${textSizeClasses?.[size]} text-muted-foreground font-body text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;