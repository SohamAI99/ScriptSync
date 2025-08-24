import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import ShareLinkTab from './components/ShareLinkTab';
import DirectInvitesTab from './components/DirectInvitesTab';
import ShareLinksList from './components/ShareLinksList';



const ScriptSharingModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('link');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState(null);

  // Share link form state
  const [shareForm, setShareForm] = useState({
    permission: 'view',
    passwordProtected: false,
    password: '',
    expirationDate: null,
    allowDownload: false
  });

  // Direct invites form state
  const [inviteForm, setInviteForm] = useState({
    emails: [],
    role: 'viewer',
    personalMessage: ''
  });

  // Generated share links state
  const [shareLinks, setShareLinks] = useState([
    {
      id: 1,
      url: 'https://scriptsync.com/share/abc123def456',
      permission: 'view',
      passwordProtected: true,
      expirationDate: new Date('2025-09-23'),
      createdAt: new Date('2025-08-20'),
      analytics: {
        views: 15,
        downloads: 3,
        lastAccessed: new Date('2025-08-22')
      }
    },
    {
      id: 2,
      url: 'https://scriptsync.com/share/ghi789jkl012',
      permission: 'comment',
      passwordProtected: false,
      expirationDate: new Date('2025-09-01'),
      createdAt: new Date('2025-08-18'),
      analytics: {
        views: 8,
        downloads: 0,
        lastAccessed: new Date('2025-08-21')
      }
    }
  ]);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Mock contact suggestions for email autocomplete
  const [contactSuggestions] = useState([
    { email: 'john.smith@email.com', name: 'John Smith' },
    { email: 'emma.wilson@email.com', name: 'Emma Wilson' },
    { email: 'mike.johnson@email.com', name: 'Mike Johnson' },
    { email: 'lisa.brown@email.com', name: 'Lisa Brown' },
    { email: 'david.lee@email.com', name: 'David Lee' }
  ]);

  const tabs = [
    { id: 'link', label: 'Link Sharing', icon: 'Link' },
    { id: 'invites', label: 'Direct Invites', icon: 'Mail' }
  ];

  const permissionOptions = [
    { value: 'view', label: 'View Only', description: 'Can only read the script' },
    { value: 'comment', label: 'Comment', description: 'Can read and leave comments' },
    { value: 'edit', label: 'Edit', description: 'Can read, comment, and make changes' }
  ];

  const roleOptions = [
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
    { value: 'commenter', label: 'Commenter', description: 'Can comment on script' },
    { value: 'editor', label: 'Editor', description: 'Full editing permissions' }
  ];

  useEffect(() => {
    // Get script data from location state or localStorage
    const scriptData = location?.state?.script || JSON.parse(localStorage.getItem('currentScript') || 'null');
    
    if (scriptData) {
      setScript(scriptData);
    } else {
      // Fallback to mock script data
      setScript({
        id: 1,
        title: "The Last Frontier",
        category: "screenplay",
        author: "Current User"
      });
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [location]);

  const validateShareForm = () => {
    const newErrors = {};

    if (shareForm?.passwordProtected && !shareForm?.password) {
      newErrors.password = 'Password is required when password protection is enabled';
    } else if (shareForm?.passwordProtected && shareForm?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateInviteForm = () => {
    const newErrors = {};

    if (inviteForm?.emails?.length === 0) {
      newErrors.emails = 'At least one email address is required';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = inviteForm?.emails?.filter(email => !emailRegex?.test(email));
    if (invalidEmails?.length > 0) {
      newErrors.emails = 'Please enter valid email addresses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleGenerateLink = async () => {
    if (!validateShareForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newLink = {
        id: Date.now(),
        url: `https://scriptsync.com/share/${Math.random()?.toString(36)?.substring(7)}`,
        permission: shareForm?.permission,
        passwordProtected: shareForm?.passwordProtected,
        expirationDate: shareForm?.expirationDate,
        createdAt: new Date(),
        analytics: {
          views: 0,
          downloads: 0,
          lastAccessed: null
        }
      };

      setShareLinks(prev => [newLink, ...prev]);
      setSuccessMessage('Share link generated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      setErrors({ submit: 'Failed to generate share link. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvites = async () => {
    if (!validateInviteForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccessMessage(`Invites sent to ${inviteForm?.emails?.length} recipient(s)!`);
      
      // Reset form
      setInviteForm({
        emails: [],
        role: 'viewer',
        personalMessage: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      setErrors({ submit: 'Failed to send invites. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard?.writeText(url);
      setSuccessMessage('Link copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleRevokeLink = (linkId) => {
    if (window.confirm('Are you sure you want to revoke this share link? It will no longer be accessible.')) {
      setShareLinks(prev => prev?.filter(link => link?.id !== linkId));
      setSuccessMessage('Share link revoked successfully!');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const handleEditLinkPermission = (linkId, newPermission) => {
    setShareLinks(prev => prev?.map(link => 
      link?.id === linkId ? { ...link, permission: newPermission } : link
    ));
    setSuccessMessage('Link permissions updated!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleOverlayClick = (e) => {
    if (e?.target === e?.currentTarget) {
      handleCancel();
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[a-z]/?.test(password)) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password) && /[!@#$%^&*(),.?":{}|<>]/?.test(password)) strength += 25;
    return strength;
  };

  const getExpirationPresets = () => [
    { label: '1 Day', value: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    { label: '1 Week', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { label: '1 Month', value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
  ];

  return (
    <div 
      className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-background"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-effect-hover border border-border rounded-2xl shadow-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Share" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-foreground">
                Share Script
              </h2>
              <p className="text-sm text-muted-foreground">
                {script?.title || 'Untitled Script'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg transition-smooth hover:bg-white/5"
            disabled={isLoading}
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <p className="text-sm text-success font-body">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-smooth font-body text-sm ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'link' ? (
            <div className="space-y-6">
              {/* Share Link Form */}
              <ShareLinkTab
                shareForm={shareForm}
                onFormChange={setShareForm}
                permissionOptions={permissionOptions}
                errors={errors}
                onGenerateLink={handleGenerateLink}
                isLoading={isLoading}
                passwordStrength={getPasswordStrength(shareForm?.password)}
                expirationPresets={getExpirationPresets()}
              />

              {/* Generated Links */}
              {shareLinks?.length > 0 && (
                <ShareLinksList
                  links={shareLinks}
                  onCopyLink={handleCopyLink}
                  onRevokeLink={handleRevokeLink}
                  onEditPermission={handleEditLinkPermission}
                  permissionOptions={permissionOptions}
                />
              )}
            </div>
          ) : (
            <DirectInvitesTab
              inviteForm={inviteForm}
              onFormChange={setInviteForm}
              roleOptions={roleOptions}
              contactSuggestions={contactSuggestions}
              errors={errors}
              onSendInvites={handleSendInvites}
              isLoading={isLoading}
            />
          )}

          {/* Error Messages */}
          {errors?.submit && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <p className="text-sm text-destructive font-body">{errors?.submit}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg border border-border transition-smooth hover:bg-white/5 disabled:opacity-50 font-body"
            >
              Cancel
            </button>
            {activeTab === 'link' ? (
              <button
                onClick={handleGenerateLink}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-smooth hover:bg-primary/90 disabled:opacity-50 shadow-floating font-body"
              >
                {isLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
                <span>Generate Link</span>
              </button>
            ) : (
              <button
                onClick={handleSendInvites}
                disabled={isLoading || inviteForm?.emails?.length === 0}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-smooth hover:bg-primary/90 disabled:opacity-50 shadow-floating font-body"
              >
                {isLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
                <span>Send Invites</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptSharingModal;