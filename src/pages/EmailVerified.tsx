import { useNavigate } from 'react-router-dom';
import logoImg from '/logo.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react';

export default function EmailVerified() {
  const navigate = useNavigate();

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
              <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified Successfully!</CardTitle>
          <CardDescription className="text-base mt-2">
            Thank you for registering on Tap And Buy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Your email has been verified!
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  You can now log in to Tap And Buy with your credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Next Steps:
            </h3>
            <ol className="text-sm space-y-2 list-decimal list-inside ml-2">
              <li>Click the button below to go to the login page</li>
              <li>Enter your registered email and password</li>
              <li>Start shopping on Tap And Buy!</li>
            </ol>
          </div>

          <Button 
            onClick={() => navigate('/login')} 
            className="w-full"
            size="lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            Go to Login Page
          </Button>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              Need help? Contact us at{' '}
              <a 
                href="mailto:tapandbuy.in@gmail.com" 
                className="text-primary hover:underline font-medium"
              >
                tapandbuy.in@gmail.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
