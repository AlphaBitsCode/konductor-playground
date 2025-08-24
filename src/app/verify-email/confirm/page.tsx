"use client";

import { verifyEmail, type ActionResult } from "../../actions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const confirmVerification = async () => {
      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus('success');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        } else {
          setStatus('error');
          setError(result.error || 'Verification failed');
        }
      } catch (err) {
        setStatus('error');
        setError('Something went wrong. Please try again.');
      }
    };

    confirmVerification();
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20 relative z-10">
      <div className="flex justify-center mb-8">
        <Image
          src="/logos/k_logo_white.png"
          alt="Konductor Logo"
          width={260}
          height={48}
          className="object-contain"
          priority
        />
      </div>

      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verifying Your Email</h1>
            <p className="text-gray-300 text-sm">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
            <p className="text-gray-300 text-sm mb-6">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Redirecting to sign in page in 3 seconds...
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In Now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-gray-300 text-sm mb-6">
              {error || 'We couldn\'t verify your email address. The link may be invalid or expired.'}
            </p>
            <div className="space-y-3">
              <Link
                href="/verify-email"
                className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Request New Verification Email
              </Link>
              <Link
                href="/register"
                className="block text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Back to Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmVerificationPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
      </div>
      <Suspense fallback={<div>Loading verification...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}