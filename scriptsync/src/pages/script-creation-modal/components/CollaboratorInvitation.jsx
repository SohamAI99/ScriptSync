import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CollaboratorInvitation = ({ 
  collaborators = [], 
  onCollaboratorsChange, 
  error = null 
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const roleOptions = [
    { value: 'writer', label: 'Writer', description: 'Can edit and collaborate' },
    { value: 'reviewer', label: 'Reviewer', description: 'Can comment and suggest' },
    { value: 'viewer', label: 'Viewer', description: 'Can only view the script' }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleAddCollaborator = () => {
    const email = emailInput?.trim();
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (collaborators?.some(collab => collab?.email === email)) {
      setEmailError('This collaborator has already been added');
      return;
    }

    const newCollaborator = {
      id: Date.now(),
      email,
      role: 'writer',
      status: 'pending'
    };

    onCollaboratorsChange([...collaborators, newCollaborator]);
    setEmailInput('');
    setEmailError('');
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    onCollaboratorsChange(collaborators?.filter(collab => collab?.id !== collaboratorId));
  };

  const handleRoleChange = (collaboratorId, newRole) => {
    onCollaboratorsChange(
      collaborators?.map(collab =>
        collab?.id === collaboratorId ? { ...collab, role: newRole } : collab
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleAddCollaborator();
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'writer': return 'PenTool';
      case 'reviewer': return 'MessageSquare';
      case 'viewer': return 'Eye';
      default: return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'writer': return 'text-primary';
      case 'reviewer': return 'text-secondary';
      case 'viewer': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-2">
          Invite Collaborators
        </label>
        <p className="text-sm text-muted-foreground mb-4">
          Add team members to collaborate on this script
        </p>
      </div>
      {/* Add Collaborator Form */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            type="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e?.target?.value);
              setEmailError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter collaborator's email"
            error={emailError}
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleAddCollaborator}
            disabled={!emailInput?.trim()}
            iconName="UserPlus"
            iconPosition="left"
            className="mb-1"
          >
            Add
          </Button>
        </div>
      </div>
      {/* Collaborators List */}
      {collaborators?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-body font-medium text-foreground">
            Invited Collaborators ({collaborators?.length})
          </h4>
          <div className="space-y-2">
            {collaborators?.map((collaborator) => (
              <div
                key={collaborator?.id}
                className="flex items-center justify-between p-3 glass-effect border border-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {collaborator?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">
                      {collaborator?.email}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getRoleIcon(collaborator?.role)} 
                        size={12} 
                        className={getRoleColor(collaborator?.role)} 
                      />
                      <span className={`text-xs font-body capitalize ${getRoleColor(collaborator?.role)}`}>
                        {collaborator?.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {collaborator?.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Select
                    options={roleOptions}
                    value={collaborator?.role}
                    onChange={(value) => handleRoleChange(collaborator?.id, value)}
                    className="w-32"
                  />
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator?.id)}
                    className="p-2 rounded-lg transition-smooth hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive font-body">{error}</p>
      )}
    </div>
  );
};

export default CollaboratorInvitation;