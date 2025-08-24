import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ProfileAvatar = ({ avatarUrl, onAvatarChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      // Validate file type
      if (!file?.type?.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (2MB limit)
      if (file?.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      setIsUploading(true);
      
      try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create object URL for preview
        const imageUrl = URL.createObjectURL(file);
        onAvatarChange?.(imageUrl);
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Error uploading avatar. Please try again.');
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
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          <Camera className="w-5 h-5 text-foreground" />
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
          accept="image/jpeg,image/png,image/gif,image/webp"
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
            disabled={isUploading}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Change Avatar'}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, GIF or WebP. Max 2MB.
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;