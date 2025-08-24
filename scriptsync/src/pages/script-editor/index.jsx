import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import EditorToolbar from './components/EditorToolbar';
import ScriptOutline from './components/ScriptOutline';
import CollaborationPanel from './components/CollaborationPanel';
import ScriptEditor from './components/ScriptEditor';
import MobileSidebar from './components/MobileSidebar';
import { authService } from '../../services/auth';
import { scriptsService } from '../../services/scripts';
import io from 'socket.io-client';

const ScriptEditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scriptId } = useParams();
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Socket.IO connection
  const [socket, setSocket] = useState(null);

  // Load user data and script
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        // Check authentication
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/');
          return;
        }

        // Get current user
        const userData = await authService.getCurrentUser();
        if (userData.success) {
          setUser(userData.data.user);
          setIsAuthenticated(true);

          // Load script if scriptId is provided
          if (scriptId) {
            try {
              // Try to load from API first
              const scriptData = await scriptsService.getScript(scriptId);
              if (scriptData.success) {
                setCurrentScript(scriptData.data.script);
                setScriptContent(scriptData.data.script.content || '');
              } else {
                throw new Error('Script not found on server');
              }
            } catch (error) {
              // Fallback to localStorage for local scripts
              try {
                const localScript = localStorage.getItem(`script_${scriptId}`);
                if (localScript) {
                  const script = JSON.parse(localScript);
                  setCurrentScript(script);
                  setScriptContent(script.content || '');
                } else {
                  // Script not found, redirect to dashboard
                  navigate('/writer-dashboard');
                }
              } catch (storageError) {
                navigate('/writer-dashboard');
              }
            }
          } else {
            // Create new script if no ID provided
            const newScriptData = {
              title: "Untitled Script",
              content: '',
              category: 'screenplay',
              status: 'draft',
              privacy: 'private'
            };
            
            try {
              const response = await scriptsService.createScript(newScriptData);
              if (response.success) {
                setCurrentScript(response.data.script);
                setScriptContent('');
                // Update URL with new script ID
                window.history.replaceState(null, '', `/script-editor/${response.data.script.id}`);
              } else {
                throw new Error('Failed to create script');
              }
            } catch (error) {
              // Fallback to local script creation
              const localScript = {
                id: `local_${Date.now()}`,
                title: "Untitled Script",
                content: '',
                category: 'screenplay',
                status: 'draft',
                privacy: 'private',
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                isLocal: true
              };
              setCurrentScript(localScript);
              setScriptContent('');
              localStorage.setItem(`script_${localScript.id}`, JSON.stringify(localScript));
              window.history.replaceState(null, '', `/script-editor/${localScript.id}`);
            }
          }
        } else {
          localStorage.removeItem('accessToken');
          navigate('/');
        }
      } catch (error) {
        navigate('/writer-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    initializeEditor();
  }, [navigate, scriptId]);

  // Editor state
  const [scriptContent, setScriptContent] = useState('');
  const [currentScript, setCurrentScript] = useState(null);
  
  // Remove the location.state logic as we're now loading from API
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Collaboration state
  const [collaborators, setCollaborators] = useState([]);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/writer-dashboard' },
    { label: 'Scripts', path: '/writer-dashboard' },
    { label: 'Editor', path: null }
  ];

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 5000); // Auto-save every 5 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [scriptContent, hasUnsavedChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 's':
            e?.preventDefault();
            handleSave();
            break;
          case 'Enter':
            if (e?.shiftKey) {
              e?.preventDefault();
              handleCommit();
            }
            break;
          case '/':
            e?.preventDefault();
            // Focus search or command palette
            break;
        }
      }
      
      if (e?.key === 'Escape') {
        setLeftSidebarOpen(false);
        setRightSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContentChange = (newContent) => {
    setScriptContent(newContent);
    setHasUnsavedChanges(true);
    
    // Emit real-time content change to other collaborators
    if (socket && currentScript?.id) {
      socket.emit('content-change', {
        scriptId: currentScript.id,
        content: newContent,
        userId: user.id
      });
    }
    
    // Update last modified time
    setCurrentScript(prev => ({
      ...prev,
      lastModified: new Date()
    }));
  };

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges || !currentScript?.id) return;
    
    setIsSaving(true);
    try {
      const response = await scriptsService.updateScript(currentScript.id, {
        content: scriptContent
      });
      
      if (response.success) {
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      // Fallback to localStorage auto-save
      try {
        const scriptData = {
          ...currentScript,
          content: scriptContent,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem(`script_${currentScript.id}`, JSON.stringify(scriptData));
        setHasUnsavedChanges(false);
      } catch (storageError) {
        console.error('Auto-save failed:', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges || !currentScript?.id) return;
    
    setIsSaving(true);
    try {
      const response = await scriptsService.updateScript(currentScript.id, {
        content: scriptContent,
        lastModified: new Date().toISOString()
      });
      
      if (response.success) {
        setHasUnsavedChanges(false);
        setCurrentScript(prev => ({
          ...prev,
          ...response.data.script
        }));
        // Show success message
        alert('Script saved successfully!');
      }
    } catch (error) {
      // Fallback to localStorage save
      try {
        const scriptData = {
          ...currentScript,
          content: scriptContent,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem(`script_${currentScript.id}`, JSON.stringify(scriptData));
        setHasUnsavedChanges(false);
        setCurrentScript(prev => ({
          ...prev,
          content: scriptContent,
          lastModified: new Date().toISOString()
        }));
        alert('Script saved locally (server unavailable)');
      } catch (storageError) {
        alert('Failed to save script. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommit = async () => {
    if (!currentScript?.id) return;
    
    const commitMessage = prompt('Enter commit message:');
    if (!commitMessage) return;
    
    setIsSaving(true);
    try {
      // First save the current content
      await handleSave();
      
      // Then create a commit record
      const response = await scriptsService.createVersion(currentScript.id, {
        commit_message: commitMessage
      });
      
      if (response.success) {
        alert('Script committed successfully!');
      }
    } catch (error) {
      // Fallback: save locally with commit message
      try {
        const commitData = {
          id: Date.now(),
          scriptId: currentScript.id,
          message: commitMessage,
          content: scriptContent,
          timestamp: new Date().toISOString()
        };
        const commits = JSON.parse(localStorage.getItem(`commits_${currentScript.id}`) || '[]');
        commits.push(commitData);
        localStorage.setItem(`commits_${currentScript.id}`, JSON.stringify(commits));
        alert('Script committed locally (server unavailable)');
      } catch (storageError) {
        alert('Failed to commit script. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormatText = (format) => {
    // Handle text formatting
  };

  const handleInsertScene = () => {
    const sceneHeader = '\n\nINT. LOCATION - TIME\n\n';
    setScriptContent(prev => prev + sceneHeader);
    setHasUnsavedChanges(true);
  };

  const handleInsertCharacter = () => {
    const characterName = prompt('Enter character name:');
    if (characterName) {
      const character = `\n\n${characterName?.toUpperCase()}\n`;
      setScriptContent(prev => prev + character);
      setHasUnsavedChanges(true);
    }
  };

  const handleExport = async (format) => {
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create download link
      const blob = new Blob([scriptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentScript?.title}.${format}`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Export failed
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToggleSidebar = (side) => {
    if (side === 'left') {
      setLeftSidebarOpen(!leftSidebarOpen);
    } else {
      setRightSidebarOpen(!rightSidebarOpen);
    }
  };

  const handleSceneClick = (scene) => {
    // Scroll to scene in editor
  };

  const handleCharacterClick = (character) => {
    // Highlight character dialogue
  };

  const handleInviteUser = () => {
    const email = prompt('Enter email address to invite:');
    if (email) {
      console.log('Invite user:', email);
      // Handle user invitation
    }
  };

  const handleAddComment = (comment) => {
    console.log('Add comment:', comment);
    // Handle comment addition
  };

  const handleResolveComment = (commentId) => {
    console.log('Resolve comment:', commentId);
    // Handle comment resolution
  };

  const handleViewCommit = (commit) => {
    console.log('View commit:', commit);
    // Handle commit viewing
  };

  const handleSelectionChange = (selection) => {
    console.log('Text selected:', selection);
    // Handle text selection
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Disconnect socket
      if (socket) {
        socket.disconnect();
      }
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading script editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNavigation
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="pt-16 pb-18 md:pb-0 h-screen flex flex-col">
        {/* Breadcrumb */}
        <div className="px-6 py-3 border-b border-border">
          <BreadcrumbNavigation
            items={breadcrumbItems}
            currentScript={currentScript}
            collaborators={collaborators}
          />
        </div>

        {/* Editor Toolbar */}
        <EditorToolbar
          onFormatText={handleFormatText}
          onInsertScene={handleInsertScene}
          onInsertCharacter={handleInsertCharacter}
          onSave={handleSave}
          onCommit={handleCommit}
          onExport={handleExport}
          onToggleSidebar={handleToggleSidebar}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Editor Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Desktop */}
          <div className="hidden md:block w-80 border-r border-border">
            <ScriptOutline
              onSceneClick={handleSceneClick}
              onCharacterClick={handleCharacterClick}
            />
          </div>

          {/* Main Editor */}
          <div className="flex-1 relative">
            <ScriptEditor
              content={scriptContent}
              onChange={handleContentChange}
              collaborators={collaborators}
              onSelectionChange={handleSelectionChange}
              currentPage={currentPage}
            />
          </div>

          {/* Right Sidebar - Desktop */}
          <div className="hidden md:block w-80 border-l border-border">
            <CollaborationPanel
              collaborators={collaborators}
              onInviteUser={handleInviteUser}
              onAddComment={handleAddComment}
              onResolveComment={handleResolveComment}
              onViewCommit={handleViewCommit}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebars */}
      <MobileSidebar
        isOpen={leftSidebarOpen}
        side="left"
        title="Script Outline"
        onClose={() => setLeftSidebarOpen(false)}
      >
        <ScriptOutline
          onSceneClick={handleSceneClick}
          onCharacterClick={handleCharacterClick}
        />
      </MobileSidebar>

      <MobileSidebar
        isOpen={rightSidebarOpen}
        side="right"
        title="Collaboration"
        onClose={() => setRightSidebarOpen(false)}
      >
        <CollaborationPanel
          collaborators={collaborators}
          onInviteUser={handleInviteUser}
          onAddComment={handleAddComment}
          onResolveComment={handleResolveComment}
          onViewCommit={handleViewCommit}
        />
      </MobileSidebar>
    </div>
  );
};

export default ScriptEditorPage;