
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "lucide-react";

interface BackupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackupGenerate: (type: 'json' | 'sql') => void;
}

const BackupDialog: React.FC<BackupDialogProps> = ({
  open,
  onOpenChange,
  onBackupGenerate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backup Data</DialogTitle>
          <DialogDescription>
            Create a backup of your POS data. Choose your preferred format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center justify-center text-center space-y-2 border-2"
              onClick={() => onBackupGenerate('json')}
            >
              <Database className="h-12 w-12 mb-2 text-blue-500" />
              <span className="font-medium">JSON Backup</span>
              <span className="text-xs text-muted-foreground">Complete data in JSON format</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center justify-center text-center space-y-2 border-2"
              onClick={() => onBackupGenerate('sql')}
            >
              <Database className="h-12 w-12 mb-2 text-green-500" />
              <span className="font-medium">SQL Backup</span>
              <span className="text-xs text-muted-foreground">SQL dump for database restore</span>
            </Button>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Auto-Backup Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Frequency</label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Storage Location</label>
                <Select defaultValue="local">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="gdrive">Google Drive</SelectItem>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                    <SelectItem value="custom">Custom URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackupDialog;
