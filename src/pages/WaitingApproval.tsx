
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider'; // Updated import path
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const WaitingApproval: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  let icon = <Clock className="h-12 w-12 text-muted-foreground" />;
  let title = "Waiting for Approval";
  let description = "Your account is pending approval from an administrator. You'll be notified when your account is approved.";
  let actionText = "Check Again";
  
  // Different messages based on status
  if (user.status === 'denied') {
    icon = <AlertTriangle className="h-12 w-12 text-destructive" />;
    title = "Account Access Denied";
    description = "Your account access has been denied. Please contact an administrator for more information.";
    actionText = "Back to Login";
  } else if (user.status === 'active') {
    icon = <CheckCircle className="h-12 w-12 text-primary" />;
    title = "Account Approved";
    description = "Your account has been approved! You can now access the system.";
    actionText = "Go to Dashboard";
  } else if (user.status === 'inactive') {
    icon = <AlertTriangle className="h-12 w-12 text-destructive" />;
    title = "Account Inactive";
    description = "Your account is currently inactive. Please contact an administrator to reactivate your account.";
    actionText = "Back to Login";
  }
  
  const handleAction = () => {
    if (user.status === 'active') {
      navigate('/home');
    } else if (user.status === 'denied' || user.status === 'inactive') {
      logout();
    } else {
      // Refresh the page to check again
      window.location.reload();
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {icon}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-medium">Account Information</h3>
              <p className="text-sm text-muted-foreground">Email: {user.email}</p>
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-medium capitalize">{user.status}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Registration Date: {new Date(user.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleAction}>
            {actionText}
          </Button>
          <Button variant="outline" className="w-full" onClick={logout}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WaitingApproval;
