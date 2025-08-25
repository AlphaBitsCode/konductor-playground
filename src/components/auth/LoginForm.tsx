"use client";

import { login, type ActionResult } from "@/app/actions";
import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

const initialState: ActionResult = {
  success: false,
  error: null,
};

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const router = useRouter();
  const [state, formAction] = useActionState(
    async (_: ActionResult, formData: FormData) => {
      return await login(formData);
    },
    initialState,
  );

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push("/town");
    }
  }, [state?.success, router]);

  const validateUsername = (username: string): string | null => {
    if (username.length < 5 || username.length > 25) {
      return "Username must be between 5 and 25 characters";
    }

    const validPattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/;
    if (!validPattern.test(username)) {
      return "Username can only contain letters, numbers, and one dot";
    }

    const dotCount = (username.match(/\./g) || []).length;
    if (dotCount > 1) {
      return "Username can contain at most one dot";
    }

    return null;
  };

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

      <div className="flex mb-6">
        <div className="flex-1 py-2 text-center text-white border-b-2 border-white font-medium">
          Access Portal
        </div>
      </div>

      {state?.error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Konductor ID
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 text-sm font-medium">
              @
            </span>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              placeholder="player.designation"
              minLength={5}
              maxLength={25}
              pattern="^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Alphanumeric only, one dot allowed (5-25 chars)
          </p>
        </div>

        <div>
          <label
            htmlFor="accessCode"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Access Code
          </label>
          <input
            id="accessCode"
            name="accessCode"
            type="password"
            required
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="••••••"
            maxLength={6}
            pattern="[0-9]{6}"
          />
          <p className="text-xs text-gray-400 mt-1">
            6-digit numeric code from your invitation
          </p>
        </div>

        <button
          type="submit"
          disabled={!username || !accessCode || validateUsername(username) !== null}
          className="w-full bg-cyan-500 text-white py-2.5 px-4 rounded-lg font-medium
                   hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2
                   transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enter Playground
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 font-mono">
          {"[SYSTEM_MSG]: Secure_access_v1.0_beta"}
        </p>
      </div>
    </div>
  );
}
