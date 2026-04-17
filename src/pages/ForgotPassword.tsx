import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, RefreshCw } from 'lucide-react';
import logoImg from '/logo.png';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  digit1: z.string().length(1, 'Required'),
  digit2: z.string().length(1, 'Required'),
  digit3: z.string().length(1, 'Required'),
  digit4: z.string().length(1, 'Required'),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: location.state?.email || '' },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { digit1: '', digit2: '', digit3: '', digit4: '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const handleSendOtp = async (data: EmailFormData) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('forgot-password-otp', {
        body: { email: data.email },
      });

      if (error) throw error;

      if (result?.error) {
        throw new Error(result.error);
      }

      setEmail(data.email);
      setStep('otp');
      toast.success('Reset code sent to your email!');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Send OTP error:', err);
      toast.error(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('forgot-password-otp', {
        body: { email },
      });

      if (error) throw error;

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('New reset code sent to your email!');
      otpForm.reset();
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Resend OTP error:', err);
      toast.error(err.message || 'Failed to resend reset code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async (data: OtpFormData) => {
    const otp = `${data.digit1}${data.digit2}${data.digit3}${data.digit4}`;
    setStep('password');
  };

  const handleResetPassword = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      const otp = `${otpForm.getValues('digit1')}${otpForm.getValues('digit2')}${otpForm.getValues('digit3')}${otpForm.getValues('digit4')}`;

      const { data: result, error } = await supabase.functions.invoke('verify-password-reset-otp', {
        body: {
          email,
          otp,
          newPassword: data.newPassword,
        },
      });

      if (error) throw error;

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Password reset successful! You can now log in with your new password.');
      navigate('/login');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Reset password error:', err);
      toast.error(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof OtpFormData,
    nextField?: keyof OtpFormData
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 1) {
      otpForm.setValue(field, value);
      if (value.length === 1 && nextField) {
        document.getElementById(nextField)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof OtpFormData,
    prevField?: keyof OtpFormData
  ) => {
    if (e.key === 'Backspace' && !otpForm.getValues(field) && prevField) {
      document.getElementById(prevField)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (pastedData.length === 4) {
      otpForm.setValue('digit1', pastedData[0]);
      otpForm.setValue('digit2', pastedData[1]);
      otpForm.setValue('digit3', pastedData[2]);
      otpForm.setValue('digit4', pastedData[3]);
      document.getElementById('digit4')?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img src={logoImg} alt="Tap And Buy" className="h-16 w-auto" />
        </div>

        <Card className="shadow-xl border-primary/20">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (step === 'otp') setStep('email');
                  else if (step === 'password') setStep('otp');
                  else navigate('/login');
                }}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Reset Password
              </CardTitle>
            </div>
            <CardDescription>
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'otp' && 'Enter the 4-digit code sent to your email'}
              {step === 'password' && 'Create your new password'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'email' && (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Remember your password? </span>
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Back to Login
                    </Link>
                  </div>
                </form>
              </Form>
            )}

            {step === 'otp' && (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                      {(['digit1', 'digit2', 'digit3', 'digit4'] as const).map((field, index) => (
                        <FormField
                          key={field}
                          control={otpForm.control}
                          name={field}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  id={field}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  className="w-14 h-14 text-center text-2xl font-bold"
                                  {...formField}
                                  onChange={(e) =>
                                    handleOtpInput(
                                      e,
                                      field,
                                      index < 3 ? (['digit1', 'digit2', 'digit3', 'digit4'][index + 1] as keyof OtpFormData) : undefined
                                    )
                                  }
                                  onKeyDown={(e) =>
                                    handleOtpKeyDown(
                                      e,
                                      field,
                                      index > 0 ? (['digit1', 'digit2', 'digit3', 'digit4'][index - 1] as keyof OtpFormData) : undefined
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        The code will expire in 10 minutes
                      </p>
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        className="text-primary"
                      >
                        {resendLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Resend Code'
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Verify Code
                  </Button>
                </form>
              </Form>
            )}

            {step === 'password' && (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
