import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { appleSignIn, googleSignIn } from '../api/auth';
import type { SignInResult } from '../api/auth';

interface SocialLoginProps {
  onLogin: (result: SignInResult) => void;
  onError: (message: string) => void;
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (options: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup?: boolean;
          state?: string;
        }) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
  }
}

const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
const appleRedirectUri = import.meta.env.VITE_APPLE_REDIRECT_URI;

export default function SocialLogin({ onLogin, onError }: SocialLoginProps) {
  const [appleReady, setAppleReady] = useState(false);

  useEffect(() => {
    if (!appleClientId || !appleRedirectUri) {
      return;
    }

    if (window.AppleID) {
      window.AppleID.auth.init({
        clientId: appleClientId,
        scope: 'name email',
        redirectURI: appleRedirectUri,
        usePopup: true,
      });
      setAppleReady(true);
      return;
    }

    const scriptId = 'apple-signin-sdk';
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: appleClientId,
          scope: 'name email',
          redirectURI: appleRedirectUri,
          usePopup: true,
        });
        setAppleReady(true);
      }
    };
    script.onerror = () => setAppleReady(false);
    document.body.appendChild(script);
  }, []);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError('Google login returned no credential.');
      return;
    }

    try {
      const result = await googleSignIn(credentialResponse.credential);
      onLogin(result);
    } catch (error) {
      onError((error as Error).message || 'Google sign-in failed.');
    }
  };

  const handleGoogleError = () => {
    onError('Google authentication was canceled or failed.');
  };

  const handleAppleClick = async () => {
    if (!window.AppleID) {
      onError('Apple sign-in is not available in this browser.');
      return;
    }

    try {
      const result = await window.AppleID.auth.signIn();
      if (!result?.authorization?.id_token) {
        throw new Error('Apple returned no identity token.');
      }

      const signInResult = await appleSignIn(result.authorization.id_token);
      onLogin(signInResult);
    } catch (error) {
      onError((error as Error).message || 'Apple sign-in failed.');
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const showGoogle = Boolean(googleClientId);
  const showApple = Boolean(appleClientId && appleRedirectUri);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {showGoogle ? (
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400">
            Google sign-in is not configured.
          </div>
        )}

        <button
          type="button"
          disabled={!showApple || !appleReady}
          onClick={handleAppleClick}
          className="inline-flex h-full min-h-[56px] w-full items-center justify-center rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:border-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800"
        >
          {showApple ? 'Continue with Apple' : 'Apple sign-in not configured'}
        </button>
      </div>
      {!showGoogle && !showApple && (
        <p className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-4 text-sm text-slate-400">
          Social sign-in is optional. Fall back to email OTP if Google or Apple are not configured.
        </p>
      )}
    </div>
  );
}
