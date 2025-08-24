import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import UserContextMenu from './UserContextMenu';

const MainNavigation = ({ user: initialUser = null, isAuthenticated = false, onLogout = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(initialUser);

  // Listen for user updates from profile settings
  useEffect(() => {
    const handleUserUpdate = (event) => {
      setUser(event.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  // Update user when initialUser changes
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/writer-dashboard',
      icon: 'Home',
      roles: ['writer']
    },
    {
      label: 'Monitor',
      path: '/monitor-dashboard',
      icon: 'CheckCircle',
      roles: ['monitor']
    },
    {
      label: 'Scripts',
      path: '/writer-dashboard',
      icon: 'FileText',
      roles: ['writer', 'monitor']
    }
  ];

  const filteredNavItems = navigationItems?.filter(item => 
    !item?.roles || item?.roles?.includes(user?.role)
  );

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleBrandClick = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'monitor' ? '/monitor-dashboard' : '/writer-dashboard');
    } else {
      navigate('/landing-page');
    }
  };

  const handleAuthAction = () => {
    if (!isAuthenticated) {
      navigate('/authentication-modal');
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 z-100 glass-effect border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Brand */}
          <div 
            className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
            onClick={handleBrandClick}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              <span className="text-xl font-heading font-bold text-foreground">
                ScriptSync
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {filteredNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth font-body font-medium ${
                    isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary glow-primary' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserContextMenu 
                user={user}
                onLogout={onLogout}
              />
            ) : (
              <Button
                variant="outline"
                onClick={handleAuthAction}
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            {isAuthenticated && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-smooth hover:bg-white/5"
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden glass-effect-hover border-t border-border">
            <nav className="p-4 space-y-2">
              {filteredNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth font-body font-medium ${
                    isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-100 glass-effect border-t border-border">
          <nav className="flex items-center justify-around h-18 px-2">
            {filteredNavItems?.slice(0, 4)?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-smooth ${
                  isActivePath(item?.path)
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="text-xs font-caption">{item?.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default MainNavigation;