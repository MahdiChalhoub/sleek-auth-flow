
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import RegisterSessionsList from '@/components/RegisterSessionsList';
import { useRegisterSessions } from '@/hooks/useRegisterSessions';
import { Skeleton } from '@/components/ui/skeleton';

const RegisterSessions = () => {
  const { registers, isLoading } = useRegisterSessions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/register">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Register Sessions History</h1>
          </div>
          
          <Button asChild>
            <Link to="/register">
              <Plus className="h-4 w-4 mr-2" />
              Manage Register
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <RegisterSessionsList sessions={registers} />
        )}
      </div>
    </div>
  );
};

export default RegisterSessions;
