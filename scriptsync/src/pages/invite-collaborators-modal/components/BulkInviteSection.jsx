import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';

const BulkInviteSection = ({ onBulkAdd, expanded, onToggle }) => {
  const [bulkEmails, setBulkEmails] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const handleBulkSubmit = () => {
    if (bulkEmails?.trim()) {
      const emails = bulkEmails
        ?.split(/[,;\n]/)
        ?.map(email => email?.trim())
        ?.filter(email => email && email?.includes('@'));
      
      onBulkAdd?.(emails);
      setBulkEmails('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file && file?.type === 'text/csv') {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event?.target?.result;
        const emails = text
          ?.split(/[\n,]/)
          ?.map(email => email?.trim())
          ?.filter(email => email && email?.includes('@'));
        onBulkAdd?.(emails);
      };
      reader?.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={onToggle}
        className="w-full justify-between"
      >
        <span>Bulk Invite</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 glass-effect p-4 rounded-lg border border-border overflow-hidden"
          >
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Multiple Emails
              </label>
              <textarea
                className="w-full h-24 px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-smooth"
                placeholder="Enter multiple emails separated by commas, semicolons, or new lines"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e?.target?.value)}
              />
              <Button
                onClick={handleBulkSubmit}
                className="mt-2"
                disabled={!bulkEmails?.trim()}
                size="sm"
              >
                Add Emails
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground font-medium">OR</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Upload CSV File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="sr-only"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center justify-center w-full h-12 border border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-smooth hover:glass-effect-hover"
                >
                  <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {csvFile ? csvFile?.name : 'Choose CSV file'}
                  </span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                CSV should contain email addresses in the first column
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkInviteSection;