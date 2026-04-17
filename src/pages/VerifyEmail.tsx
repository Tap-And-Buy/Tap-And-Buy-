import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/db/supabase';
import logoImg from '/logo.png';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      // Verify the token
      const { data: verification, error: verifyError } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('token', token)
        .eq('email', email)
        .single();

      if (verifyError || !verification) {
        setStatus('error');
        setMessage('Invalid or expired verification link. Please request a new verification email.');
        return;
      }

      // Check if already verified
      if (verification.verified) {
        setStatus('success');
        setMessage('Your email has already been verified. You can now log in to your account.');
        return;
      }

      // Check if expired
      const expiresAt = new Date(verification.expires_at);
      if (expiresAt < new Date()) {
        setStatus('error');
        setMessage('This verification link has expired. Please request a new verification email.');
        return;
      }

      // Mark as verified
      const { error: updateError } = await supabase
        .from('email_verifications')
        .update({ verified: true })
        .eq('token', token);

      if (updateError) {
        throw updateError;
      }

      // Update user's email_confirmed_at in auth.users
      // This requires service role, so we'll use an Edge Function
      const { error: confirmError } = await supabase.functions.invoke('confirm-email-verification', {
        body: { email, token },
      });

      if (confirmError) {
        console.error('Error confirming email:', confirmError);
      }

      setStatus('success');
      setMessage('Your email has been successfully verified! You can now log in to your account.');
    } catch (error) {
      console.error('Error verifying email:', error);
      setStatus('error');
      setMessage('An error occurred while verifying your email. Please try again later.');
    }
  };

  const handleContinue = () => {
    navigate('/login?verified=true');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="Tap And Buy" className="h-16 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === 'verifying' && (
            <>
              <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 mx-auto text-primary" />
              <div className="space-y-2">
                <p className="font-semibold text-lg">Verification Successful!</p>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <Button onClick={handleContinue} className="w-full">
                Continue to Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 mx-auto text-destructive" />
              <div className="space-y-2">
                <p className="font-semibold text-lg">Verification Failed</p>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleContinue} className="w-full">
                  Go to Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/register')} 
                  className="w-full"
                >
                  Register Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
