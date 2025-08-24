import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from '../../authentication-modal/components/AuthForm';
import LoadingSpinner from '../../authentication-modal/components/LoadingSpinner';
import SuccessMessage from '../../authentication-modal/components/SuccessMessage';
import Icon from '../../../components/AppIcon';
import { authService } from '../../../services/auth';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const navigate = useNavigate();
  
  const [authMode, setAuthMode] = useState(initialMode);
  const [authState, setAuthState] = useState('form'); // 'form', 'loading', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setAuthState('form');
      setError(null);
      setIsLoading(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialMode]);

  const handleClose = () => {
    setAuthState('form');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const handleModeChange = (newMode) => {
    setAuthMode(newMode);
    setError(null);
    setAuthState('form');
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setAuthState('loading');

    try {
      let result;
      
      if (authMode === 'forgot') {
        // Handle password reset (implement later)
        setAuthState('success');
        return;
      }

      if (authMode === 'login') {
        result = await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role || 'writer'
        });
      }

      if (result.success) {
        setAuthenticatedUser(result.data.user);
        setAuthState('success');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
      setAuthState('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    if (authMode === 'forgot') {
      setAuthMode('login');
      setAuthState('form');
      return;
    }

    // Close modal and navigate to appropriate dashboard
    handleClose();
    const targetRoute = authenticatedUser?.role === 'monitor' ? '/monitor-dashboard' : '/writer-dashboard';
    navigate(targetRoute);
  };

  const getLoadingMessage = () => {
    switch (authMode) {
      case 'register': return 'Creating your account...';
      case 'forgot': return 'Sending reset link...';
      default: return 'Signing you in...';
    }
  };

  const renderContent = () => {
    switch (authState) {
      case 'loading':
        return (
          <LoadingSpinner 
            message={getLoadingMessage()}
            size="lg"
            className="py-8"
          />
        );
      
      case 'success':
        return (
          <SuccessMessage
            mode={authMode}
            userRole={authenticatedUser?.role || 'writer'}
            onContinue={handleSuccessContinue}
            autoRedirect={authMode !== 'forgot'}
            redirectDelay={3000}
          />
        );
      
      default:
        return (
          <AuthForm
            mode={authMode}
            onModeChange={handleModeChange}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            error={error}
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={handleClose}
          />
          
          {/* Modal container */}
          <motion.div
            initial={{ 
              opacity: 0, 
              y: "100%",
              scale: 0.95
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              y: "100%",
              scale: 0.95
            }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 500,
              duration: 0.4
            }}
            className="relative w-full max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass morphism container */}
            <div className="glass-effect-hover border border-border rounded-2xl shadow-elevated">
              {/* Close button */}
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full glass-effect border border-border flex items-center justify-center hover:glass-effect-hover transition-smooth"
                >
                  <Icon name="X" size={16} className="text-muted-foreground" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-12">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;