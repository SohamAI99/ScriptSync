import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterBar = ({ onFilterChange, onSearch, totalScripts, filteredCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priority: '',
    writer: '',
    category: '',
    deadline: '',
    status: ''
  });

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const writerOptions = [
    { value: '', label: 'All Writers' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'screenplay', label: 'Screenplay' },
    { value: 'stage-play', label: 'Stage Play' },
    { value: 'tv-script', label: 'TV Script' },
    { value: 'short-film', label: 'Short Film' },
    { value: 'documentary', label: 'Documentary' }
  ];

  const deadlineOptions = [
    { value: '', label: 'All Deadlines' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Due Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'approved', label: 'Approved' },
    { value: 'changes-requested', label: 'Changes Requested' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priority: '',
      writer: '',
      category: '',
      deadline: '',
      status: ''
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    onFilterChange(clearedFilters);
    onSearch('');
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '') || searchTerm !== '';

  return (
    <div className="space-y-4">
      {/* Search and Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search scripts, writers, or content..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground font-body">
            Showing {filteredCount} of {totalScripts} scripts
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={clearAllFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select
          placeholder="Priority"
          options={priorityOptions}
          value={filters?.priority}
          onChange={(value) => handleFilterChange('priority', value)}
          className="w-full"
        />

        <Select
          placeholder="Writer"
          options={writerOptions}
          value={filters?.writer}
          onChange={(value) => handleFilterChange('writer', value)}
          className="w-full"
        />

        <Select
          placeholder="Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterChange('category', value)}
          className="w-full"
        />

        <Select
          placeholder="Deadline"
          options={deadlineOptions}
          value={filters?.deadline}
          onChange={(value) => handleFilterChange('deadline', value)}
          className="w-full"
        />

        <Select
          placeholder="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          className="w-full"
        />
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {searchTerm && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              <Icon name="Search" size={12} />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => handleSearchChange({ target: { value: '' } })}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {Object.entries(filters)?.map(([key, value]) => {
            if (!value) return null;
            
            const getDisplayValue = () => {
              switch (key) {
                case 'priority': return priorityOptions?.find(opt => opt?.value === value)?.label;
                case 'writer': return writerOptions?.find(opt => opt?.value === value)?.label;
                case 'category': return categoryOptions?.find(opt => opt?.value === value)?.label;
                case 'deadline': return deadlineOptions?.find(opt => opt?.value === value)?.label;
                case 'status': return statusOptions?.find(opt => opt?.value === value)?.label;
                default: return value;
              }
            };

            return (
              <div key={key} className="flex items-center space-x-1 bg-secondary/10 text-secondary px-2 py-1 rounded-md text-sm">
                <span>{getDisplayValue()}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="hover:text-secondary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterBar;