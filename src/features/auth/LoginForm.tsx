import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { requestEmailCode } from '../../api/auth';
import { validateField } from '../../utils/validation';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ErrorMessage, SuccessMessage } from '../../components/common/Messages';
import SocialLogin from '../../components/SocialLogin';

export const LoginForm = () => {
  const { signInWithCode } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  const requestCodeAsync = useAsync(async () => {
    const emailValidation = validateField(email, [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' },
    ]);

    if (emailValidation) {
      setEmailError(emailValidation);
      throw new Error(emailValidation);
    }

    setEmailError(null);
    await requestEmailCode(email.trim());
    setStep('verify');
    return { message: 'OTP sent to your email address. Enter it below to sign in.' };
  });

  const verifyCodeAsync = useAsync(async (): Promise<{ is_exists: boolean }> => {
    const codeValidation = validateField(code, [
      { type: 'required', message: 'OTP code is required' },
      { type: 'otp', message: 'Please enter a valid 6-digit code' },
    ]);

    if (codeValidation) {
      setCodeError(codeValidation);
      throw new Error(codeValidation);
    }

    setCodeError(null);
    const result = await signInWithCode(email.trim(), code.trim());
    return { is_exists: result.is_exists };
  });

  const handleRequestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await requestCodeAsync.execute();
    } catch {
      // Error handled by useAsync
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await verifyCodeAsync.execute();
      navigate(result.is_exists ? '/' : '/profile');
    } catch {
      // Error handled by useAsync
    }
  };

  const handleSocialLogin = async (result: { is_exists: boolean }) => {
    navigate(result.is_exists ? '/' : '/profile');
  };

  return (
    <Card className="mx-auto max-w-xl" padding="lg">
      <h1 className="text-3xl font-semibold text-white">Sign in to Meditation Audio Gen</h1>
      <p className="mt-2 text-slate-400">Use email OTP or social sign-in to access your meditation dashboard.</p>

      <div className="mt-8">
        <SocialLogin
          onLogin={(result) => handleSocialLogin({ is_exists: result.is_exists })}
          onError={() => requestCodeAsync.reset()}
        />
      </div>

      <div className="relative my-8 h-px bg-slate-800">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">or continue with email</span>
      </div>

      <form className="space-y-4" onSubmit={step === 'request' ? handleRequestCode : handleVerifyCode}>
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError || undefined}
          required
        />

        {step === 'verify' && (
          <Input
            label="OTP code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            error={codeError || undefined}
            helperText="Check your email for the 6-digit code"
            required
          />
        )}

        {requestCodeAsync.error && <ErrorMessage message={requestCodeAsync.error} />}
        {verifyCodeAsync.error && <ErrorMessage message={verifyCodeAsync.error} />}
        {requestCodeAsync.data && <SuccessMessage message={requestCodeAsync.data.message} />}

        <Button
          type="submit"
          loading={requestCodeAsync.loading || verifyCodeAsync.loading}
          className="w-full"
        >
          {step === 'request' ? 'Send OTP' : 'Verify and sign in'}
        </Button>
      </form>
    </Card>
  );
};
