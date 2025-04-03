
import React from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBrowserNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className="flex items-center bg-background border-b px-4 py-2 space-x-2">
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoBack}
          disabled={window.history.state?.idx === 0}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoForward}
          disabled={window.history.state?.idx === window.history.length - 1}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleHome}
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 mx-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search or enter URL" 
            className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBrowserNavigation;
