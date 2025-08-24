import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Camera, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import MainNavigation from '../../components/ui/MainNavigation';
import { authService } from '../../services/auth';

// Profile Avatar Component
const ProfileAvatar = ({ avatarUrl, onAvatarChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsUploading(false);
      onAvatarChange?.(URL.createObjectURL(file));
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    phone: '',
    dateOfBirth: '',
    avatarUrl: ''
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
        
        // Update profile data with real user data
        setProfileData(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          username: userData.email?.split('@')[0] || ''
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Use auth service to update profile with proper data persistence
      const response = await authService.updateUserProfile(profileData);
      
      if (response.success) {
        // Update local state with the response data
        setUser(response.data.user);
        
        if (response.offline) {
          alert('Profile updated successfully (saved locally)!');
        } else {
          alert('Profile updated successfully!');
        }
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Changes saved locally, will sync when online.');
      
      // Fallback: save to localStorage manually if auth service fails
      try {
        const updatedUser = {
          ...user,
          ...profileData,
          lastProfileUpdate: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Dispatch update event
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      } catch (fallbackError) {
        console.error('Fallback save failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
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
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your personal information and profile details
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-lg border border-border p-6 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-heading font-semibold text-foreground">
                Personal Information
              </h2>
            </div>

            <ProfileAvatar
              avatarUrl={profileData?.avatarUrl}
              onAvatarChange={(url) => setProfileData({...profileData, avatarUrl: url})}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;