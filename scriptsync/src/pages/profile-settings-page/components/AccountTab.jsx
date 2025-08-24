import React from 'react';
import Icon from '../../../components/AppIcon';

const AccountTab = ({ user, onExportData, onDeleteAccount, isLoading }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatStorageUsage = (used, limit) => {
    const percentage = (used / limit) * 100;
    return {
      percentage: Math.min(percentage, 100),
      displayText: `${used?.toFixed(1)} GB of ${limit} GB used`
    };
  };

  const storage = formatStorageUsage(user?.stats?.storageUsed, user?.stats?.storageLimit);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Account Management
        </h2>
        <p className="text-muted-foreground font-body">
          Manage your subscription, usage, and account settings.
        </p>
      </div>

      {/* Subscription Details */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Subscription
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              Your current plan and billing information
            </p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
            <Icon name="Crown" size={16} />
            <span className="text-sm font-body font-medium">
              {user?.subscription?.plan}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-muted-foreground font-body">Status</div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-body text-foreground capitalize">
                {user?.subscription?.status}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-body">Next Billing Date</div>
            <div className="font-body text-foreground mt-1">
              {formatDate(user?.subscription?.renewsAt)}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 border border-primary text-primary rounded-lg transition-smooth hover:bg-primary/10 font-body">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 border border-border rounded-lg transition-smooth hover:bg-white/5 font-body">
              Billing History
            </button>
            <button className="px-4 py-2 border border-border rounded-lg transition-smooth hover:bg-white/5 font-body">
              Manage Payment Methods
            </button>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Usage Statistics
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Monitor your account activity and resource usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary">
              {user?.stats?.scriptsCreated}
            </div>
            <div className="text-sm text-muted-foreground font-body">Scripts Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary">
              {user?.stats?.collaborations}
            </div>
            <div className="text-sm text-muted-foreground font-body">Active Collaborations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary">
              {Math.floor((Date.now() - new Date(user?.createdAt)) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-muted-foreground font-body">Days Active</div>
          </div>
        </div>

        {/* Storage Usage */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-body font-medium text-foreground">Storage</span>
            <span className="text-sm text-muted-foreground font-body">
              {storage?.displayText}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                storage?.percentage > 90 ? 'bg-destructive' :
                storage?.percentage > 75 ? 'bg-warning' : 'bg-primary'
              }`}
              style={{ width: `${storage?.percentage}%` }}
            />
          </div>
          {storage?.percentage > 90 && (
            <p className="mt-2 text-sm text-destructive font-body">
              You're running low on storage space. Consider upgrading your plan.
            </p>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Data Management
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Export or manage your account data
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
            <div>
              <div className="font-body font-medium text-foreground">
                Export Account Data
              </div>
              <div className="text-sm text-muted-foreground">
                Download a copy of all your data including scripts, settings, and activity
              </div>
            </div>
            <button
              onClick={onExportData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg transition-smooth hover:bg-primary/10 disabled:opacity-50 font-body"
            >
              {isLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
              <Icon name="Download" size={16} />
              <span>Export</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
            <div>
              <div className="font-body font-medium text-foreground">
                Clear Cache
              </div>
              <div className="text-sm text-muted-foreground">
                Clear stored data to free up space and improve performance
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg transition-smooth hover:bg-white/5 font-body">
              <Icon name="Trash2" size={16} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-lg bg-destructive/5 border border-destructive/20">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-destructive">
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Irreversible and destructive actions
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-destructive/20">
            <div>
              <div className="font-body font-medium text-foreground">
                Delete Account
              </div>
              <div className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </div>
            </div>
            <button
              onClick={onDeleteAccount}
              className="flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg transition-smooth hover:bg-destructive/90 font-body"
            >
              <Icon name="Trash2" size={16} />
              <span>Delete Account</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-background border border-warning/20">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <div className="font-body font-medium text-foreground">
                  Important Notice
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Account deletion is permanent and cannot be undone. All your scripts, 
                  collaborations, and data will be permanently removed from our servers. 
                  Make sure to export any important data before proceeding.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;