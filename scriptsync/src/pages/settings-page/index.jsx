import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Bell, Palette, Save, Key, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import MainNavigation from '../../components/ui/MainNavigation';
import { cn } from '../../utils/cn';

// Settings Section Component
const SettingsSection = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-effect rounded-lg border border-border p-6 space-y-4"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h2 className="text-lg font-heading font-semibold text-foreground">
        {title}
      </h2>
    </div>
    {children}
  </motion.div>
);

// Toggle Component
const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange?.(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        enabled ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  </div>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security');

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    autosaveInterval: '30',
    emailNotifications: true,
    pushNotifications: false,
    collaborationAlerts: true,
    weeklyDigest: true
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true
  });

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedAuth === 'true' && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const themeOptions = [
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'auto', label: 'System Default' }
  ];

  const autosaveOptions = [
    { value: '10', label: 'Every 10 seconds' },
    { value: '30', label: 'Every 30 seconds' },
    { value: '60', label: 'Every minute' },
    { value: '300', label: 'Every 5 minutes' }
  ];

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleSettingsUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Save settings to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      localStorage.setItem('userSecurity', JSON.stringify(security));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Settings updated successfully!');
    } catch (error) {
      alert('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    // This would open a password change modal or navigate to a password change page
    alert('Password change functionality would be implemented here');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion functionality would be implemented here');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  if (!user || !isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation 
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
      <div className="pt-16">
        {/* Header */}
        <div className="glass-effect border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings, security, and preferences
                </p>
              </div>
              <Button
                onClick={handleSettingsUpdate}
                loading={isLoading}
                iconName="Save"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 shrink-0">
              <div className="glass-effect rounded-lg border border-border p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs?.map(tab => {
                    const Icon = tab?.icon;
                    return (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={cn(
                          "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-smooth",
                          activeTab === tab?.id
                            ? "bg-primary/20 text-primary border border-primary/30" 
                            : "hover:glass-effect-hover text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab?.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              {/* Security Tab */}
              {activeTab === 'security' && (
                <SettingsSection title="Security Settings" icon={Shield}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-foreground">Password</h3>
                        <p className="text-xs text-muted-foreground">Last updated 2 months ago</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Key"
                        onClick={handlePasswordChange}
                      >
                        Change Password
                      </Button>
                    </div>

                    <Toggle
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                      enabled={security?.twoFactorEnabled}
                      onChange={(value) => setSecurity({...security, twoFactorEnabled: value})}
                    />

                    <Toggle
                      label="Login Alerts"
                      description="Get notified when someone logs into your account"
                      enabled={security?.loginAlerts}
                      onChange={(value) => setSecurity({...security, loginAlerts: value})}
                    />

                    <div className="border-t border-destructive/30 pt-4">
                      <div className="flex items-center justify-between p-4 glass-effect rounded-lg border border-destructive/30">
                        <div>
                          <h3 className="text-sm font-medium text-destructive">Delete Account</h3>
                          <p className="text-xs text-muted-foreground">Permanently remove your account and all data</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          iconName="Trash2"
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </SettingsSection>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <SettingsSection title="App Preferences" icon={Palette}>
                  <div className="space-y-4">
                    <Select
                      label="Theme"
                      options={themeOptions}
                      value={preferences?.theme}
                      onChange={(value) => setPreferences({...preferences, theme: value})}
                    />

                    <Select
                      label="Autosave Interval"
                      options={autosaveOptions}
                      value={preferences?.autosaveInterval}
                      onChange={(value) => setPreferences({...preferences, autosaveInterval: value})}
                    />
                  </div>
                </SettingsSection>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <SettingsSection title="Notification Settings" icon={Bell}>
                  <div className="space-y-4">
                    <Toggle
                      label="Email Notifications"
                      description="Receive updates and alerts via email"
                      enabled={preferences?.emailNotifications}
                      onChange={(value) => setPreferences({...preferences, emailNotifications: value})}
                    />

                    <Toggle
                      label="Push Notifications"
                      description="Get real-time notifications in your browser"
                      enabled={preferences?.pushNotifications}
                      onChange={(value) => setPreferences({...preferences, pushNotifications: value})}
                    />

                    <Toggle
                      label="Collaboration Alerts"
                      description="Notifications when collaborators make changes"
                      enabled={preferences?.collaborationAlerts}
                      onChange={(value) => setPreferences({...preferences, collaborationAlerts: value})}
                    />

                    <Toggle
                      label="Weekly Digest"
                      description="Get a weekly summary of your activity"
                      enabled={preferences?.weeklyDigest}
                      onChange={(value) => setPreferences({...preferences, weeklyDigest: value})}
                    />
                  </div>
                </SettingsSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;