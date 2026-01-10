import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImg from '/logo.png';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Email verification failed. Please try again.');
          return;
        }

        if (data.session) {
          // Sign out the user after verification so they can login properly
          await supabase.auth.signOut();
          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');
          setTimeout(() => {
            navigate('/email-verified');
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Verification link may have expired. Please try registering again.');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleEmailVerification();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src={logoImg} 
            alt="Tap And Buy" 
            className="h-16 w-auto mx-auto mb-4 object-contain"
          />
          <div className="flex justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-16 w-16 text-green-500" />}
            {status === 'error' && <XCircle className="h-16 w-16 text-destructive" />}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Email'}
            {status === 'success' && 'Email Verified'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-base">
            {message}
          </CardDescription>
        </CardHeader>
        {status === 'error' && (
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/register')} 
              className="w-full"
              size="lg"
            >
              Go to Registration
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="w-full"
              size="lg"
            >
              Go to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
