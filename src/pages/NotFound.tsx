
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-6xl font-extrabold text-primary">404</CardTitle>
          <CardDescription className="text-xl">Page non trouvée</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex items-center justify-center p-6">
            <Search className="h-24 w-24 text-muted-foreground/30" />
          </div>
          <div className="bg-muted/40 p-3 rounded text-left">
            <p className="text-sm font-mono break-all">
              Chemin actuel: {location.pathname}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={() => navigate('/')} variant="default">
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
          <Button className="w-full" onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la page précédente
          </Button>
          {location.pathname === '/roles' && (
            <Link to="/role-management" className="w-full">
              <Button className="w-full" variant="outline">
                Accéder à la gestion des rôles
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
