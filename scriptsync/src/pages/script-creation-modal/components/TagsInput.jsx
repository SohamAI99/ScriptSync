import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const TagsInput = ({ 
  tags = [], 
  onTagsChange, 
  suggestions = [],
  error = null 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions?.filter(
    suggestion => 
      suggestion?.toLowerCase()?.includes(inputValue?.toLowerCase()) &&
      !tags?.includes(suggestion)
  );

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setInputValue(value);
    setShowSuggestions(value?.length > 0);
  };

  const handleAddTag = (tag) => {
    if (tag && !tags?.includes(tag)) {
      onTagsChange([...tags, tag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleAddTag(inputValue?.trim());
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(tags?.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionClick = (suggestion) => {
    handleAddTag(suggestion);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              label="Tags"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Add tags to categorize your script"
              error={error}
              description="Press Enter or click Add to include tags"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              size="default"
              onClick={() => handleAddTag(inputValue?.trim())}
              disabled={!inputValue?.trim()}
              iconName="Plus"
              iconPosition="left"
              className="mb-1"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 glass-effect-hover border border-border rounded-lg shadow-elevated z-50 max-h-40 overflow-y-auto">
            {filteredSuggestions?.slice(0, 5)?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left transition-smooth hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="font-body text-foreground">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Selected Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-1 glass-effect border border-border rounded-full"
            >
              <span className="text-sm font-body text-foreground">{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="p-1 rounded-full transition-smooth hover:bg-destructive/10 hover:text-destructive"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsInput;