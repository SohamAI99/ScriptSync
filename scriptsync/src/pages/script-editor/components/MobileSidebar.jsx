import React from 'react';

import Button from '../../../components/ui/Button';

const MobileSidebar = ({ 
  isOpen = false,
  side = 'left', // 'left' or 'right'
  onClose = () => {},
  children,
  title = '',
  className = ''
}) => {
  const handleOverlayClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-1000 md:hidden"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" />
      
      {/* Sidebar */}
      <div className={`absolute top-0 bottom-0 w-80 max-w-[85vw] glass-effect-hover border-border shadow-elevated transform transition-transform duration-300 ${
        side === 'left' 
          ? `left-0 border-r ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
          : `right-0 border-l ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
      } ${className}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-foreground">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;