import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DirectInvitesTab = ({
  inviteForm,
  onFormChange,
  roleOptions,
  contactSuggestions,
  errors
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (field, value) => {
    onFormChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailInputChange = (value) => {
    setEmailInput(value);
    
    if (value?.length > 0) {
      const filtered = contactSuggestions?.filter(contact =>
        contact?.email?.toLowerCase()?.includes(value?.toLowerCase()) ||
        contact?.name?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered?.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddEmail = (email) => {
    if (email && !inviteForm?.emails?.includes(email)) {
      handleInputChange('emails', [...inviteForm?.emails, email]);
      setEmailInput('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    handleInputChange('emails', inviteForm?.emails?.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && emailInput?.trim()) {
      e?.preventDefault();
      handleAddEmail(emailInput?.trim());
    } else if (e?.key === 'Backspace' && !emailInput && inviteForm?.emails?.length > 0) {
      handleRemoveEmail(inviteForm?.emails?.[inviteForm?.emails?.length - 1]);
    }
  };

  const handleSuggestionClick = (contact) => {
    handleAddEmail(contact?.email);
  };

  return (
    <div className="space-y-6">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-3">
          Email Addresses
        </label>
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border bg-input min-h-[48px] focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-smooth">
            {inviteForm?.emails?.map((email, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-1 rounded-md bg-primary/10 text-primary text-sm"
              >
                <span>{email}</span>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-smooth"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
            <input
              type="email"
              value={emailInput}
              onChange={(e) => handleEmailInputChange(e?.target?.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => emailInput && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={inviteForm?.emails?.length === 0 ? "Enter email addresses" : ""}
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none min-w-[200px] font-body"
            />
          </div>

          {/* Email Suggestions */}
          {showSuggestions && filteredSuggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 glass-effect-hover border border-border rounded-lg shadow-elevated z-10">
              {filteredSuggestions?.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(contact)}
                  className="w-full p-3 text-left hover:bg-white/5 transition-smooth first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="font-body font-medium text-foreground">
                    {contact?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact?.email}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {errors?.emails && (
          <p className="mt-2 text-sm text-destructive font-body">{errors?.emails}</p>
        )}
      </div>
      {/* Role Assignment */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-3">
          Role Assignment
        </label>
        <div className="space-y-3">
          {roleOptions?.map(role => (
            <div
              key={role?.value}
              className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
                inviteForm?.role === role?.value
                  ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
              }`}
              onClick={() => handleInputChange('role', role?.value)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
                  inviteForm?.role === role?.value
                    ? 'border-primary bg-primary' :'border-muted-foreground'
                }`}>
                  {inviteForm?.role === role?.value && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-body font-medium text-foreground">
                    {role?.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {role?.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Personal Message */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-3">
          Personal Message (Optional)
        </label>
        <textarea
          value={inviteForm?.personalMessage}
          onChange={(e) => handleInputChange('personalMessage', e?.target?.value)}
          placeholder="Add a personal message to your invitation..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground resize-none transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body"
          maxLength={500}
        />
        <div className="mt-2 text-right">
          <span className="text-sm text-muted-foreground">
            {inviteForm?.personalMessage?.length}/500
          </span>
        </div>
      </div>
      {/* Bulk Invite Summary */}
      {inviteForm?.emails?.length > 0 && (
        <div className="p-4 rounded-lg bg-muted border border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="font-body font-medium text-foreground">
              Invitation Summary
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            Sending invites to <span className="text-primary font-medium">{inviteForm?.emails?.length}</span> recipient(s) 
            with <span className="text-primary font-medium">{roleOptions?.find(r => r?.value === inviteForm?.role)?.label}</span> permissions.
          </p>
        </div>
      )}
    </div>
  );
};

export default DirectInvitesTab;