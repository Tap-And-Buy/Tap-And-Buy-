import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/db/supabase';
import logoImg from '/logo.png';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error('Please paste only numbers');
      return;
    }

    const newOtp = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs[nextEmptyIndex].current?.focus();
    } else {
      inputRefs[3].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 4) {
      toast.error('Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp: otpCode },
      });

      if (error) throw error;

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Email verified successfully! You can now log in.');
      navigate('/login?verified=true');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('OTP verification error:', err);
      toast.error(err.message || 'Invalid verification code. Please try again.');
      setOtp(['', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResendLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('resend-verification-email', {
        body: { email },
      });

      if (error) throw error;

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('New verification code sent! Please check your email.');
      setOtp(['', '', '', '']);
      inputRefs[0].current?.focus();
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Resend error:', err);
      toast.error(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/register')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Register
        </Button>

        <Card>
          <CardHeader className="text-center">
            <img 
              src={logoImg} 
              alt="Tap And Buy" 
              className="h-16 w-auto mx-auto mb-4 object-contain"
            />
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a 4-digit verification code to<br />
              <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                ⏰ The code will expire in <strong>10 minutes</strong>
              </p>
            </div>

            <Button 
              onClick={handleVerify} 
              className="w-full"
              size="lg"
              disabled={loading || otp.some(d => !d)}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResend}
                disabled={resendLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
