
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { loginUser, validateUsername, validateAccessCode } from "@/lib/login";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    accessCode?: string;
  }>({});

  const router = useRouter();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const usernameError = validateUsername(value);
    setValidationErrors(prev => ({
      ...prev,
      username: usernameError
    }));
  };

  const handleAccessCodeChange = (value: string) => {
    setAccessCode(value);
    const accessCodeError = validateAccessCode(value);
    setValidationErrors(prev => ({
      ...prev,
      accessCode: accessCodeError
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;

    // Final validation
    const usernameError = validateUsername(username);
    const accessCodeError = validateAccessCode(accessCode);
    
    if (usernameError || accessCodeError) {
      setValidationErrors({
        username: usernameError,
        accessCode: accessCodeError
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser({ username, accessCode });
      
      if (result.success) {
        router.push("/town");
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

  const canSubmit = username && accessCode && !validationErrors.username && !validationErrors.accessCode && !isLoading;

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
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              placeholder="player.designation"
              minLength={5}
              maxLength={25}
              pattern="^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$"
              disabled={isLoading}
            />
          </div>
          {validationErrors.username && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.username}</p>
          )}
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
            onChange={(e) => handleAccessCodeChange(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="••••••"
            maxLength={6}
            pattern="[0-9]{6}"
            disabled={isLoading}
          />
          {validationErrors.accessCode && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.accessCode}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            6-digit numeric code from your invitation
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
