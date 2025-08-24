import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsToolbar = ({ 
  selectedScripts, 
  onBulkAssign, 
  onBulkStatusChange, 
  onBulkDelete,
  onClearSelection 
}) => {
  const [showActions, setShowActions] = useState(false);

  const reviewerOptions = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-wilson', label: 'Mike Wilson' },
    { value: 'sarah-davis', label: 'Sarah Davis' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'approved', label: 'Approved' },
    { value: 'changes-requested', label: 'Request Changes' }
  ];

  const handleBulkAssign = (reviewerId) => {
    onBulkAssign(selectedScripts, reviewerId);
    setShowActions(false);
  };

  const handleBulkStatusChange = (status) => {
    onBulkStatusChange(selectedScripts, status);
    setShowActions(false);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedScripts?.length} script(s)? This action cannot be undone.`)) {
      onBulkDelete(selectedScripts);
      setShowActions(false);
    }
  };

  if (selectedScripts?.length === 0) {
    return null;
  }

  return (
    <div className="glass-effect border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-body font-medium text-foreground">
              {selectedScripts?.length} script{selectedScripts?.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName={showActions ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setShowActions(!showActions)}
          >
            Bulk Actions
          </Button>
        </div>
      </div>
      {showActions && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Assign Reviewer */}
            <div className="space-y-2">
              <label className="text-sm font-body font-medium text-foreground">
                Assign Reviewer
              </label>
              <Select
                placeholder="Select reviewer"
                options={reviewerOptions}
                onChange={handleBulkAssign}
                className="w-full"
              />
            </div>

            {/* Change Status */}
            <div className="space-y-2">
              <label className="text-sm font-body font-medium text-foreground">
                Change Status
              </label>
              <Select
                placeholder="Select status"
                options={statusOptions}
                onChange={handleBulkStatusChange}
                className="w-full"
              />
            </div>

            {/* Danger Actions */}
            <div className="space-y-2">
              <label className="text-sm font-body font-medium text-foreground">
                Danger Zone
              </label>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={handleBulkDelete}
                fullWidth
              >
                Delete Selected
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Quick Actions:</span>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={() => handleBulkStatusChange('approved')}
              >
                Approve All
              </Button>

              <Button
                variant="ghost"
                size="sm"
                iconName="Clock"
                iconPosition="left"
                onClick={() => handleBulkStatusChange('in-progress')}
              >
                Mark In Progress
              </Button>

              <Button
                variant="ghost"
                size="sm"
                iconName="AlertCircle"
                iconPosition="left"
                onClick={() => handleBulkStatusChange('changes-requested')}
              >
                Request Changes
              </Button>

              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => {
                  // Handle bulk export
                  console.log('Exporting selected scripts:', selectedScripts);
                }}
              >
                Export All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsToolbar;