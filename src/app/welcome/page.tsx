"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const validateUsername = (value: string) => {
    // Alphanumeric only, max 25 characters
    const regex = /^[a-zA-Z0-9]{1,25}$/;
    return regex.test(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setIsValid(validateUsername(value));
  };

  const handleContinue = async () => {
    if (!isValid || !username) return;
    
    setIsChecking(true);
    // TODO: Check username availability with PocketBase
    // For now, just proceed to next step
    setTimeout(() => {
      router.push(`/welcome/assistant?username=${encodeURIComponent(username)}`);
    }, 1000);
  };

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

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20 relative z-10">
        {/* Logo */}
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

        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-press-start text-white mb-4 text-center">
            Welcome to Konductor.AI
          </h1>
          <p className="text-cyan-400 font-jersey text-lg text-center mb-8">
            Let's get you set up with your AI workspace
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                1
              </div>
              <span className="ml-2 text-cyan-400 font-medium">Username</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                2
              </div>
              <span className="ml-2 text-slate-400 font-medium">Assistant</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                3
              </div>
              <span className="ml-2 text-slate-400 font-medium">Connect</span>
            </div>
          </div>
        </div>

        {/* Username Input */}
        <div className="mb-8">
          <h2 className="text-xl font-press-start text-white mb-4">Choose Your Username</h2>
          <p className="text-gray-400 font-jersey text-sm mb-4">
            This will be your unique identifier in the Konductor.AI universe
          </p>
          <label htmlFor="username" className="block text-white font-medium mb-3">
            Choose your username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter username (alphanumeric, max 25 chars)"
            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              !isValid && username
                ? 'border-red-400 focus:ring-red-400'
                : 'border-white/30 focus:ring-cyan-400'
            }`}
            maxLength={25}
          />
          {!isValid && username && (
            <p className="text-red-400 text-sm mt-2">
              Username must be alphanumeric only (letters and numbers), max 25 characters
            </p>
          )}
          {isValid && username && (
            <p className="text-green-400 text-sm mt-2">
              ✓ Username looks good!
            </p>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!isValid || !username || isChecking}
          className="w-full retro-button disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
        >
          {isChecking ? 'Checking...' : 'Continue'}
        </button>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}