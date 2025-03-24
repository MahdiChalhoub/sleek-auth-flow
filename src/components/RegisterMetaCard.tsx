
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Register } from '@/models/transaction';

interface RegisterMetaCardProps {
  register: Register;
}

const RegisterMetaCard = ({ register }: RegisterMetaCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{register.name}</CardTitle>
          <div className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            register.isOpen 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {register.isOpen ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Open
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                Closed
              </>
            )}
          </div>
        </div>
        <CardDescription>
          {register.isOpen ? "Currently open for transactions" : "Register is currently closed"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {register.isOpen && register.openedAt && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Opened on:</span>
                <span className="font-medium">{formatDate(register.openedAt)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Opened by:</span>
                <span className="font-medium">{register.openedBy || "Unknown"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Time elapsed:</span>
                <span className="font-medium">
                  {register.openedAt ? getElapsedTime(register.openedAt) : "N/A"}
                </span>
              </div>
            </>
          )}
          
          {!register.isOpen && register.closedAt && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Closed on:</span>
                <span className="font-medium">{formatDate(register.closedAt)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Closed by:</span>
                <span className="font-medium">{register.closedBy || "Unknown"}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function getElapsedTime(dateString: string): string {
  const startDate = new Date(dateString);
  const now = new Date();
  
  const diffMs = now.getTime() - startDate.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}h ${diffMins}m`;
}

export default RegisterMetaCard;
