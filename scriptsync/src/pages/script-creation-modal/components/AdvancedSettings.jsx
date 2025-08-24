import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedSettings = ({ 
  settings = {}, 
  onSettingsChange, 
  error = null 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const templateOptions = [
    { value: 'blank', label: 'Blank Script', description: 'Start with an empty script' },
    { value: 'screenplay', label: 'Screenplay Template', description: 'Standard film script format' },
    { value: 'stage-play', label: 'Stage Play Template', description: 'Theater script format' },
    { value: 'tv-episode', label: 'TV Episode Template', description: 'Television script format' },
    { value: 'short-film', label: 'Short Film Template', description: 'Condensed screenplay format' }
  ];

  const formatOptions = [
    { value: 'standard', label: 'Standard Format', description: 'Industry standard formatting' },
    { value: 'compact', label: 'Compact Format', description: 'Reduced spacing for drafts' },
    { value: 'wide', label: 'Wide Format', description: 'Increased margins for notes' }
  ];

  const sceneOptions = [
    { value: 'single', label: 'Single Scene', description: 'Start with one scene' },
    { value: 'act-structure', label: 'Three-Act Structure', description: 'Pre-structured acts' },
    { value: 'custom', label: 'Custom Structure', description: 'Define your own structure' }
  ];

  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const defaultSettings = {
    template: 'blank',
    pageFormat: 'standard',
    sceneStructure: 'single',
    autoSave: true,
    lineNumbers: false,
    characterHighlight: true,
    ...settings
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-3 glass-effect border border-border rounded-lg transition-smooth hover:bg-white/5"
      >
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={16} className="text-muted-foreground" />
          <span className="font-body font-medium text-foreground">
            Advanced Settings
          </span>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      {isExpanded && (
        <div className="space-y-6 p-4 glass-effect border border-border rounded-lg">
          {/* Template Selection */}
          <Select
            label="Script Template"
            options={templateOptions}
            value={defaultSettings?.template}
            onChange={(value) => handleSettingChange('template', value)}
            description="Choose a starting template for your script"
          />

          {/* Page Format */}
          <Select
            label="Page Format"
            options={formatOptions}
            value={defaultSettings?.pageFormat}
            onChange={(value) => handleSettingChange('pageFormat', value)}
            description="Select the page formatting style"
          />

          {/* Scene Structure */}
          <Select
            label="Initial Scene Structure"
            options={sceneOptions}
            value={defaultSettings?.sceneStructure}
            onChange={(value) => handleSettingChange('sceneStructure', value)}
            description="Choose how to structure your initial scenes"
          />

          {/* Editor Preferences */}
          <div className="space-y-4">
            <h4 className="text-sm font-body font-medium text-foreground">
              Editor Preferences
            </h4>
            
            <div className="space-y-3">
              <Checkbox
                label="Auto-save enabled"
                description="Automatically save changes every 30 seconds"
                checked={defaultSettings?.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e?.target?.checked)}
              />

              <Checkbox
                label="Show line numbers"
                description="Display line numbers in the editor"
                checked={defaultSettings?.lineNumbers}
                onChange={(e) => handleSettingChange('lineNumbers', e?.target?.checked)}
              />

              <Checkbox
                label="Character highlighting"
                description="Highlight different characters with colors"
                checked={defaultSettings?.characterHighlight}
                onChange={(e) => handleSettingChange('characterHighlight', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Template Preview */}
          {defaultSettings?.template !== 'blank' && (
            <div className="p-4 glass-effect-hover border border-border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="Eye" size={16} className="text-primary" />
                <span className="text-sm font-body font-medium text-foreground">
                  Template Preview
                </span>
              </div>
              <div className="text-xs font-mono text-muted-foreground space-y-1">
                <div>FADE IN:</div>
                <div className="ml-4">INT. LOCATION - DAY</div>
                <div className="ml-8">Scene description goes here...</div>
                <div className="ml-16">CHARACTER</div>
                <div className="ml-12">Dialogue appears here.</div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive font-body">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;