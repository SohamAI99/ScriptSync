import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessMessage = ({ 
  mode = 'login',
  userRole = 'writer',
  onContinue = () => {},
  autoRedirect = true,
  redirectDelay = 3000
}) => {
  useEffect(() => {
    if (autoRedirect) {
      const timer = setTimeout(() => {
        onContinue();
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [autoRedirect, redirectDelay, onContinue]);

  const getSuccessMessage = () => {
    switch (mode) {
      case 'register':
        return {
          title: 'Account Created Successfully!',
          message: `Welcome to ScriptSync! Your ${userRole} account is ready to use.`,
          icon: 'CheckCircle',
          iconColor: 'text-success'
        };
      case 'forgot':
        return {
          title: 'Reset Link Sent!',
          message: 'Check your email for password reset instructions.',
          icon: 'Mail',
          iconColor: 'text-primary'
        };
      default:
        return {
          title: 'Welcome Back!',
          message: `Successfully signed in. Redirecting to your ${userRole} dashboard...`,
          icon: 'CheckCircle',
          iconColor: 'text-success'
        };
    }
  };

  const successData = getSuccessMessage();

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className={`w-16 h-16 rounded-full bg-success/10 flex items-center justify-center ${successData?.iconColor}`}>
          <Icon name={successData?.icon} size={32} />
        </div>
      </div>
      {/* Success Message */}
      <div className="space-y-2">
        <h3 className="text-xl font-heading font-bold text-foreground">
          {successData?.title}
        </h3>
        <p className="text-muted-foreground font-body">
          {successData?.message}
        </p>
      </div>
      {/* Additional Info for Registration */}
      {mode === 'register' && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-primary font-medium mb-1">
                Getting Started
              </p>
              <ul className="text-xs text-primary/80 space-y-1">
                <li>• Create your first script project</li>
                <li>• Invite collaborators to join</li>
                <li>• Explore real-time editing features</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Additional Info for Password Reset */}
      {mode === 'forgot' && (
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={16} className="text-warning mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-warning font-medium mb-1">
                What's Next?
              </p>
              <p className="text-xs text-warning/80">
                The reset link will expire in 1 hour. Check your spam folder if you don't see the email.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="space-y-3">
        {mode !== 'forgot' && (
          <Button
            variant="default"
            fullWidth
            onClick={onContinue}
            iconName="ArrowRight"
            iconPosition="right"
            className="shadow-floating"
          >
            Continue to Dashboard
          </Button>
        )}

        {mode === 'forgot' && (
          <Button
            variant="outline"
            fullWidth
            onClick={onContinue}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Sign In
          </Button>
        )}
      </div>
      {/* Auto-redirect indicator */}
      {autoRedirect && mode !== 'forgot' && (
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>Redirecting automatically in {Math.ceil(redirectDelay / 1000)} seconds...</span>
        </div>
      )}
    </div>
  );
};

export default SuccessMessage;