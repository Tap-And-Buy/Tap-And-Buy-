import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import logoImg from '/logo.png';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      // Update user's email confirmation status
      const { error } = await supabase.auth.admin.updateUserById(token, {
        email_confirm: true,
      });

      if (error) throw error;

      setStatus('success');
      setMessage('Your email has been verified successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Failed to verify email. The link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <img src={logoImg} alt="Tap And Buy" className="h-16" />
            </div>
            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <p className="text-center text-muted-foreground">Verifying your email...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-green-600">Success!</p>
                  <p className="text-muted-foreground">{message}</p>
                  <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                </div>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Go to Login
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-500" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-red-600">Verification Failed</p>
                  <p className="text-muted-foreground">{message}</p>
                </div>
                <div className="flex gap-2 w-full">
                  <Button onClick={() => navigate('/register')} variant="outline" className="flex-1">
                    Register Again
                  </Button>
                  <Button onClick={() => navigate('/login')} className="flex-1">
                    Go to Login
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
