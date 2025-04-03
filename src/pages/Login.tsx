
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider'; // Updated import
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
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { login, isLoading, bypassAuth } = useAuth();
  const navigate = useNavigate();
  
  console.log('🖥️ Login page rendered:', { isLoading, bypassAuth });

  // Redirect to dashboard if bypassAuth is enabled
  useEffect(() => {
    console.log('🔍 Checking auth bypass status:', bypassAuth);
    if (bypassAuth) {
      console.log('🚀 Redirecting to home due to bypass auth');
      toast.info('Direct access mode enabled - No login required');
      navigate('/home', { replace: true });
    }
  }, [bypassAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bypassAuth) {
      console.log('🚀 Redirecting to home due to bypass auth');
      toast.info('Direct access mode enabled - No login required');
      navigate('/home', { replace: true });
      return;
    }
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      console.log('🔑 Attempting login...');
      setLoginInProgress(true);
      const success = await login(email, password);
      
      if (success) {
        console.log('✅ Login successful, redirecting to home');
        // Redirect is handled by the auth provider through the session change
        navigate('/home', { replace: true });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
    } finally {
      setLoginInProgress(false);
    }
  };

  // Show loading indicator when auth state is being determined
  if (isLoading && !loginInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
        <Card className="shadow-lg w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Loading</CardTitle>
            <CardDescription>
              Please wait while we check your authentication status...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If bypassAuth is true, we'll redirect in the useEffect
  if (bypassAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
        <Card className="shadow-lg w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Direct Access Enabled</CardTitle>
            <CardDescription>
              You're using the system in direct access mode. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </CardContent>
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
                disabled={loginInProgress}
              >
                {loginInProgress ? 'Signing in...' : 'Sign in'}
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
