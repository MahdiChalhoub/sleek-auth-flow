
import React from "react";
import { ArrowLeft, DownloadCloud, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/constants/routes";

interface TransactionHeaderProps {
  isOfflineMode: boolean;
  isSyncing: boolean;
  onToggleOfflineMode: () => void;
  onBackupData: () => void;
  onNewTransaction: () => void;
  isLoading: boolean;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  isOfflineMode,
  isSyncing,
  onToggleOfflineMode,
  onBackupData,
  onNewTransaction,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={ROUTES.HOME}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        
        {isOfflineMode && (
          <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
            Offline Mode
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center mr-4">
          <span className="text-sm mr-2">Offline Mode</span>
          <Switch 
            checked={isOfflineMode} 
            onCheckedChange={onToggleOfflineMode}
            disabled={isSyncing}
          />
          {isSyncing && <Loader2 className="ml-2 h-4 w-4 animate-spin text-primary" />}
        </div>
        
        <Button variant="outline" onClick={onBackupData} className="mr-2" disabled={isLoading}>
          <DownloadCloud className="h-4 w-4 mr-2" />
          Backup
        </Button>
        
        <Button disabled={isLoading} onClick={onNewTransaction}>
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionHeader;
