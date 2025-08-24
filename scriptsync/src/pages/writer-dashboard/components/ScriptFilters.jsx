import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ScriptFilters = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  filterBy, 
  onFilterChange,
  totalScripts 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'modified', label: 'Last Modified', icon: 'Clock' },
    { value: 'created', label: 'Date Created', icon: 'Calendar' },
    { value: 'title', label: 'Title A-Z', icon: 'AlphabeticalOrder' },
    { value: 'progress', label: 'Progress', icon: 'TrendingUp' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Scripts', count: totalScripts },
    { value: 'draft', label: 'Drafts', count: 0 },
    { value: 'review', label: 'In Review', count: 0 },
    { value: 'approved', label: 'Approved', count: 0 },
    { value: 'collaborative', label: 'Collaborative', count: 0 }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'screenplay', label: 'Screenplay' },
    { value: 'stage-play', label: 'Stage Play' },
    { value: 'tv-script', label: 'TV Script' },
    { value: 'short-film', label: 'Short Film' }
  ];

  return (
    <div className="mb-6">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e?.target?.value)}
              className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            iconName="Filter"
            iconPosition="left"
            onClick={() => setShowFilters(!showFilters)}
            className="hidden sm:flex"
          >
            Filters
          </Button>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden p-2 rounded-lg border border-border transition-smooth hover:bg-white/5"
          >
            <Icon name="Filter" size={20} />
          </button>
        </div>
      </div>
      {/* Expanded Filters */}
      {showFilters && (
        <div className="glass-effect border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Status
              </label>
              <div className="space-y-2">
                {filterOptions?.map(option => (
                  <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option?.value}
                      checked={filterBy?.status === option?.value}
                      onChange={(e) => onFilterChange({ ...filterBy, status: e?.target?.value })}
                      className="w-4 h-4 text-primary border-border focus:ring-primary/50"
                    />
                    <span className="text-sm font-body text-foreground">
                      {option?.label}
                      {option?.count !== undefined && (
                        <span className="text-muted-foreground ml-1">({option?.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={filterBy?.category || 'all'}
                onChange={(e) => onFilterChange({ ...filterBy, category: e?.target?.value })}
                className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categoryOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Collaboration Filter */}
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Collaboration
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterBy?.hasCollaborators || false}
                    onChange={(e) => onFilterChange({ ...filterBy, hasCollaborators: e?.target?.checked })}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/50"
                  />
                  <span className="text-sm font-body text-foreground">Has Collaborators</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterBy?.activeCollaboration || false}
                    onChange={(e) => onFilterChange({ ...filterBy, activeCollaboration: e?.target?.checked })}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/50"
                  />
                  <span className="text-sm font-body text-foreground">Active Collaboration</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground font-body">
              {totalScripts} scripts found
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  onFilterChange({ status: 'all' });
                  onSearchChange('');
                }}
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptFilters;