"use client";

import { login, type ActionResult } from "@/app/actions";
import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const initialState: ActionResult = {
  success: false,
  error: null,
};

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(
    async (_: ActionResult, formData: FormData) => {
      return await login(formData);
    },
    initialState,
  );

  // Redirect on success
  if (state?.success) {
    router.push("/dashboard");
    return null;
  }

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
        <Link
          href="/login"
          className="flex-1 py-2 text-center text-white border-b-2 border-white font-medium"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="flex-1 py-2 text-center text-gray-400 hover:text-white transition-colors"
        >
          Sign Up
        </Link>
      </div>

      {state?.error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 text-white py-2.5 px-4 rounded-lg font-medium
                   hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2
                   transition-all duration-200 mt-6"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
