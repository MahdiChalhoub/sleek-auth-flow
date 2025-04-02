
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Upload, ChevronDown, ChevronUp, HardDrive } from 'lucide-react';
import { Transaction } from '@/models/transaction';

export interface BackupDialogProps {
  open: boolean;  // Changed from isOpen to open
  onOpenChange: (open: boolean) => void;
  transactions?: Transaction[];  // Make optional
}

const BackupDialog: React.FC<BackupDialogProps> = ({ 
  open, 
  onOpenChange,
  transactions = []  // Default to empty array
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const handleExport = () => {
    // Create a JSON string from the transactions data
    const dataStr = JSON.stringify(transactions, null, 2);
    
    // Create a Blob containing the data
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImport = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    // Handle file selection
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          console.log('Imported data:', jsonData);
          // In a real app, you would process and validate the imported data
          // Then update your application state
        } catch (error) {
          console.error('Error parsing imported file:', error);
        }
      };
      reader.readAsText(file);
    };
    
    // Trigger file selection dialog
    input.click();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Backup & Sync Transactions</DialogTitle>
          <DialogDescription>
            Export your transactions for backup or import from a backup file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Local Storage Section */}
          <div className="rounded-lg border overflow-hidden">
            <div 
              className={`p-3 bg-muted flex items-center justify-between cursor-pointer
                ${expandedSection === 'local' ? 'border-b' : ''}`}
              onClick={() => setExpandedSection(expandedSection === 'local' ? null : 'local')}
            >
              <div className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                <span className="font-medium">Local Storage</span>
              </div>
              {expandedSection === 'local' ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </div>
            
            {expandedSection === 'local' && (
              <div className="p-3 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {transactions.length > 0
                    ? `You have ${transactions.length} transactions stored locally.`
                    : 'No transactions stored locally.'
                  }
                </p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    variant="outline"
                    onClick={handleExport}
                    disabled={transactions.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    variant="outline"
                    onClick={handleImport}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackupDialog;
