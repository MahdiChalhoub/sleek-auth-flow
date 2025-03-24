
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import RegisterSessionsList from '@/components/RegisterSessionsList';
import { mockRegisterSessions } from '@/models/transaction';

const RegisterSessions = () => {
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
        </div>
        
        <RegisterSessionsList sessions={mockRegisterSessions} />
      </div>
    </div>
  );
};

export default RegisterSessions;
