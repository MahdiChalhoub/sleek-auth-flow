
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
        <AlertTriangle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Cette page n'existe pas</p>
        <p className="text-muted-foreground mb-6">
          La page que vous recherchez n'a pas été trouvée ou n'existe plus.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to={ROUTES.HOME}>
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Retour à la page précédente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
