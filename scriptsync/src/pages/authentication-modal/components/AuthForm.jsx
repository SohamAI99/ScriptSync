import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthForm = ({ 
  mode = 'login', 
  onModeChange = () => {}, 
  onSubmit = () => {},
  isLoading = false,
  error = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'writer', // Default role
    rememberMe: false,
    acceptTerms: false
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    // Handle both input events and direct values (for Select component)
    if (typeof e === 'string') {
      // Direct value from Select component for role field
      setFormData(prev => ({
        ...prev,
        role: e
      }));
      
      // Clear validation error for role
      if (validationErrors?.role) {
        setValidationErrors(prev => ({
          ...prev,
          role: ''
        }));
      }
      return;
    }
    
    // Handle regular input events
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear validation error when user starts typing
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation (except for forgot password)
    if (mode !== 'forgot') {
      if (!formData?.password) {
        errors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.password)) {
        errors.password = 'Password must contain uppercase, lowercase, and number';
      }
    }

    // Registration specific validation
    if (mode === 'register') {
      if (!formData?.name) {
        errors.name = 'Full name is required';
      } else if (formData?.name?.length < 2) {
        errors.name = 'Name must be at least 2 characters long';
      }

      if (!formData?.role) {
        errors.role = 'Please select your role';
      } else if (!['writer', 'monitor'].includes(formData?.role)) {
        errors.role = 'Please select a valid role';
      }

      if (formData?.password !== formData?.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (!formData?.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password?.length >= 8) strength++;
    if (/[a-z]/?.test(password)) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/\d/?.test(password)) strength++;
    if (/[^a-zA-Z\d]/?.test(password)) strength++;

    const levels = [
      { label: 'Very Weak', color: 'bg-destructive' },
      { label: 'Weak', color: 'bg-warning' },
      { label: 'Fair', color: 'bg-warning' },
      { label: 'Good', color: 'bg-accent' },
      { label: 'Strong', color: 'bg-success' }
    ];

    return { strength, ...levels?.[Math.min(strength, 4)] };
  };

  const passwordStrength = mode === 'register' ? getPasswordStrength(formData?.password) : null;

  const getFormTitle = () => {
    switch (mode) {
      case 'register': return 'Create Your Account';
      case 'forgot': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getFormSubtitle = () => {
    switch (mode) {
      case 'register': return 'Join ScriptSync and start collaborating on scripts';
      case 'forgot': return 'Enter your email to receive a password reset link';
      default: return 'Sign in to continue your creative journey';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'register': return 'Create Account';
      case 'forgot': return 'Send Reset Link';
      default: return 'Sign In';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-muted-foreground font-body">
          {getFormSubtitle()}
        </p>
      </div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive font-body">{error}</p>
          </div>
        </div>
      )}
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field (Register only) */}
        {mode === 'register' && (
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData?.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            error={validationErrors?.name}
            required
          />
        )}

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          placeholder="Enter your email address"
          error={validationErrors?.email}
          required
        />

        {/* Password Field (Login & Register) */}
        {mode !== 'forgot' && (
          <div className="space-y-2">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData?.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                error={validationErrors?.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>

            {/* Password Strength Indicator (Register only) */}
            {mode === 'register' && formData?.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Password strength</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength?.strength >= 3 ? 'text-success' : 
                    passwordStrength?.strength >= 2 ? 'text-warning' : 'text-destructive'
                  }`}>
                    {passwordStrength?.label}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)]?.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < passwordStrength?.strength ? passwordStrength?.color : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirm Password Field (Register only) */}
        {mode === 'register' && (
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData?.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              error={validationErrors?.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>
        )}

        {/* Role Selection Field (Register only) */}
        {mode === 'register' && (
          <Select
            label="Account Type"
            name="role"
            value={formData?.role}
            onChange={handleInputChange}
            error={validationErrors?.role}
            required
            options={[
              { value: 'writer', label: 'Writer - Create and collaborate on scripts' },
              { value: 'monitor', label: 'Monitor - Review and manage scripts' }
            ]}
            placeholder="Select your account type"
          />
        )}



        {/* Accept Terms (Register only) */}
        {mode === 'register' && (
          <Checkbox
            label={
              <span className="text-sm">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 underline"
                  onClick={() => {/* Handle terms modal */}}
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 underline"
                  onClick={() => {/* Handle privacy modal */}}
                >
                  Privacy Policy
                </button>
              </span>
            }
            name="acceptTerms"
            checked={formData?.acceptTerms}
            onChange={handleInputChange}
            error={validationErrors?.acceptTerms}
            required
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          className="shadow-floating"
        >
          {getSubmitButtonText()}
        </Button>
      </form>
      {/* Form Mode Switching */}
      <div className="mt-6 text-center space-y-3">
        {mode === 'login' && (
          <>
            <button
              type="button"
              onClick={() => onModeChange('forgot')}
              className="text-sm text-primary hover:text-primary/80 transition-smooth font-body"
            >
              Forgot your password?
            </button>
            <p className="text-sm text-muted-foreground font-body">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onModeChange('register')}
                className="text-primary hover:text-primary/80 transition-smooth font-medium"
              >
                Sign up for free
              </button>
            </p>
          </>
        )}

        {mode === 'register' && (
          <p className="text-sm text-muted-foreground font-body">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onModeChange('login')}
              className="text-primary hover:text-primary/80 transition-smooth font-medium"
            >
              Sign in
            </button>
          </p>
        )}

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className="text-sm text-primary hover:text-primary/80 transition-smooth font-body"
          >
            Back to sign in
          </button>
        )}
      </div>

    </div>
  );
};

export default AuthForm;