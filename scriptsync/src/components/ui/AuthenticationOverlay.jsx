import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const AuthenticationOverlay = ({ isOpen = false, onClose = () => {}, onAuthenticate = () => {} }) => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'writer'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (authMode !== 'forgot') {
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'register') {
      if (!formData?.name) {
        newErrors.name = 'Name is required';
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (authMode === 'forgot') {
        // Handle password reset
        setAuthMode('login');
        // Show success message
      } else {
        // Handle login/register
        const userData = {
          id: Date.now(),
          name: formData?.name || 'User',
          email: formData?.email,
          role: formData?.role
        };
        
        onAuthenticate(userData);
        onClose();
        
        // Navigate to appropriate dashboard
        navigate(formData?.role === 'monitor' ? '/monitor-dashboard' : '/writer-dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: 'writer'
    });
    setErrors({});
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    resetForm();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (authMode) {
      case 'register': return 'Create Account';
      case 'forgot': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case 'register': return 'Join ScriptSync and start collaborating';
      case 'forgot': return 'Enter your email to reset your password';
      default: return 'Sign in to continue your creative journey';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-1000 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" />
      {/* Modal */}
      <div className="relative w-full max-w-md glass-effect-hover border border-border rounded-2xl shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-lg font-heading font-bold text-foreground">
              ScriptSync
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-smooth hover:bg-white/5"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              {getTitle()}
            </h2>
            <p className="text-muted-foreground font-body">
              {getSubtitle()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData?.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                error={errors?.name}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              error={errors?.email}
              required
            />

            {authMode !== 'forgot' && (
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData?.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                error={errors?.password}
                required
              />
            )}

            {authMode === 'register' && (
              <>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData?.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  error={errors?.confirmPassword}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-body font-medium text-foreground">
                    Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'writer' }))}
                      className={`p-3 rounded-lg border transition-smooth ${
                        formData?.role === 'writer' ?'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon name="PenTool" size={20} className="mx-auto mb-1" />
                      <span className="block text-sm font-body">Writer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'monitor' }))}
                      className={`p-3 rounded-lg border transition-smooth ${
                        formData?.role === 'monitor' ?'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon name="Eye" size={20} className="mx-auto mb-1" />
                      <span className="block text-sm font-body">Monitor</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {errors?.submit && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-body">{errors?.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={isLoading}
              className="shadow-floating"
            >
              {authMode === 'register' ? 'Create Account' : 
               authMode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {authMode === 'login' && (
              <>
                <button
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-primary hover:text-primary/80 transition-smooth font-body"
                >
                  Forgot your password?
                </button>
                <p className="text-sm text-muted-foreground font-body">
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchMode('register')}
                    className="text-primary hover:text-primary/80 transition-smooth"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}

            {authMode === 'register' && (
              <p className="text-sm text-muted-foreground font-body">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-primary hover:text-primary/80 transition-smooth"
                >
                  Sign in
                </button>
              </p>
            )}

            {authMode === 'forgot' && (
              <button
                onClick={() => switchMode('login')}
                className="text-sm text-primary hover:text-primary/80 transition-smooth font-body"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationOverlay;