import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EditorToolbar = ({ 
  onFormatText = () => {}, 
  onInsertScene = () => {}, 
  onInsertCharacter = () => {},
  onSave = () => {},
  onCommit = () => {},
  onExport = () => {},
  onToggleSidebar = () => {},
  isSaving = false,
  hasUnsavedChanges = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {}
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const formatOptions = [
    { name: 'Bold', icon: 'Bold', action: () => onFormatText('bold') },
    { name: 'Italic', icon: 'Italic', action: () => onFormatText('italic') },
    { name: 'Underline', icon: 'Underline', action: () => onFormatText('underline') }
  ];

  const exportFormats = [
    { name: 'PDF', icon: 'FileText', format: 'pdf' },
    { name: 'DOCX', icon: 'FileText', format: 'docx' },
    { name: 'TXT', icon: 'FileText', format: 'txt' }
  ];

  const handleExport = (format) => {
    onExport(format);
    setShowExportMenu(false);
  };

  return (
    <div className="flex items-center justify-between h-14 px-4 glass-effect border-b border-border">
      {/* Left Section - Mobile Menu & Formatting */}
      <div className="flex items-center space-x-2">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          iconName="Menu"
          onClick={() => onToggleSidebar('left')}
          className="md:hidden"
        />

        {/* Formatting Tools */}
        <div className="hidden sm:flex items-center space-x-1">
          {formatOptions?.map((option) => (
            <Button
              key={option?.name}
              variant="ghost"
              size="sm"
              iconName={option?.icon}
              onClick={option?.action}
              title={option?.name}
            />
          ))}
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Camera"
            onClick={onInsertScene}
            title="Insert Scene Header"
          />
          
          <Button
            variant="ghost"
            size="sm"
            iconName="User"
            onClick={onInsertCharacter}
            title="Insert Character Name"
          />
        </div>
      </div>
      {/* Center Section - Page Navigation */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronLeft"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        />
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-body text-muted-foreground">Page</span>
          <span className="text-sm font-mono font-medium text-foreground">
            {currentPage}
          </span>
          <span className="text-sm font-body text-muted-foreground">of</span>
          <span className="text-sm font-mono font-medium text-foreground">
            {totalPages}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronRight"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        />
      </div>
      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        {/* Save Status */}
        <div className="hidden sm:flex items-center space-x-2">
          {isSaving ? (
            <div className="flex items-center space-x-2 text-warning">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <span className="text-xs font-body">Saving...</span>
            </div>
          ) : hasUnsavedChanges ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-muted" />
              <span className="text-xs font-body">Unsaved changes</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-success">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-body">All changes saved</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          iconName="Save"
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className="hidden sm:flex"
        >
          Save
        </Button>

        <Button
          variant="secondary"
          size="sm"
          iconName="GitCommit"
          onClick={onCommit}
          disabled={!hasUnsavedChanges}
        >
          Commit
        </Button>

        {/* Export Menu */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            Export
          </Button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-32 glass-effect-hover border border-border rounded-lg shadow-elevated z-50">
              {exportFormats?.map((format) => (
                <button
                  key={format?.format}
                  onClick={() => handleExport(format?.format)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left transition-smooth hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg"
                >
                  <Icon name={format?.icon} size={16} />
                  <span className="text-sm font-body">{format?.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Right Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          iconName="PanelRight"
          onClick={() => onToggleSidebar('right')}
          className="md:hidden"
        />
      </div>
    </div>
  );
};

export default EditorToolbar;