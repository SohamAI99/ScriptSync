import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScriptCard = ({ script, onReview, onComment, onApprove, onRequestChanges }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/10';
      case 'in-progress': return 'text-secondary bg-secondary/10';
      case 'approved': return 'text-success bg-success/10';
      case 'changes-requested': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(script?.deadline);

  return (
    <div className="glass-effect border border-border rounded-lg p-6 transition-smooth hover:glass-effect-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              {script?.title}
            </h3>
            <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(script?.priority)}`}>
              {script?.priority}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span>{script?.writer}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Tag" size={14} />
              <span className="capitalize">{script?.category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="FileText" size={14} />
              <span>{script?.wordCount?.toLocaleString()} words</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(script?.status)}`}>
          {script?.status?.replace('-', ' ')}
        </div>
      </div>
      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Submitted</p>
          <p className="text-sm font-body text-foreground">{formatDate(script?.submittedDate)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Deadline</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-body text-foreground">{formatDate(script?.deadline)}</p>
            {daysRemaining <= 3 && daysRemaining > 0 && (
              <div className="flex items-center space-x-1 text-warning">
                <Icon name="Clock" size={12} />
                <span className="text-xs">{daysRemaining}d left</span>
              </div>
            )}
            {daysRemaining <= 0 && (
              <div className="flex items-center space-x-1 text-destructive">
                <Icon name="AlertTriangle" size={12} />
                <span className="text-xs">Overdue</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Assigned Reviewer */}
      {script?.assignedReviewer && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {script?.assignedReviewer?.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Assigned to {script?.assignedReviewer}
          </span>
        </div>
      )}
      {/* Progress Indicator */}
      {script?.progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Review Progress</span>
            <span className="text-xs text-foreground">{script?.progress}%</span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-smooth"
              style={{ width: `${script?.progress}%` }}
            />
          </div>
        </div>
      )}
      {/* Issues Count */}
      {script?.issuesCount > 0 && (
        <div className="flex items-center space-x-2 mb-4 p-2 bg-warning/10 border border-warning/20 rounded-md">
          <Icon name="AlertCircle" size={16} className="text-warning" />
          <span className="text-sm text-warning">
            {script?.issuesCount} open issue{script?.issuesCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => onReview(script)}
          >
            Review
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageSquare"
            iconPosition="left"
            onClick={() => onComment(script)}
          >
            Comment
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {script?.status === 'pending' || script?.status === 'in-progress' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                iconName="AlertCircle"
                iconPosition="left"
                onClick={() => onRequestChanges(script)}
              >
                Request Changes
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={() => onApprove(script)}
              >
                Approve
              </Button>
            </>
          ) : script?.status === 'approved' ? (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">Approved</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-warning">
              <Icon name="Clock" size={16} />
              <span className="text-sm font-medium">Changes Requested</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;