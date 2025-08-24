import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const DashboardHeader = ({ user, onNewScript }) => {
  const navigate = useNavigate();

  const getCurrentGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    return new Date()?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      {/* Greeting Section */}
      <div className="mb-4 sm:mb-0">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          {getCurrentGreeting()}, {user?.name || 'Writer'}!
        </h1>
        <p className="text-muted-foreground font-body">
          {getCurrentDate()} • Ready to create something amazing?
        </p>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          iconName="Search"
          iconPosition="left"
          onClick={() => {
            // Focus search input if available
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) searchInput?.focus();
          }}
          className="hidden sm:flex"
        >
          Search
        </Button>
        
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={onNewScript}
          className="shadow-floating glow-primary"
        >
          New Script
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;