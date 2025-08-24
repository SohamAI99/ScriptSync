import React from 'react';

const PasswordStrengthIndicator = ({ strength }) => {
  const getStrengthColor = () => {
    if (strength >= 75) return 'bg-green-500';
    if (strength >= 50) return 'bg-yellow-500';
    if (strength >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    if (strength >= 75) return 'Strong';
    if (strength >= 50) return 'Medium';
    if (strength >= 25) return 'Weak';
    return 'Very Weak';
  };

  const getTextColor = () => {
    if (strength >= 75) return 'text-green-400';
    if (strength >= 50) return 'text-yellow-400';
    if (strength >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground font-body">Password Strength</span>
        <span className={`text-xs font-body font-medium ${getTextColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="w-full bg-border rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;