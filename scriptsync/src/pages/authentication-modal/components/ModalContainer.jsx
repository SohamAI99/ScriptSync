import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ModalContainer = ({ 
  isOpen = false, 
  onClose = () => {}, 
  children,
  className = '' 
}) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape') {
        onClose();
      }
    };

    const handleBodyScroll = () => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      handleBodyScroll();
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-1000 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-md glass-effect-hover border border-border rounded-2xl shadow-elevated ${className}`}>
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-lg font-heading font-bold text-foreground" id="modal-title">
              ScriptSync
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-smooth hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>Secure</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="Lock" size={12} />
              <span>Encrypted</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="Zap" size={12} />
              <span>Fast</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;