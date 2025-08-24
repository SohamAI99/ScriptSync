import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const UserContextMenu = ({ 
  user = null, 
  onLogout = () => {}, 
  className = '',
  trigger = null 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const menuItems = [
    {
      label: 'Profile',
      icon: 'User',
      action: () => {
        setIsOpen(false);
        navigate('/profile-page');
      },
      shortcut: null
    },
    {
      label: 'Settings',
      icon: 'Settings',
      action: () => {
        setIsOpen(false);
        navigate('/settings-page');
      },
      shortcut: null
    },
    {
      label: 'Keyboard Shortcuts',
      icon: 'Keyboard',
      action: () => {
        setIsOpen(false);
        // Show shortcuts modal
        alert('Keyboard shortcuts: \n\n? - Show shortcuts\nCtrl+S - Save\nCtrl+N - New script\nCtrl+/ - Toggle comments');
      },
      shortcut: '?'
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => {
        setIsOpen(false);
        // Navigate to help or show help modal
        alert('Help & Support:\n\nFor assistance, please contact:\nsupport@scriptsync.com\n\nDocumentation: github.com/scriptsync/docs');
      },
      shortcut: null
    },
    { type: 'divider' },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      action: () => {
        setIsOpen(false);
        onLogout();
      },
      shortcut: null,
      variant: 'destructive'
    }
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef?.current && 
      !menuRef?.current?.contains(event?.target) &&
      triggerRef?.current &&
      !triggerRef?.current?.contains(event?.target)
    ) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event?.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const defaultTrigger = (
    <button
      ref={triggerRef}
      onClick={handleToggle}
      className="flex items-center space-x-2 p-2 rounded-lg transition-smooth hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center overflow-hidden">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user?.name || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-white">
            {user?.name?.charAt(0) || 'U'}
          </span>
        )}
      </div>
      <div className="hidden sm:block text-left">
        <p className="text-sm font-body font-medium text-foreground">
          {user?.name || 'User'}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {user?.role || 'Writer'}
        </p>
      </div>
      <Icon 
        name="ChevronDown" 
        size={16} 
        className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
  );

  return (
    <div className={`relative ${className}`}>
      {trigger || defaultTrigger}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-64 glass-effect-hover border border-border rounded-lg shadow-elevated z-200 py-2"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-medium text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <p className="font-body font-medium text-foreground">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    user?.role === 'monitor' ? 'bg-secondary' : 'bg-primary'
                  }`} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {user?.role || 'Writer'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item, index) => {
              if (item?.type === 'divider') {
                return (
                  <hr key={index} className="my-2 border-border" />
                );
              }

              return (
                <button
                  key={index}
                  onClick={item?.action}
                  className={`w-full flex items-center justify-between px-4 py-2 transition-smooth text-left ${
                    item?.variant === 'destructive' ?'hover:bg-destructive/10 text-destructive' :'hover:bg-white/5 text-foreground'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={item?.icon} 
                      size={16} 
                      className={item?.variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'} 
                    />
                    <span className="font-body">{item?.label}</span>
                  </div>
                  {item?.shortcut && (
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {item?.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>ScriptSync v1.0</span>
              <span className="font-mono">
                {new Date()?.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContextMenu;