import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IssueManagement = ({ issues, onResolveIssue, onAssignIssue }) => {
  const [selectedIssues, setSelectedIssues] = useState([]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'high': return 'text-warning bg-warning/10 border-warning/20';
      case 'medium': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-destructive';
      case 'in-progress': return 'text-warning';
      case 'resolved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const issueTime = new Date(timestamp);
    const diffInHours = Math.floor((now - issueTime) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleSelectIssue = (issueId) => {
    setSelectedIssues(prev => 
      prev?.includes(issueId) 
        ? prev?.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIssues?.length === issues?.length) {
      setSelectedIssues([]);
    } else {
      setSelectedIssues(issues?.map(issue => issue?.id));
    }
  };

  const handleBulkResolve = () => {
    selectedIssues?.forEach(issueId => {
      const issue = issues?.find(i => i?.id === issueId);
      if (issue) {
        onResolveIssue(issue);
      }
    });
    setSelectedIssues([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Issue Management
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">
              {issues?.filter(i => i?.status === 'open')?.length} open
            </span>
          </div>
        </div>

        {selectedIssues?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedIssues?.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="CheckCircle"
              iconPosition="left"
              onClick={handleBulkResolve}
            >
              Resolve Selected
            </Button>
          </div>
        )}
      </div>
      {/* Bulk Actions */}
      {issues?.length > 0 && (
        <div className="flex items-center justify-between p-3 glass-effect border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedIssues?.length === issues?.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary bg-transparent border-border rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-sm text-muted-foreground">
              Select all issues
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="ghost" size="sm" iconName="SortDesc">
              Sort
            </Button>
          </div>
        </div>
      )}
      {/* Issues List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {issues?.map((issue) => (
          <div key={issue?.id} className="glass-effect border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedIssues?.includes(issue?.id)}
                onChange={() => handleSelectIssue(issue?.id)}
                className="w-4 h-4 text-primary bg-transparent border-border rounded focus:ring-primary focus:ring-2 mt-1"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-body font-medium text-foreground">
                      {issue?.title}
                    </h4>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getSeverityColor(issue?.severity)}`}>
                      {issue?.severity}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${getStatusColor(issue?.status)}`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      <span className="text-xs font-medium capitalize">{issue?.status}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatTimeAgo(issue?.createdAt)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {issue?.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="FileText" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-primary">{issue?.scriptTitle}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="User" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{issue?.reporter}</span>
                    </div>
                    {issue?.assignee && (
                      <div className="flex items-center space-x-1">
                        <Icon name="UserCheck" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Assigned to {issue?.assignee}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {!issue?.assignee && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="UserPlus"
                        onClick={() => onAssignIssue(issue)}
                      >
                        Assign
                      </Button>
                    )}
                    {issue?.status !== 'resolved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="CheckCircle"
                        onClick={() => onResolveIssue(issue)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {issues?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
          <p className="text-muted-foreground font-body">No open issues</p>
          <p className="text-sm text-muted-foreground">All feedback has been addressed</p>
        </div>
      )}
    </div>
  );
};

export default IssueManagement;