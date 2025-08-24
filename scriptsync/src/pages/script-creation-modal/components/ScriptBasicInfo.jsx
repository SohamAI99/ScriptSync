import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScriptBasicInfo = ({ 
  formData, 
  onInputChange, 
  errors = {},
  categories = []
}) => {
  const handleChange = (e) => {
    const { name, value } = e?.target;
    onInputChange(name, value);
  };

  const handleCategoryChange = (value) => {
    onInputChange('category', value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Create New Script
        </h2>
        <p className="text-muted-foreground font-body">
          Set up your collaborative writing project
        </p>
      </div>
      <div className="space-y-4">
        <Input
          label="Script Title"
          type="text"
          name="title"
          value={formData?.title}
          onChange={handleChange}
          placeholder="Enter your script title"
          error={errors?.title}
          required
          description="Choose a descriptive title for your script"
        />

        <Select
          label="Category"
          options={categories}
          value={formData?.category}
          onChange={handleCategoryChange}
          placeholder="Select script category"
          error={errors?.category}
          required
          description="Choose the type of script you're creating"
        />
      </div>
    </div>
  );
};

export default ScriptBasicInfo;