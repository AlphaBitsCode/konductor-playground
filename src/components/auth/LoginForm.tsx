
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { loginUser, validateEmail, validatePassword } from "@/lib/login";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string | null;
    password?: string | null;
  }>({});

  const router = useRouter();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const emailError = validateEmail(value);
    setValidationErrors(prev => ({
      ...prev,
      email: emailError
    }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const passwordError = validatePassword(value);
    setValidationErrors(prev => ({
      ...prev,
      password: passwordError
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;

    // Final validation
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setValidationErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser({ email, password });
      
      if (result.success) {
        router.push("/office");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = email && password && !validationErrors.email && !validationErrors.password && !isLoading;

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
          Playgr0und Access
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          {validationErrors.email && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Enter your email address
          </p>
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
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="••••••••"
            minLength={6}
            disabled={isLoading}
          />
          {validationErrors.password && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.password}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Use your 6-digit beta access code as password
          </p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-cyan-500 text-white py-2.5 px-4 rounded-lg font-medium
                   hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2
                   transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Accessing...</span>
            </div>
          ) : (
            "Enter Playground"
          )}
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
