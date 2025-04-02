
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, CloudOff, Cloud, HardDrive } from 'lucide-react';

export interface TransactionHeaderProps {
  onNewTransaction: () => void;
  onBackupOpen?: () => void;  // Make this optional
  isOfflineMode?: boolean;
  isSyncing?: boolean;
  onToggleOfflineMode?: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  onNewTransaction,
  onBackupOpen,
  isOfflineMode = false,
  isSyncing = false,
  onToggleOfflineMode
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <div className="flex items-center gap-2">
        {onToggleOfflineMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleOfflineMode}
            className={isOfflineMode ? "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900" : ""}
          >
            {isOfflineMode ? (
              <>
                <HardDrive className="mr-2 h-4 w-4" />
                Offline Mode
              </>
            ) : (
              <>
                <Cloud className="mr-2 h-4 w-4" />
                Online Mode
              </>
            )}
          </Button>
        )}
        
        {onBackupOpen && (
          <Button 
            variant="outline"
            size="sm"
            onClick={onBackupOpen}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <CloudOff className="mr-2 h-4 w-4" />
                Backup & Sync
              </>
            )}
          </Button>
        )}
        
        <Button 
          onClick={onNewTransaction}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionHeader;
