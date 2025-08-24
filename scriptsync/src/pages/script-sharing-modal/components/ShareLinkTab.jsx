import React from 'react';

import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import ExpirationDatePicker from './ExpirationDatePicker';

const ShareLinkTab = ({
  shareForm,
  onFormChange,
  permissionOptions,
  errors,
  passwordStrength,
  expirationPresets
}) => {
  const handleInputChange = (field, value) => {
    onFormChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTogglePassword = () => {
    const newValue = !shareForm?.passwordProtected;
    onFormChange(prev => ({
      ...prev,
      passwordProtected: newValue,
      password: newValue ? prev?.password : ''
    }));
  };

  return (
    <div className="space-y-6">
      {/* Permission Level */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-3">
          Permission Level
        </label>
        <div className="space-y-3">
          {permissionOptions?.map(option => (
            <div
              key={option?.value}
              className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
                shareForm?.permission === option?.value
                  ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
              }`}
              onClick={() => handleInputChange('permission', option?.value)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
                  shareForm?.permission === option?.value
                    ? 'border-primary bg-primary' :'border-muted-foreground'
                }`}>
                  {shareForm?.permission === option?.value && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-body font-medium text-foreground">
                    {option?.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option?.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Options */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-3">
          Security Options
        </label>
        <div className="space-y-4">
          {/* Password Protection */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div>
              <div className="font-body font-medium text-foreground">
                Password Protection
              </div>
              <div className="text-sm text-muted-foreground">
                Require a password to access the script
              </div>
            </div>
            <button
              onClick={handleTogglePassword}
              className={`relative w-12 h-6 rounded-full transition-smooth ${
                shareForm?.passwordProtected ? 'bg-primary' : 'bg-border'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-smooth ${
                shareForm?.passwordProtected ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Password Input */}
          {shareForm?.passwordProtected && (
            <div>
              <input
                type="password"
                value={shareForm?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              />
              {shareForm?.password && (
                <PasswordStrengthIndicator strength={passwordStrength} />
              )}
              {errors?.password && (
                <p className="mt-2 text-sm text-destructive font-body">{errors?.password}</p>
              )}
            </div>
          )}

          {/* Download Permission */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div>
              <div className="font-body font-medium text-foreground">
                Allow Downloads
              </div>
              <div className="text-sm text-muted-foreground">
                Allow users to download the script
              </div>
            </div>
            <button
              onClick={() => handleInputChange('allowDownload', !shareForm?.allowDownload)}
              className={`relative w-12 h-6 rounded-full transition-smooth ${
                shareForm?.allowDownload ? 'bg-primary' : 'bg-border'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-smooth ${
                shareForm?.allowDownload ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
      {/* Expiration Date */}
      <ExpirationDatePicker
        expirationDate={shareForm?.expirationDate}
        onDateChange={(date) => handleInputChange('expirationDate', date)}
        presets={expirationPresets}
      />
    </div>
  );
};

export default ShareLinkTab;