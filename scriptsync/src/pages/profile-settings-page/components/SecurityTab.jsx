import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import PasswordChangeForm from './PasswordChangeForm';
import TwoFactorSetup from './TwoFactorSetup';

const SecurityTab = ({
  user,
  securityData,
  settings,
  onPasswordChange,
  onLogoutSession,
  onLogoutAllSessions,
  onSettingsUpdate,
  isLoading
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

  const formatLastActive = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(date)?.toLocaleDateString();
  };

  const getDeviceIcon = (device) => {
    if (device?.toLowerCase()?.includes('iphone') || device?.toLowerCase()?.includes('mobile')) {
      return 'Smartphone';
    }
    if (device?.toLowerCase()?.includes('ipad') || device?.toLowerCase()?.includes('tablet')) {
      return 'Tablet';
    }
    return 'Monitor';
  };

  const handleToggleTwoFactor = () => {
    if (settings?.twoFactorEnabled) {
      // Disable 2FA
      onSettingsUpdate('twoFactorEnabled', false);
    } else {
      // Show setup modal
      setShowTwoFactorSetup(true);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Security Settings
        </h2>
        <p className="text-muted-foreground font-body">
          Manage your account security and active sessions.
        </p>
      </div>
      {/* Password Section */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Password
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              Last changed 3 months ago
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 border border-border rounded-lg transition-smooth hover:bg-white/5 font-body"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && (
          <PasswordChangeForm
            onPasswordChange={onPasswordChange}
            onCancel={() => setShowPasswordForm(false)}
            isLoading={isLoading}
          />
        )}
      </div>
      {/* Two-Factor Authentication */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              {settings?.twoFactorEnabled 
                ? 'Your account is protected with 2FA' :'Add an extra layer of security to your account'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {settings?.twoFactorEnabled && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 text-success rounded-full">
                <Icon name="Shield" size={14} />
                <span className="text-sm font-body">Enabled</span>
              </div>
            )}
            <button
              onClick={handleToggleTwoFactor}
              className={`px-4 py-2 rounded-lg transition-smooth font-body ${
                settings?.twoFactorEnabled
                  ? 'border border-destructive/20 text-destructive hover:bg-destructive/10' :'border border-primary/20 text-primary hover:bg-primary/10'
              }`}
            >
              {settings?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>

        {showTwoFactorSetup && (
          <TwoFactorSetup
            onComplete={(enabled) => {
              onSettingsUpdate('twoFactorEnabled', enabled);
              setShowTwoFactorSetup(false);
            }}
            onCancel={() => setShowTwoFactorSetup(false)}
          />
        )}
      </div>
      {/* Active Sessions */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Active Sessions
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              Monitor and manage your account sessions
            </p>
          </div>
          <button
            onClick={onLogoutAllSessions}
            className="px-4 py-2 border border-destructive/20 text-destructive rounded-lg transition-smooth hover:bg-destructive/10 font-body"
          >
            Logout All Sessions
          </button>
        </div>

        <div className="space-y-4">
          {securityData?.activeSessions?.map(session => (
            <div
              key={session?.id}
              className={`p-4 rounded-lg border transition-smooth ${
                session?.current 
                  ? 'border-primary/20 bg-primary/5' :'border-border hover:bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    session?.current ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={getDeviceIcon(session?.device)} 
                      size={20} 
                      className={session?.current ? 'text-primary' : 'text-muted-foreground'}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-body font-medium text-foreground">
                        {session?.device}
                      </h4>
                      {session?.current && (
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full font-body">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-body">
                      {session?.browser}
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground font-body">
                      <span>{session?.location}</span>
                      <span>•</span>
                      <span>{session?.ip}</span>
                      <span>•</span>
                      <span>{formatLastActive(session?.lastActive)}</span>
                    </div>
                  </div>
                </div>

                {!session?.current && (
                  <button
                    onClick={() => onLogoutSession(session?.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-smooth"
                    title="Logout this session"
                  >
                    <Icon name="LogOut" size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Login Activity */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Recent Activity
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              Monitor recent login attempts and activities
            </p>
          </div>
          <button className="px-4 py-2 border border-border rounded-lg transition-smooth hover:bg-white/5 font-body">
            View All Activity
          </button>
        </div>

        <div className="space-y-3">
          {[
            {
              action: 'Successful login',
              device: 'MacBook Pro',
              time: '2 hours ago',
              location: 'San Francisco, CA'
            },
            {
              action: 'Password changed',
              device: 'MacBook Pro',
              time: '3 months ago',
              location: 'San Francisco, CA'
            },
            {
              action: 'Successful login',
              device: 'iPhone 15',
              time: '1 day ago',
              location: 'San Francisco, CA'
            }
          ]?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div>
                  <span className="font-body text-foreground">{activity?.action}</span>
                  <span className="text-muted-foreground"> on {activity?.device}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-body">
                {activity?.time} • {activity?.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;