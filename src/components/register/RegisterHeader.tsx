
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History } from "lucide-react";

interface RegisterHeaderProps {
  isRegisterOpen: boolean;
  onOpenRegisterClick: () => void;
  onCloseRegisterClick: () => void;
}

const RegisterHeader: React.FC<RegisterHeaderProps> = ({
  isRegisterOpen,
  onOpenRegisterClick,
  onCloseRegisterClick
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/home">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">POS Register</h1>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/register-sessions">
            <History className="h-4 w-4 mr-1.5" />
            Sessions History
          </Link>
        </Button>
        
        {isRegisterOpen ? (
          <Button 
            variant="destructive" 
            onClick={onCloseRegisterClick}
          >
            Close Register
          </Button>
        ) : (
          <Button 
            onClick={onOpenRegisterClick}
          >
            Open Register
          </Button>
        )}
      </div>
    </div>
  );
};

export default RegisterHeader;
