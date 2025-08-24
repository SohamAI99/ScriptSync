import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HeaderNavigation from './components/HeaderNavigation';
import FooterSection from './components/FooterSection';
import AuthModal from './components/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    // Smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>ScriptSync - Collaborative Script Writing Platform</title>
        <meta name="description" content="Create, collaborate, and perfect your scripts in real-time with professional writers and monitors. Experience the future of screenplay development with ScriptSync." />
        <meta name="keywords" content="script writing, collaboration, screenplay, real-time editing, version control, script sharing" />
        <meta property="og:title" content="ScriptSync - Collaborative Script Writing Platform" />
        <meta property="og:description" content="Professional collaborative script writing platform with real-time editing, version control, and secure sharing." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ScriptSync - Collaborative Script Writing Platform" />
        <meta name="twitter:description" content="Create, collaborate, and perfect your scripts in real-time with professional writers and monitors." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Header Navigation */}
        <HeaderNavigation onAuthClick={handleOpenAuthModal} />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <HeroSection onAuthClick={handleOpenAuthModal} />

          {/* Features Section */}
          <FeaturesSection onAuthClick={handleOpenAuthModal} />
        </main>

        {/* Footer */}
        <FooterSection />

        {/* Authentication Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
          initialMode={authMode}
        />
      </div>
    </>
  );
};

export default LandingPage;