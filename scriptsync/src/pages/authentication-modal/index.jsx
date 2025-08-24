import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalContainer from './components/ModalContainer';
import AuthForm from './components/AuthForm';
import LoadingSpinner from './components/LoadingSpinner';
import SuccessMessage from './components/SuccessMessage';
import { authService } from '../../services/auth';

const AuthenticationModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
  const [authState, setAuthState] = useState('form'); // 'form', 'loading', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    // Check if modal should be open based on route
    const shouldBeOpen = location?.pathname === '/authentication-modal';
    if (!shouldBeOpen) {
      handleClose();
    }
  }, [location?.pathname]);

  const handleClose = () => {
    setAuthState('form');
    setError(null);
    setIsLoading(false);
    navigate('/landing-page');
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

    // Navigate to appropriate dashboard
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
    <ModalContainer
      isOpen={location?.pathname === '/authentication-modal'}
      onClose={handleClose}
      className="max-w-lg"
    >
      {renderContent()}
    </ModalContainer>
  );
};

export default AuthenticationModal;