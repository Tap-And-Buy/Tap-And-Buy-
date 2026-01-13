import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '/logo.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const verificationUrl = location.state?.verificationUrl;

  const copyVerificationLink = () => {
    if (verificationUrl) {
      navigator.clipboard.writeText(verificationUrl);
      toast.success('Verification link copied to clipboard!');
    }
  };

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
            <div className="relative">
              <Mail className="h-16 w-16 text-primary" />
              <CheckCircle2 className="h-8 w-8 text-green-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verification Email Sent</CardTitle>
          <CardDescription className="text-base">
            We have sent you a verification mail to your registered email, confirm that to login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationUrl && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                📧 Verification Link (For Testing)
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Click the link below to verify your email:
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(verificationUrl, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Verification Link
                </Button>
                <Button
                  onClick={copyVerificationLink}
                  variant="outline"
                  size="sm"
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          <div className="bg-accent/50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Next Steps:</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Open your email inbox</li>
              <li>Find the confirmation email from Tap And Buy</li>
              <li>Click the confirmation link in the email</li>
              <li>Return here to login with your credentials</li>
            </ol>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> You must click the confirmation link before you can login. 
              Check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>

          <Button 
            onClick={() => navigate('/login')} 
            className="w-full"
            size="lg"
          >
            Go to Login Page
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Didn't receive the email?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => navigate('/register')}
            >
              Try registering again
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
