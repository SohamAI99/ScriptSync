import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import UserContextMenu from '../../components/ui/UserContextMenu';
import Icon from '../../components/AppIcon';


// Component imports
import ScriptCard from './components/ScriptCard';
import ActivityFeed from './components/ActivityFeed';
import FilterBar from './components/FilterBar';
import IssueManagement from './components/IssueManagement';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import DashboardStats from './components/DashboardStats';

const MonitorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedScripts, setSelectedScripts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedAuth === 'true' && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Listen for user updates from profile settings
  useEffect(() => {
    const handleUserUpdate = (event) => {
      setCurrentUser(event.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  // Initialize empty dashboard statistics - will be loaded from backend
  const dashboardStats = {
    pendingReview: 0,
    inProgress: 0,
    approved: 0,
    openIssues: 0,
    pendingTrend: 0,
    progressTrend: 0,
    approvedTrend: 0,
    issuesTrend: 0
  };

  // Initialize empty scripts data - will be loaded from backend
  const mockScripts = [];

  // Initialize empty activities data - will be loaded from backend
  const mockActivities = [];

  // Initialize empty issues data - will be loaded from backend
  const mockIssues = [];

  // Filter scripts based on active tab, search, and filters
  const getFilteredScripts = () => {
    let filtered = mockScripts;

    // Filter by tab
    switch (activeTab) {
      case 'pending':
        filtered = filtered?.filter(script => script?.status === 'pending');
        break;
      case 'in-progress':
        filtered = filtered?.filter(script => script?.status === 'in-progress');
        break;
      case 'approved':
        filtered = filtered?.filter(script => script?.status === 'approved');
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(script =>
        script?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        script?.writer?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        script?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply additional filters
    Object.entries(filters)?.forEach(([key, value]) => {
      if (value) {
        filtered = filtered?.filter(script => {
          switch (key) {
            case 'priority':
              return script?.priority === value;
            case 'writer':
              return script?.writer?.toLowerCase()?.replace(' ', '-') === value;
            case 'category':
              return script?.category === value;
            case 'deadline':
              // Implement deadline filtering logic
              return true;
            case 'status':
              return script?.status === value;
            default:
              return true;
          }
        });
      }
    });

    return filtered;
  };

  const filteredScripts = getFilteredScripts();

  // Tab configuration
  const tabs = [
    { 
      id: 'pending', 
      label: 'Pending Review', 
      count: mockScripts?.filter(s => s?.status === 'pending')?.length,
      icon: 'Clock'
    },
    { 
      id: 'in-progress', 
      label: 'In Progress', 
      count: mockScripts?.filter(s => s?.status === 'in-progress')?.length,
      icon: 'Edit'
    },
    { 
      id: 'approved', 
      label: 'Approved', 
      count: mockScripts?.filter(s => s?.status === 'approved')?.length,
      icon: 'CheckCircle'
    }
  ];

  // Handlers
  const handleScriptReview = (script) => {
    navigate('/script-editor', { state: { script, mode: 'review' } });
  };

  const handleScriptComment = (script) => {
    // Open comment modal or navigate to script with comment focus
    console.log('Opening comment for script:', script?.title);
  };

  const handleScriptApprove = (script) => {
    console.log('Approving script:', script?.title);
    // Update script status to approved
  };

  const handleRequestChanges = (script) => {
    console.log('Requesting changes for script:', script?.title);
    // Update script status to changes-requested
  };

  const handleResolveIssue = (issue) => {
    console.log('Resolving issue:', issue?.title);
    // Update issue status to resolved
  };

  const handleAssignIssue = (issue) => {
    console.log('Assigning issue:', issue?.title);
    // Open assignment modal
  };

  const handleBulkAssign = (scriptIds, reviewerId) => {
    console.log('Bulk assigning scripts:', scriptIds, 'to reviewer:', reviewerId);
  };

  const handleBulkStatusChange = (scriptIds, status) => {
    console.log('Bulk status change:', scriptIds, 'to status:', status);
  };

  const handleBulkDelete = (scriptIds) => {
    console.log('Bulk deleting scripts:', scriptIds);
  };

  const handleSelectScript = (scriptId) => {
    setSelectedScripts(prev =>
      prev?.includes(scriptId)
        ? prev?.filter(id => id !== scriptId)
        : [...prev, scriptId]
    );
  };

  const handleSelectAll = () => {
    if (selectedScripts?.length === filteredScripts?.length) {
      setSelectedScripts([]);
    } else {
      setSelectedScripts(filteredScripts?.map(script => script?.id));
    }
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('userSecurity');
    
    // Reset state
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Navigate to landing page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNavigation 
        user={currentUser}
        isAuthenticated={true}
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <div className="pt-16 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <BreadcrumbNavigation 
                items={[
                  { label: 'Dashboard', path: '/monitor-dashboard' }
                ]}
              />
              <div className="mt-4">
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Monitor Dashboard
                </h1>
                <p className="text-muted-foreground font-body mt-2">
                  Review and manage script submissions across all projects
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Statistics */}
          <DashboardStats stats={dashboardStats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Content - Scripts */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filter Bar */}
              <FilterBar
                onFilterChange={setFilters}
                onSearch={setSearchTerm}
                totalScripts={mockScripts?.length}
                filteredCount={filteredScripts?.length}
              />

              {/* Bulk Actions */}
              <BulkActionsToolbar
                selectedScripts={selectedScripts}
                onBulkAssign={handleBulkAssign}
                onBulkStatusChange={handleBulkStatusChange}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedScripts([])}
              />

              {/* Tabs */}
              <div className="glass-effect border border-border rounded-lg">
                <div className="flex items-center border-b border-border">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-body font-medium transition-smooth ${
                        activeTab === tab?.id
                          ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span>{tab?.label}</span>
                      <div className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                        {tab?.count}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Scripts Grid */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Icon name="Loader2" size={32} className="text-primary animate-spin" />
                    </div>
                  ) : filteredScripts?.length > 0 ? (
                    <>
                      {/* Select All */}
                      <div className="flex items-center space-x-3 mb-6 p-3 glass-effect border border-border rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedScripts?.length === filteredScripts?.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-primary bg-transparent border-border rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm text-muted-foreground">
                          Select all {filteredScripts?.length} script{filteredScripts?.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Scripts List */}
                      <div className="space-y-4">
                        {filteredScripts?.map((script) => (
                          <div key={script?.id} className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedScripts?.includes(script?.id)}
                              onChange={() => handleSelectScript(script?.id)}
                              className="w-4 h-4 text-primary bg-transparent border-border rounded focus:ring-primary focus:ring-2 mt-6"
                            />
                            <div className="flex-1">
                              <ScriptCard
                                script={script}
                                onReview={handleScriptReview}
                                onComment={handleScriptComment}
                                onApprove={handleScriptApprove}
                                onRequestChanges={handleRequestChanges}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                        No scripts found
                      </h3>
                      <p className="text-muted-foreground font-body">
                        {searchTerm || Object.values(filters)?.some(v => v) 
                          ? 'Try adjusting your search or filters'
                          : `No scripts in ${activeTab?.replace('-', ' ')} status`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Issue Management */}
              <div className="glass-effect border border-border rounded-lg p-6">
                <IssueManagement
                  issues={mockIssues}
                  onResolveIssue={handleResolveIssue}
                  onAssignIssue={handleAssignIssue}
                />
              </div>
            </div>

            {/* Right Sidebar - Activity Feed */}
            <div className="lg:col-span-1">
              <div className="glass-effect border border-border rounded-lg p-6 sticky top-24">
                <ActivityFeed activities={mockActivities} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorDashboard;