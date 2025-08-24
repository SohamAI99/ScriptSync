import React from 'react';
import Icon from '../../../components/AppIcon';

const PreferencesTab = ({ settings, onSettingsUpdate }) => {
  const themeOptions = [
    { value: 'light', label: 'Light', description: 'Light theme for daytime use' },
    { value: 'dark', label: 'Dark', description: 'Dark theme for reduced eye strain' },
    { value: 'auto', label: 'Auto', description: 'Follows your system preference' }
  ];

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
  ];

  const autosaveIntervals = [
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' }
  ];

  const handleToggle = (field, value) => {
    onSettingsUpdate(field, value);
  };

  const getThemeIcon = (theme) => {
    switch (theme) {
      case 'light': return 'Sun';
      case 'dark': return 'Moon';
      case 'auto': return 'Monitor';
      default: return 'Monitor';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Preferences
        </h2>
        <p className="text-muted-foreground font-body">
          Customize your ScriptSync experience.
        </p>
      </div>
      {/* Theme Selection */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Theme
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Choose your preferred color scheme
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions?.map(option => (
            <div
              key={option?.value}
              className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
                settings?.theme === option?.value
                  ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground hover:bg-white/5'
              }`}
              onClick={() => handleToggle('theme', option?.value)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-lg ${
                  settings?.theme === option?.value ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Icon 
                    name={getThemeIcon(option?.value)} 
                    size={24} 
                    className={settings?.theme === option?.value ? 'text-primary' : 'text-muted-foreground'}
                  />
                </div>
                <div>
                  <div className="font-body font-medium text-foreground">
                    {option?.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option?.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Editor Settings */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Editor Settings
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Configure your script editing experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Autosave Interval */}
          <div>
            <label className="block text-sm font-body font-medium text-foreground mb-3">
              Autosave Interval
            </label>
            <select
              value={settings?.autosaveInterval}
              onChange={(e) => handleToggle('autosaveInterval', parseInt(e?.target?.value))}
              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body"
            >
              {autosaveIntervals?.map(interval => (
                <option key={interval?.value} value={interval?.value}>
                  {interval?.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-muted-foreground font-body">
              How often your work is automatically saved
            </p>
          </div>
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Notifications
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Choose how you want to be notified about activities
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-4">Email Notifications</h4>
            <div className="space-y-4">
              {[
                { 
                  key: 'notifications.emailComments', 
                  label: 'Comments', 
                  description: 'When someone comments on your scripts' 
                },
                { 
                  key: 'notifications.emailMentions', 
                  label: 'Mentions', 
                  description: 'When someone mentions you in a comment' 
                },
                { 
                  key: 'notifications.emailProjectUpdates', 
                  label: 'Project Updates', 
                  description: 'When there are updates to shared projects' 
                }
              ]?.map(item => (
                <div key={item?.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-body font-medium text-foreground">
                      {item?.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item?.description}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const currentValue = item?.key?.split('.')?.reduce((obj, key) => obj?.[key], settings);
                      handleToggle(item?.key, !currentValue);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-smooth ${
                      item?.key?.split('.')?.reduce((obj, key) => obj?.[key], settings) ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-smooth ${
                      item?.key?.split('.')?.reduce((obj, key) => obj?.[key], settings) ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-4">Push Notifications</h4>
            <div className="space-y-4">
              {[
                { 
                  key: 'notifications.pushComments', 
                  label: 'Comments', 
                  description: 'Real-time notifications for new comments' 
                },
                { 
                  key: 'notifications.pushMentions', 
                  label: 'Mentions', 
                  description: 'Instant notifications when mentioned' 
                },
                { 
                  key: 'notifications.pushProjectUpdates', 
                  label: 'Project Updates', 
                  description: 'Updates about shared project activities' 
                }
              ]?.map(item => (
                <div key={item?.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-body font-medium text-foreground">
                      {item?.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item?.description}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const currentValue = item?.key?.split('.')?.reduce((obj, key) => obj?.[key], settings);
                      handleToggle(item?.key, !currentValue);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-smooth ${
                      item?.key?.split('.')?.reduce((obj, key) => obj?.[key], settings) ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-smooth ${
                      item?.key?.split('.')?.reduce((obj, key) => obj?.[key], settings) ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Language & Region */}
      <div className="p-6 rounded-lg bg-muted border border-border">
        <div className="mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Language & Region
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Set your preferred language and regional settings
          </p>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-3">
            Display Language
          </label>
          <select
            value={settings?.language}
            onChange={(e) => handleToggle('language', e?.target?.value)}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent font-body"
          >
            {languageOptions?.map(lang => (
              <option key={lang?.value} value={lang?.value}>
                {lang?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;