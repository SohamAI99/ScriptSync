import React from 'react';
import Icon from '../../../components/AppIcon';

const PersonalInfoTab = ({ user, onUserUpdate, errors, onSave, isLoading }) => {
  const handleInputChange = (field, value) => {
    onUserUpdate(field, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Personal Information
        </h2>
        <p className="text-muted-foreground font-body">
          Update your personal details and profile information.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={user?.name || ''}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 rounded-lg bg-input border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
              errors?.name ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors?.name && (
            <p className="mt-2 text-sm text-destructive font-body">{errors?.name}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Username *
          </label>
          <input
            type="text"
            value={user?.username || ''}
            onChange={(e) => handleInputChange('username', e?.target?.value)}
            placeholder="Enter your username"
            className={`w-full px-4 py-3 rounded-lg bg-input border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
              errors?.username ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors?.username && (
            <p className="mt-2 text-sm text-destructive font-body">{errors?.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={user?.email || ''}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 rounded-lg bg-input border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
              errors?.email ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors?.email && (
            <p className="mt-2 text-sm text-destructive font-body">{errors?.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={user?.phone || ''}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            placeholder="Enter your phone number"
            className={`w-full px-4 py-3 rounded-lg bg-input border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
              errors?.phone ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors?.phone && (
            <p className="mt-2 text-sm text-destructive font-body">{errors?.phone}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={user?.dateOfBirth || ''}
            onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body"
            max={new Date()?.toISOString()?.split('T')?.[0]}
          />
        </div>
      </div>
      {/* Bio */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-2">
          Bio
        </label>
        <textarea
          value={user?.bio || ''}
          onChange={(e) => handleInputChange('bio', e?.target?.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground resize-none transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body"
        />
        <div className="mt-2 text-right">
          <span className="text-sm text-muted-foreground">
            {user?.bio?.length || 0}/500
          </span>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-border">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg transition-smooth hover:bg-primary/90 disabled:opacity-50 shadow-floating font-body"
        >
          {isLoading && <Icon name="Loader2" size={20} className="animate-spin" />}
          <span>Save Changes</span>
        </button>
      </div>
      {/* Error Message */}
      {errors?.submit && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive font-body">{errors?.submit}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTab;