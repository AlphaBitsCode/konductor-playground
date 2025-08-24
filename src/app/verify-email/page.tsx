"use client";

import { resendVerification, type ActionResult } from "../actions";
import Link from "next/link";
import { useActionState, useState } from "react";
import Image from "next/image";
import { Mail, CheckCircle, Clock } from "lucide-react";

const initialState: ActionResult = {
  success: false,
  error: null,
};

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [resendState, resendAction] = useActionState(
    async (_: ActionResult, formData: FormData) => {
      const email = formData.get("email") as string;
      return await resendVerification(email);
    },
    initialState
  );

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

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">Account created successfully</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">Verification email sent</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400 text-center mb-4">
            Didn't receive the email? Check your spam folder or request a new one.
          </p>
          
          {resendState?.success && (
            <div className="mb-4 p-3 bg-green-500/20 text-green-100 rounded-md text-sm text-center">
              Verification email sent successfully!
            </div>
          )}
          
          {resendState?.error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-md text-sm text-center">
              {resendState.error}
            </div>
          )}

          <form action={resendAction} className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                placeholder="Enter your email to resend"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Resend Verification Email
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}