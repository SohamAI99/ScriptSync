import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Shield, Bell, Palette, Save, Camera, Key, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import MainNavigation from '../../components/ui/MainNavigation';
import { cn } from '../../utils/cn';
import Icon from '../../components/AppIcon';
import { authService } from '../../services/auth';
import api from '../../services/api';


// Profile Avatar Component
const ProfileAvatar = ({ avatarUrl, onAvatarChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('avatar', file);

        // Upload to server
        const response = await api.post('/users/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          onAvatarChange?.(response.data.data.avatar_url);
        } else {
          throw new Error(response.data.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Avatar upload error:', error);
        alert('Failed to upload avatar');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden glass-effect border-2 border-border">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/20">
              <User className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
        
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="sr-only"
          id="avatar-upload"
          disabled={isUploading}
        />
        <label htmlFor="avatar-upload">
          <Button
            asChild
            variant="outline"
            size="sm"
            iconName="Camera"
            disabled={isUploading}
          >
            <span className="cursor-pointer">
              {isUploading ? 'Uploading...' : 'Change Avatar'}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG or GIF. Max 2MB.
        </p>
      </div>
    </div>
  );
};

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

const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedPreferences = localStorage.getItem('userPreferences');
    const storedSecurity = localStorage.getItem('userSecurity');
    
    if (storedAuth === 'true' && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Update profile data with real user data
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          username: userData.email?.split('@')[0] || '',
          bio: userData.bio || '',
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth || '',
          avatarUrl: userData.avatarUrl || ''
        });
        
        // Load preferences from localStorage if available
        if (storedPreferences) {
          try {
            const userPrefs = JSON.parse(storedPreferences);
            setPreferences(prev => ({ ...prev, ...userPrefs }));
          } catch (error) {
            console.error('Error parsing preferences:', error);
          }
        }
        
        // Load security settings from localStorage if available
        if (storedSecurity) {
          try {
            const userSecurity = JSON.parse(storedSecurity);
            setSecurity(prev => ({ ...prev, ...userSecurity }));
          } catch (error) {
            console.error('Error parsing security settings:', error);
          }
        }
        
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    phone: '',
    dateOfBirth: '',
    avatarUrl: ''
  });

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

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

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
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // Prepare profile updates (excluding avatarUrl as it's handled separately)
      const profileUpdates = {
        name: profileData.name,
        bio: profileData.bio,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth
      };
      
      // Use auth service to update profile with proper data persistence
      const response = await authService.updateUserProfile(profileUpdates);
      
      if (response.success) {
        // Update local state with the response data
        setUser(response.data.user);
        
        // Save preferences and security settings separately
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        localStorage.setItem('userSecurity', JSON.stringify(security));
        
        setIsLoading(false);
        
        if (response.offline) {
          alert('✅ Profile updated successfully (saved locally)!');
        } else {
          alert('✅ Profile updated successfully!');
        }
      } else {
        throw new Error('Profile update failed');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
      alert('❌ Failed to update profile. Changes saved locally, will sync when online.');
      
      // Fallback: save to localStorage manually if auth service fails
      try {
        const updatedUser = {
          ...user,
          ...profileData,
          lastProfileUpdate: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        localStorage.setItem('userSecurity', JSON.stringify(security));
        setUser(updatedUser);
        
        // Dispatch update event
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      } catch (fallbackError) {
        console.error('Fallback save failed:', fallbackError);
      }
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
      
      <div className="pt-16"> {/* Add padding for fixed navbar */}
      {/* Header */}
      <div className="glass-effect border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Profile Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
            <Button
              onClick={handleProfileUpdate}
              loading={isLoading}
              iconName="Save"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <SettingsSection title="Personal Information" icon={User}>
                <ProfileAvatar
                  avatarUrl={profileData?.avatarUrl}
                  onAvatarChange={(url) => setProfileData({...profileData, avatarUrl: url})}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileData?.name}
                    onChange={(e) => setProfileData({...profileData, name: e?.target?.value})}
                    required
                  />
                  <Input
                    label="Username"
                    value={profileData?.username}
                    onChange={(e) => setProfileData({...profileData, username: e?.target?.value})}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={profileData?.email}
                  onChange={(e) => setProfileData({...profileData, email: e?.target?.value})}
                  required
                  disabled
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    value={profileData?.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e?.target?.value})}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={profileData?.dateOfBirth}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e?.target?.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Bio
                  </label>
                  <textarea
                    className="w-full h-20 px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Tell us about yourself..."
                    value={profileData?.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e?.target?.value})}
                  />
                </div>
              </SettingsSection>
            )}

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
      </div> {/* Close the pt-16 div */}
    </div>
  );
};

export default ProfileSettingsPage;                  />

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
      </div> {/* Close the pt-16 div */}
    </div>
  );
};

export default ProfileSettingsPage;