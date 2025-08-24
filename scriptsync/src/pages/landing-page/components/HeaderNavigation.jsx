import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeaderNavigation = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    if (href?.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = (mode) => {
    onAuthClick(mode);
  };

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>  
      <header className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled ? 'glass-effect-hover border-b border-border shadow-elevated' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand with enhanced animations */}
            <motion.div 
              className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
              onClick={handleBrandClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </motion.div>
                <motion.span 
                  className="text-xl font-heading font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ScriptSync
                </motion.span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((item) => (
                <button
                  key={item?.label}
                  onClick={() => handleNavClick(item?.href)}
                  className="text-muted-foreground hover:text-foreground transition-smooth font-body font-medium"
                >
                  {item?.label}
                </button>
              ))}
            </nav>

            {/* Desktop Auth Buttons with animations */}
            <motion.div 
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => handleAuthClick('login')}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10">Login</span>
                  <motion.div 
                    className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="default"
                  onClick={() => handleAuthClick('register')}
                  iconName="UserPlus"
                  iconPosition="left"
                  className="relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10">Register</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-smooth hover:bg-white/5"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-effect-hover border-t border-border">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <nav className="space-y-4">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.label}
                    onClick={() => handleNavClick(item?.href)}
                    className="block w-full text-left text-muted-foreground hover:text-foreground transition-smooth font-body font-medium py-2"
                  >
                    {item?.label}
                  </button>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-border space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => handleAuthClick('login')}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => handleAuthClick('register')}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-90 bg-background/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default HeaderNavigation;