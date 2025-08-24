import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';

const CollaboratorChip = ({ collaborator, onRemove, onRoleChange }) => {
  const roleOptions = [
    { value: 'owner', label: 'Owner', description: 'Full access' },
    { value: 'editor', label: 'Editor', description: 'Write/edit' },
    { value: 'commenter', label: 'Commenter', description: 'Read/comment' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-3 p-3 glass-effect rounded-lg border border-border transition-smooth hover:glass-effect-hover"
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
        collaborator?.color || 'bg-primary/20 text-primary'
      )}>
        {collaborator?.email?.charAt(0)?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {collaborator?.email}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {collaborator?.role} access
        </p>
      </div>
      <Select
        options={roleOptions}
        value={collaborator?.role}
        onChange={(value) => onRoleChange?.(collaborator?.id, value)}
        className="w-32"
        placeholder="Role"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
        onClick={() => onRemove?.(collaborator?.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default CollaboratorChip;