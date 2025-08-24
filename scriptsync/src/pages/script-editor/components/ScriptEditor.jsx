import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ScriptEditor = ({ 
  content = '',
  onChange = () => {},
  collaborators = [],
  onSelectionChange = () => {},
  currentPage = 1,
  className = ''
}) => {
  const editorRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, character: 1 });
  const [selectedText, setSelectedText] = useState('');

  // Use provided content or empty content for new scripts
  const displayContent = content || '';
  const lines = displayContent?.split('\n');

  const handleTextChange = (e) => {
    const newContent = e?.target?.value;
    onChange(newContent);
    updateCursorPosition(e?.target);
  };

  const handleSelection = (e) => {
    const selection = window.getSelection()?.toString();
    setSelectedText(selection);
    onSelectionChange(selection);
    updateCursorPosition(e?.target);
  };

  const updateCursorPosition = (textarea) => {
    const cursorPos = textarea?.selectionStart;
    const textBeforeCursor = textarea?.value?.substring(0, cursorPos);
    const lines = textBeforeCursor?.split('\n');
    const line = lines?.length;
    const character = lines?.[lines?.length - 1]?.length + 1;
    
    setCursorPosition({ line, character });
  };

  const getLineType = (line) => {
    const trimmed = line?.trim();
    if (trimmed?.startsWith('INT.') || trimmed?.startsWith('EXT.')) return 'scene-header';
    if (trimmed === trimmed?.toUpperCase() && trimmed?.length > 0 && !trimmed?.includes('(')) return 'character';
    if (trimmed?.startsWith('(') && trimmed?.endsWith(')')) return 'parenthetical';
    if (trimmed === 'FADE IN:' || trimmed === 'FADE OUT:' || trimmed === 'CUT TO:') return 'transition';
    return 'action';
  };

  const renderCollaboratorCursors = () => {
    return collaborators?.filter(c => c?.isActive && c?.cursor)?.map(collaborator => (
        <div
          key={collaborator?.id}
          className="absolute pointer-events-none z-10"
          style={{
            top: `${collaborator?.cursor?.line * 1.5}rem`,
            left: `${collaborator?.cursor?.character * 0.6}rem`,
            borderLeft: `2px solid ${collaborator?.color}`,
            height: '1.2rem'
          }}
        >
          <div
            className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-body text-white whitespace-nowrap"
            style={{ backgroundColor: collaborator?.color }}
          >
            {collaborator?.name}
          </div>
        </div>
      ));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Handle keyboard shortcuts
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 's':
            e?.preventDefault();
            // Handle save
            break;
          case 'z':
            e?.preventDefault();
            // Handle undo
            break;
          case 'y':
            e?.preventDefault();
            // Handle redo
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative h-full flex ${className}`}>
      {/* Line Numbers */}
      <div className="w-16 bg-muted/20 border-r border-border flex-shrink-0 overflow-hidden">
        <div className="p-4 space-y-0 font-mono text-xs text-muted-foreground">
          {lines?.map((_, index) => (
            <div
              key={index}
              className={`h-6 flex items-center justify-end pr-2 ${
                index + 1 === cursorPosition?.line ? 'text-primary bg-primary/10' : ''
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      {/* Editor Area */}
      <div className="flex-1 relative">
        {/* Collaborator Cursors */}
        {renderCollaboratorCursors()}

        {/* Text Editor */}
        <textarea
          ref={editorRef}
          value={displayContent}
          onChange={handleTextChange}
          onSelect={handleSelection}
          onKeyUp={handleSelection}
          onClick={handleSelection}
          className="w-full h-full p-4 bg-transparent text-foreground font-mono text-sm leading-6 resize-none border-none outline-none"
          placeholder="Start writing your script..."
          spellCheck={false}
          style={{
            fontFamily: 'Courier Prime, monospace',
            lineHeight: '1.5rem',
            tabSize: 4
          }}
        />

        {/* Format Overlay */}
        <div className="absolute inset-0 pointer-events-none p-4 font-mono text-sm leading-6 overflow-hidden">
          {lines?.map((line, index) => {
            const lineType = getLineType(line);
            return (
              <div
                key={index}
                className={`h-6 ${
                  lineType === 'scene-header' ? 'font-bold text-primary' :
                  lineType === 'character' ? 'font-semibold text-secondary' :
                  lineType === 'parenthetical' ? 'italic text-muted-foreground' :
                  lineType === 'transition'? 'font-bold text-warning text-right' : 'text-transparent'
                }`}
                style={{ lineHeight: '1.5rem' }}
              >
                {lineType !== 'action' ? line : ''}
              </div>
            );
          })}
        </div>
      </div>
      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 glass-effect border-t border-border flex items-center justify-between px-4 text-xs font-body text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span className="font-mono">
            Ln {cursorPosition?.line}, Col {cursorPosition?.character}
          </span>
          <span>
            {displayContent?.length} characters
          </span>
          <span>
            {lines?.length} lines
          </span>
          {selectedText && (
            <span>
              {selectedText?.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span>Page {currentPage}</span>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={12} />
            <span>{collaborators?.filter(c => c?.isActive)?.length} active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptEditor;