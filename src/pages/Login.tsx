import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, bypassAuth } = useAuth();
  const { redirectIfAuthenticated } = useAuthRedirect({ redirectIfAuthenticated: true, redirectPath: '/home' });
  const navigate = useNavigate();

  // Redirect to dashboard if bypassAuth is enabled
  useEffect(() => {
    if (bypassAuth) {
      toast.info('Direct access mode enabled - No login required');
      navigate('/home', { replace: true });
    }
  }, [bypassAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bypassAuth) {
      toast.info('Direct access mode enabled - No login required');
      navigate('/home', { replace: true });
      return;
    }
    
    if (!email || !password) {
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      // Error handling is done in the login function
      console.error('Login error:', error);
    }
  };

  // If bypassAuth is true, we won't even render the login form
  if (bypassAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
        <Card className="shadow-lg w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Direct Access Enabled</CardTitle>
            <CardDescription>
              You're using the system in direct access mode. No login required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>All features are fully available without authentication.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/home')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Regular login form for when bypassAuth is false
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="youremail@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                />
                <Label htmlFor="remember-me" className="text-sm cursor-pointer">Remember me</Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                className="w-full mb-4" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
