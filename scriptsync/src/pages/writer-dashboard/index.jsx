import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import DashboardHeader from './components/DashboardHeader';
import QuickStats from './components/QuickStats';
import ScriptFilters from './components/ScriptFilters';
import ScriptCard from './components/ScriptCard';
import ActivityFeed from './components/ActivityFeed';
import EmptyState from './components/EmptyState';
import { authService } from '../../services/auth';
import { scriptsService } from '../../services/scripts';

const WriterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scripts, setScripts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('modified');
  const [filterBy, setFilterBy] = useState({ status: 'all' });

  // Load user data and scripts on component mount
  useEffect(() => {
    const initializeDashboard = async () => {
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

          // Load user's scripts
          try {
            const scriptsData = await scriptsService.getUserScripts();
            if (scriptsData.success) {
              let allScripts = scriptsData.data.scripts || [];
              
              // Also load local scripts from localStorage
              const localScripts = JSON.parse(localStorage.getItem('localScripts') || '[]');
              allScripts = [...allScripts, ...localScripts];
              
              setScripts(allScripts);
            } else {
              throw new Error('Failed to load scripts from server');
            }
          } catch (error) {
            // Fallback to only local scripts
            const localScripts = JSON.parse(localStorage.getItem('localScripts') || '[]');
            setScripts(localScripts);
          }

          // Load user activities (optional for now)
          // const activitiesData = await scriptsService.getUserActivities();
          // if (activitiesData.success) {
          //   setActivities(activitiesData.data.activities || []);
          // }
        } else {
          // Invalid token, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          navigate('/');
        }
      } catch (error) {
        // Redirect to landing page on error
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Filter and sort scripts
  const filteredScripts = scripts?.filter(script => {
    const matchesSearch = script?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         script?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    
    const matchesStatus = filterBy?.status === 'all' || script?.status === filterBy?.status;
    const matchesCategory = !filterBy?.category || filterBy?.category === 'all' || script?.category === filterBy?.category;
    const matchesCollaborators = !filterBy?.hasCollaborators || script?.collaborators?.length > 0;
    const matchesActiveCollaboration = !filterBy?.activeCollaboration || script?.activeCollaborators > 0;

    return matchesSearch && matchesStatus && matchesCategory && matchesCollaborators && matchesActiveCollaboration;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a?.title?.localeCompare(b?.title);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'progress':
        return b?.progress - a?.progress;
      case 'modified':
      default:
        return new Date(b.lastModified) - new Date(a.lastModified);
    }
  });

  // Calculate stats
  const stats = {
    totalScripts: scripts?.length,
    inProgress: scripts?.filter(s => s?.status === 'draft')?.length,
    collaborations: scripts?.filter(s => s?.collaborators?.length > 0)?.length,
    completed: scripts?.filter(s => s?.status === 'approved')?.length
  };

  const handleNewScript = () => {
    // Navigate to script creation modal
    navigate('/script-creation');
  };

  const handleEditScript = async (scriptId, updates) => {
    try {
      const response = await scriptsService.updateScript(scriptId, updates);
      if (response.success) {
        // Update local state
        setScripts(prev => prev?.map(script => 
          script?.id === scriptId ? { ...script, ...updates } : script
        ));
      }
    } catch (error) {
      // Error updating script
    }
  };

  const handleShareScript = (script) => {
    // Handle share functionality
  };

  const handleDuplicateScript = async (script) => {
    try {
      const duplicateData = {
        title: `${script?.title} (Copy)`,
        content: script?.content || '',
        category: script?.category,
        status: 'draft',
        privacy: 'private'
      };

      const response = await scriptsService.createScript(duplicateData);
      if (response.success) {
        // Add to local state
        setScripts(prev => [response.data.script, ...prev]);
      }
    } catch (error) {
      // Error duplicating script
    }
  };

  const handleDeleteScript = async (script) => {
    if (window.confirm(`Are you sure you want to delete "${script?.title}"?`)) {
      try {
        const response = await scriptsService.deleteScript(script.id);
        if (response.success) {
          // Remove from local state
          setScripts(prev => prev?.filter(s => s?.id !== script?.id));
        }
      } catch (error) {
        // Error deleting script
      }
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterBy({ status: 'all' });
    setSortBy('modified');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Logout error
    } finally {
      // Clear all stored user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    }
  };

  const hasActiveFilters = searchQuery || filterBy?.status !== 'all' || filterBy?.category || filterBy?.hasCollaborators || filterBy?.activeCollaboration;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation 
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <DashboardHeader 
            user={user}
            onNewScript={handleNewScript}
          />

          {/* Quick Stats */}
          <QuickStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filters */}
              <ScriptFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterBy={filterBy}
                onFilterChange={setFilterBy}
                totalScripts={filteredScripts?.length}
              />

              {/* Scripts Grid */}
              {filteredScripts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredScripts?.map(script => (
                    <ScriptCard
                      key={script?.id}
                      script={script}
                      onEdit={handleEditScript}
                      onShare={handleShareScript}
                      onDuplicate={handleDuplicateScript}
                      onDelete={handleDeleteScript}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  onCreateScript={handleNewScript}
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriterDashboard;