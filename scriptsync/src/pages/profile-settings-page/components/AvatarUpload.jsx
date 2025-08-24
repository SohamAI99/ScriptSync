import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const AvatarUpload = ({ currentAvatar, userName, onAvatarUpdate }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      ?.map(word => word?.[0])
      ?.join('')
      ?.toUpperCase()
      ?.slice(0, 2) || 'U';
  };

  const handleFileSelect = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setUploading(true);
        
        try {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // In a real app, you would upload to your server/storage
          const newAvatarUrl = e?.target?.result;
          onAvatarUpdate(newAvatarUrl);
        } catch (error) {
          console.error('Avatar upload failed:', error);
        } finally {
          setUploading(false);
        }
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    
    const file = e?.dataTransfer?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef?.current?.click();
  };

  const handleRemoveAvatar = () => {
    onAvatarUpdate(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Avatar Display */}
        <div
          className={`relative w-24 h-24 rounded-full border-2 transition-all duration-300 ${
            dragOver 
              ? 'border-primary border-dashed bg-primary/10' :'border-border'
          } ${uploading ? 'opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt={userName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-heading font-bold text-primary">
                {getInitials(userName)}
              </span>
            </div>
          )}
          
          {/* Upload Overlay */}
          {dragOver && (
            <div className="absolute inset-0 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="Upload" size={24} className="text-primary" />
            </div>
          )}

          {/* Loading Overlay */}
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center">
              <Icon name="Loader2" size={24} className="text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleClickUpload}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-floating transition-smooth hover:bg-primary/90 disabled:opacity-50"
          title="Upload new avatar"
        >
          <Icon name="Camera" size={16} />
        </button>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm font-body text-muted-foreground">
          Click the camera icon or drag & drop an image
        </p>
        <p className="text-xs font-body text-muted-foreground mt-1">
          Supports JPG, PNG up to 5MB
        </p>
      </div>

      {/* Actions */}
      {currentAvatar && (
        <div className="flex space-x-2">
          <button
            onClick={handleClickUpload}
            disabled={uploading}
            className="px-3 py-1.5 text-sm border border-border rounded-lg transition-smooth hover:bg-white/5 disabled:opacity-50 font-body"
          >
            Change
          </button>
          <button
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="px-3 py-1.5 text-sm text-destructive border border-destructive/20 rounded-lg transition-smooth hover:bg-destructive/10 disabled:opacity-50 font-body"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;