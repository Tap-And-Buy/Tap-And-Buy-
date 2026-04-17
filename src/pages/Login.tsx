import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import logoImg from '/logo.png';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const resendEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ResendEmailFormData = z.infer<typeof resendEmailSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const resendForm = useForm<ResendEmailFormData>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    // Check if redirected from verification page
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setShowVerifiedMessage(true);
      toast.success('Your account has been verified! You can now log in.');
    }
    }, [searchParams]);

  const handleResendVerification = async (data: ResendEmailFormData) => {
    setResendLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('resend-verification-email', {
        body: { email: data.email },
      });

      if (error) throw error;

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Verification code sent! Redirecting to verification page...');
      setShowResendVerification(false);
      resendForm.reset();
      
      // Navigate to OTP verification page
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: data.email } });
      }, 1000);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Resend verification error:', err);
      toast.error(err.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address before logging in.', {
            description: 'Check your email for the verification code.',
            duration: 5000,
          });
          return;
        }
        throw error;
      }

      // Check if user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          toast.success('Welcome back, Admin!');
          navigate('/admin/dashboard');
          return;
        }
      }

      toast.success('Login successful!');
      navigate('/');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/welcome')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <img src={logoImg} alt="Tap And Buy" className="h-16" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Customer Login</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {showVerifiedMessage && (
              <Alert className="mb-4 border-primary bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary font-medium">
                  Your account has been verified! You can now log in to continue.
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 space-y-3">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Didn't receive verification code? </span>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-primary hover:underline font-medium h-auto"
                  onClick={() => setShowResendVerification(true)}
                >
                  Resend Verification Code
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register here
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Forgot Password?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>To reset your password, please contact us at:</p>
              <p className="font-semibold text-primary">tapandbuy.in@gmail.com</p>
              <p className="text-sm">Include your registered email address in your message.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowForgotPassword(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showResendVerification} onOpenChange={setShowResendVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Resend Verification Code
            </DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a new verification code.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...resendForm}>
            <form onSubmit={resendForm.handleSubmit(handleResendVerification)} className="space-y-4">
              <FormField
                control={resendForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your registered email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowResendVerification(false);
                    resendForm.reset();
                  }}
                  disabled={resendLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={resendLoading}>
                  {resendLoading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
