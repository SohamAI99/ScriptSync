import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PasswordChangeForm = ({ onPasswordChange, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[a-z]/?.test(password)) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password) && /[!@#$%^&*(),.?":{}|<>]/?.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength >= 75) return 'bg-green-500';
    if (strength >= 50) return 'bg-yellow-500';
    if (strength >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = (strength) => {
    if (strength >= 75) return 'Strong';
    if (strength >= 50) return 'Medium';
    if (strength >= 25) return 'Weak';
    return 'Very Weak';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (getPasswordStrength(formData?.newPassword) < 50) {
      newErrors.newPassword = 'Password is too weak. Use a stronger password.';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData?.newPassword !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData?.currentPassword === formData?.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    const result = await onPasswordChange(formData);
    
    if (result?.success) {
      onCancel(); // Close form on success
    } else {
      setErrors({ submit: result?.error || 'Failed to change password' });
    }
  };

  const passwordStrength = getPasswordStrength(formData?.newPassword);

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-6 rounded-lg bg-background border border-border">
      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords?.current ? 'text' : 'password'}
              value={formData?.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e?.target?.value)}
              placeholder="Enter your current password"
              className={`w-full px-4 py-3 pr-12 rounded-lg bg-input border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
                errors?.currentPassword ? 'border-destructive' : 'border-border'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPasswords?.current ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
          {errors?.currentPassword && (
            <p className="mt-2 text-sm text-destructive font-body">{errors?.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords?.new ? 'text' : 'password'}
              value={formData?.newPassword}
              onChange={(e) => handleInputChange('newPassword', e?.target?.value)}
              placeholder="Enter your new password"
              className={`w-full px-4 py-3 pr-12 rounded-lg bg-input border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
                errors?.newPassword ? 'border-destructive' : 'border-border'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPasswords?.new ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData?.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-body">Password Strength</span>
                <span className={`text-xs font-body font-medium ${
                  passwordStrength >= 75 ? 'text-green-400' :
                  passwordStrength >= 50 ? 'text-yellow-400' :
                  passwordStrength >= 25 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
          
          {errors?.newPassword && (
            <p className="mt-2 text-sm text-destructive font-body">{errors?.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords?.confirm ? 'text' : 'password'}
              value={formData?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              placeholder="Confirm your new password"
              className={`w-full px-4 py-3 pr-12 rounded-lg bg-input border text-foreground placeholder-muted-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
                errors?.confirmPassword ? 'border-destructive' : 'border-border'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPasswords?.confirm ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
          {errors?.confirmPassword && (
            <p className="mt-2 text-sm text-destructive font-body">{errors?.confirmPassword}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-sm font-body font-medium text-foreground mb-2">
            Password Requirements:
          </div>
          <ul className="text-sm text-muted-foreground font-body space-y-1">
            <li className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                formData?.newPassword?.length >= 8 ? 'bg-success' : 'bg-muted-foreground'
              }`} />
              <span>At least 8 characters long</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                /[a-z]/?.test(formData?.newPassword) ? 'bg-success' : 'bg-muted-foreground'
              }`} />
              <span>Contains lowercase letters</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                /[A-Z]/?.test(formData?.newPassword) ? 'bg-success' : 'bg-muted-foreground'
              }`} />
              <span>Contains uppercase letters</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                /[0-9]/?.test(formData?.newPassword) && /[!@#$%^&*(),.?":{}|<>]/?.test(formData?.newPassword) 
                  ? 'bg-success' : 'bg-muted-foreground'
              }`} />
              <span>Contains numbers and special characters</span>
            </li>
          </ul>
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-border rounded-lg transition-smooth hover:bg-white/5 disabled:opacity-50 font-body"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-smooth hover:bg-primary/90 disabled:opacity-50 shadow-floating font-body"
          >
            {isLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
            <span>Update Password</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default PasswordChangeForm;