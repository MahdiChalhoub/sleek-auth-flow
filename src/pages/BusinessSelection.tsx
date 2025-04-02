
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

const BusinessSelection: React.FC = () => {
  const { user, userBusinesses, switchBusiness } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if there's no user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // If there's only one business, auto-select it
  useEffect(() => {
    if (userBusinesses.length === 1) {
      switchBusiness(userBusinesses[0].id);
      navigate('/home');
    }
  }, [userBusinesses, switchBusiness, navigate]);
  
  const handleSelectBusiness = (businessId: string) => {
    switchBusiness(businessId);
    navigate('/home');
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Select a Business</CardTitle>
            <CardDescription>
              Choose a business to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userBusinesses.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-muted-foreground mb-4">No businesses available for your account</p>
                <Button onClick={() => navigate('/login')}>
                  Return to Login
                </Button>
              </div>
            ) : (
              userBusinesses.map((business) => (
                <Button
                  key={business.id}
                  variant="outline"
                  className="w-full flex items-center justify-start gap-3 h-auto p-4"
                  onClick={() => handleSelectBusiness(business.id)}
                >
                  {business.logoUrl ? (
                    <img 
                      src={business.logoUrl} 
                      alt={business.name}
                      className="w-8 h-8 rounded-full" 
                    />
                  ) : (
                    <Building className="w-8 h-8 text-primary/60" />
                  )}
                  <div className="text-left">
                    <p className="font-medium">{business.name}</p>
                    {business.description && (
                      <p className="text-sm text-muted-foreground">{business.description}</p>
                    )}
                  </div>
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessSelection;
