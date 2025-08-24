import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ExpirationDatePicker = ({ expirationDate, onDateChange, presets }) => {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState('');

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date)?.toISOString()?.split('T')?.[0];
  };

  const handlePresetClick = (preset) => {
    onDateChange(preset?.value);
    setShowCustomDate(false);
  };

  const handleCustomDateToggle = () => {
    setShowCustomDate(!showCustomDate);
    if (!showCustomDate) {
      setCustomDate(formatDate(expirationDate));
    }
  };

  const handleCustomDateChange = (dateString) => {
    setCustomDate(dateString);
    if (dateString) {
      const date = new Date(dateString);
      onDateChange(date);
    }
  };

  const handleRemoveExpiration = () => {
    onDateChange(null);
    setShowCustomDate(false);
    setCustomDate('');
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    return tomorrow?.toISOString()?.split('T')?.[0];
  };

  return (
    <div>
      <label className="block text-sm font-body font-medium text-foreground mb-3">
        Link Expiration
      </label>
      <div className="space-y-3">
        {/* No Expiration Option */}
        <div
          className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
            !expirationDate
              ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
          }`}
          onClick={handleRemoveExpiration}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
              !expirationDate
                ? 'border-primary bg-primary' :'border-muted-foreground'
            }`}>
              {!expirationDate && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </div>
            <div>
              <div className="font-body font-medium text-foreground">
                Never expires
              </div>
              <div className="text-sm text-muted-foreground">
                Link will remain active indefinitely
              </div>
            </div>
          </div>
        </div>

        {/* Preset Options */}
        {presets?.map((preset, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
              expirationDate && Math.abs(new Date(expirationDate) - preset?.value) < 1000 * 60 * 60
                ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
                expirationDate && Math.abs(new Date(expirationDate) - preset?.value) < 1000 * 60 * 60
                  ? 'border-primary bg-primary' :'border-muted-foreground'
              }`}>
                {expirationDate && Math.abs(new Date(expirationDate) - preset?.value) < 1000 * 60 * 60 && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
              <div>
                <div className="font-body font-medium text-foreground">
                  {preset?.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  Expires {preset?.value?.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Custom Date Option */}
        <div
          className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
            showCustomDate || (expirationDate && !presets?.some(p => Math.abs(new Date(expirationDate) - p?.value) < 1000 * 60 * 60))
              ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
          }`}
          onClick={handleCustomDateToggle}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
              showCustomDate || (expirationDate && !presets?.some(p => Math.abs(new Date(expirationDate) - p?.value) < 1000 * 60 * 60))
                ? 'border-primary bg-primary' :'border-muted-foreground'
            }`}>
              {(showCustomDate || (expirationDate && !presets?.some(p => Math.abs(new Date(expirationDate) - p?.value) < 1000 * 60 * 60))) && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-body font-medium text-foreground">
                Custom date
              </div>
              <div className="text-sm text-muted-foreground">
                Choose a specific expiration date
              </div>
            </div>
            <Icon 
              name={showCustomDate ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </div>
        </div>

        {/* Custom Date Input */}
        {showCustomDate && (
          <div className="ml-8 mt-3">
            <input
              type="date"
              value={customDate}
              onChange={(e) => handleCustomDateChange(e?.target?.value)}
              min={getMinDate()}
              className="px-4 py-2 rounded-lg bg-input border border-border text-foreground font-body transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )}

        {/* Current Selection Display */}
        {expirationDate && (
          <div className="mt-4 p-3 rounded-lg bg-muted border border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="text-sm font-body text-foreground">
                Link expires on <span className="font-medium text-primary">
                  {new Date(expirationDate)?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpirationDatePicker;