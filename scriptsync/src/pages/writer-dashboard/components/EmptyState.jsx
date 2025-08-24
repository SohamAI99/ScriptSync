import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onCreateScript, hasFilters = false, onClearFilters }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <Icon name="Search" size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-heading font-bold text-foreground mb-2">
          No scripts match your filters
        </h3>
        <p className="text-muted-foreground font-body mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or filters to find the scripts you're looking for.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
        <Icon name="PenTool" size={48} className="text-primary" />
      </div>
      
      <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
        Ready to start writing?
      </h3>
      
      <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
        Create your first script and begin your creative journey. Collaborate with others, track your progress, and bring your stories to life.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          variant="default"
          onClick={onCreateScript}
          iconName="Plus"
          iconPosition="left"
          className="shadow-floating glow-primary"
        >
          Create Your First Script
        </Button>
        
        <Button
          variant="outline"
          iconName="BookOpen"
          iconPosition="left"
        >
          Browse Templates
        </Button>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="Users" size={24} className="text-primary" />
          </div>
          <h4 className="font-heading font-bold text-foreground mb-2">Real-time Collaboration</h4>
          <p className="text-sm text-muted-foreground font-body">
            Work together with your team in real-time with live editing and presence indicators.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="GitBranch" size={24} className="text-secondary" />
          </div>
          <h4 className="font-heading font-bold text-foreground mb-2">Version Control</h4>
          <p className="text-sm text-muted-foreground font-body">
            Track changes, create commits, and never lose your work with built-in version control.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="Share2" size={24} className="text-accent" />
          </div>
          <h4 className="font-heading font-bold text-foreground mb-2">Easy Sharing</h4>
          <p className="text-sm text-muted-foreground font-body">
            Share your scripts securely with customizable permissions and access controls.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;