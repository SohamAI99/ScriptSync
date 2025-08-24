import React from 'react';
import Button from '../../../components/ui/Button';

const ModalFooter = ({ 
  onCancel, 
  onSubmit, 
  isLoading = false, 
  canSubmit = true,
  submitText = "Create Script"
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-border">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="order-2 sm:order-1"
      >
        Cancel
      </Button>
      
      <Button
        variant="default"
        onClick={onSubmit}
        loading={isLoading}
        disabled={!canSubmit}
        iconName="Plus"
        iconPosition="left"
        className="order-1 sm:order-2 shadow-floating"
      >
        {submitText}
      </Button>
    </div>
  );
};

export default ModalFooter;