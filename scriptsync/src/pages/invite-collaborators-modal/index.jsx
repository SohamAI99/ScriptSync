import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Upload, Trash2, Users, Mail, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { cn } from '../../utils/cn';

// Collaborator Chip Component
const CollaboratorChip = ({ collaborator, onRemove, onRoleChange }) => {
  const roleOptions = [
    { value: 'owner', label: 'Owner', description: 'Full access' },
    { value: 'editor', label: 'Editor', description: 'Write/edit' },
    { value: 'commenter', label: 'Commenter', description: 'Read/comment' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only' }
  ];

  const roleColors = {
    owner: 'bg-red-500/20 text-red-300 border-red-500/30',
    editor: 'bg-primary/20 text-primary border-primary/30',
    commenter: 'bg-warning/20 text-warning border-warning/30',
    viewer: 'bg-muted/20 text-muted-foreground border-muted/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-3 p-3 glass-effect rounded-lg border border-border"
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
        collaborator?.color || 'bg-primary/20 text-primary'
      )}>
        {collaborator?.email?.charAt(0)?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {collaborator?.email}
        </p>
      </div>
      <Select
        options={roleOptions}
        value={collaborator?.role}
        onChange={(value) => onRoleChange(collaborator?.id, value)}
        className="w-32"
        placeholder="Role"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
        onClick={() => onRemove(collaborator?.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

// Bulk Invite Section
const BulkInviteSection = ({ onBulkAdd, expanded, onToggle }) => {
  const [bulkEmails, setBulkEmails] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const handleBulkSubmit = () => {
    if (bulkEmails?.trim()) {
      const emails = bulkEmails
        ?.split(/[,;\n]/)
        ?.map(email => email?.trim())
        ?.filter(email => email && email?.includes('@'));
      
      onBulkAdd(emails);
      setBulkEmails('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file && file?.type === 'text/csv') {
      setCsvFile(file);
      // Here you would parse the CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event?.target?.result;
        const emails = text
          ?.split(/[\n,]/)
          ?.map(email => email?.trim())
          ?.filter(email => email && email?.includes('@'));
        onBulkAdd(emails);
      };
      reader?.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={onToggle}
        iconName={expanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="w-full"
      >
        Bulk Invite
      </Button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 glass-effect p-4 rounded-lg border border-border"
          >
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Multiple Emails
              </label>
              <textarea
                className="w-full h-24 px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Enter multiple emails separated by commas, semicolons, or new lines"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e?.target?.value)}
              />
              <Button
                onClick={handleBulkSubmit}
                className="mt-2"
                disabled={!bulkEmails?.trim()}
              >
                Add Emails
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Upload CSV File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="sr-only"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center justify-center w-full h-12 border border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="text-sm text-muted-foreground">
                    {csvFile ? csvFile?.name : 'Choose CSV file'}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InviteCollaboratorsModal = () => {
  const [email, setEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [defaultRole, setDefaultRole] = useState('viewer');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [bulkExpanded, setBulkExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'owner', label: 'Owner', description: 'Full access to all features' },
    { value: 'editor', label: 'Editor', description: 'Can write and edit content' },
    { value: 'commenter', label: 'Commenter', description: 'Can read and leave comments' },
    { value: 'viewer', label: 'Viewer', description: 'Can only view content' }
  ];

  const generateCollaboratorColor = () => {
    const colors = [
      'bg-blue-500/20 text-blue-300',
      'bg-green-500/20 text-green-300',
      'bg-purple-500/20 text-purple-300',
      'bg-pink-500/20 text-pink-300',
      'bg-orange-500/20 text-orange-300',
      'bg-cyan-500/20 text-cyan-300'
    ];
    return colors?.[Math.floor(Math.random() * colors?.length)];
  };

  const addCollaborator = (emailToAdd) => {
    if (emailToAdd && emailToAdd?.includes('@') && !collaborators?.find(c => c?.email === emailToAdd)) {
      const newCollaborator = {
        id: Date.now() + Math.random(),
        email: emailToAdd,
        role: defaultRole,
        color: generateCollaboratorColor()
      };
      setCollaborators([...collaborators, newCollaborator]);
    }
  };

  const handleAddCollaborator = () => {
    addCollaborator(email);
    setEmail('');
  };

  const handleBulkAdd = (emails) => {
    emails?.forEach(addCollaborator);
  };

  const removeCollaborator = (id) => {
    setCollaborators(collaborators?.filter(c => c?.id !== id));
  };

  const changeCollaboratorRole = (id, newRole) => {
    setCollaborators(collaborators?.map(c => 
      c?.id === id ? { ...c, role: newRole } : c
    ));
  };

  const handleSendInvites = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Show success state
    alert(`Successfully sent ${collaborators?.length} invitations!`);
    setCollaborators([]);
    setEmail('');
    setWelcomeMessage('');
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && email?.trim()) {
      e?.preventDefault();
      handleAddCollaborator();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-effect rounded-2xl border border-border shadow-elevated overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                Invite Collaborators
              </h2>
              <p className="text-sm text-muted-foreground">
                Add team members to collaborate on this script
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Email Input */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12"
                />
              </div>
              <Button
                onClick={handleAddCollaborator}
                disabled={!email?.trim() || !email?.includes('@')}
                iconName="Plus"
                className="h-12 px-6"
              >
                Add
              </Button>
            </div>

            {/* Default Role Selection */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Default role:
              </span>
              <Select
                options={roleOptions}
                value={defaultRole}
                onChange={setDefaultRole}
                className="flex-1"
              />
            </div>
          </div>

          {/* Collaborators List */}
          <AnimatePresence>
            {collaborators?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Collaborators ({collaborators?.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollaborators([])}
                    className="text-destructive hover:text-destructive-foreground"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <AnimatePresence>
                    {collaborators?.map((collaborator) => (
                      <CollaboratorChip
                        key={collaborator?.id}
                        collaborator={collaborator}
                        onRemove={removeCollaborator}
                        onRoleChange={changeCollaboratorRole}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Invite */}
          <BulkInviteSection
            onBulkAdd={handleBulkAdd}
            expanded={bulkExpanded}
            onToggle={() => setBulkExpanded(!bulkExpanded)}
          />

          {/* Advanced Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Advanced Options</h3>
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Welcome Message (Optional)
              </label>
              <textarea
                className="w-full h-20 px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Add a personalized welcome message for your collaborators..."
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e?.target?.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {collaborators?.length > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>
                      {collaborators?.length} invitation{collaborators?.length !== 1 ? 's' : ''} ready
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Estimated delivery: Within 2 minutes
                  </div>
                </>
              ) : (
                'No collaborators added yet'
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSendInvites}
              disabled={collaborators?.length === 0}
              loading={isLoading}
              iconName="Send"
              className="flex-1"
            >
              Send Invitations
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InviteCollaboratorsModal;