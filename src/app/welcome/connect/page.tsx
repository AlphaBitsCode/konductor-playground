"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function ConnectPageContent() {
  const [username, setUsername] = useState<string>("");
  const [assistant, setAssistant] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    const assistantParam = searchParams.get('assistant');
    
    if (!usernameParam || !assistantParam) {
      router.push('/welcome');
      return;
    }
    
    setUsername(usernameParam);
    setAssistant(assistantParam);
  }, [searchParams, router]);

  const handleConnectTelegram = async () => {
    setIsConnecting(true);
    // TODO: Implement actual Telegram connection logic
    // For now, simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setTelegramHandle(`@${username}_connected`);
      setIsConnecting(false);
    }, 2000);
  };

  const handleFinishOnboarding = () => {
    // TODO: Save user data to PocketBase and create user profile
    router.push('/office');
  };

  const assistantName = assistant === 'alita' ? 'Alita' : 'Tim';

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

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20 relative z-10">
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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-press-start text-white mb-4 text-center glow-text">
            Connect & Get Started
          </h1>
          <p className="text-cyan-400 font-jersey text-lg text-center mb-8">
            Final step: Connect with your AI assistant via Telegram
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <span className="ml-2 text-green-400 font-medium">Username</span>
            </div>
            <div className="w-8 h-0.5 bg-green-400"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <span className="ml-2 text-green-400 font-medium">Assistant</span>
            </div>
            <div className="w-8 h-0.5 bg-cyan-400"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                3
              </div>
              <span className="ml-2 text-cyan-400 font-medium">Connect</span>
            </div>
          </div>
        </div>

        {/* How Konductor.AI Works */}
        <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-xl font-press-start text-white mb-4 glow-text">How Konductor.AI Works</h3>
          <div className="space-y-4 text-slate-300">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3 mt-0.5">
                1
              </div>
              <div>
                <p className="font-semibold text-white">Personal AI Assistant</p>
                <p className="text-sm font-jersey">You'll get a personalized AI assistant ({assistantName}) at @konductor_ai_bot</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3 mt-0.5">
                2
              </div>
              <div>
                <p className="font-semibold text-white">Multi-Channel Communication</p>
                <p className="text-sm font-jersey">Connect Telegram, WhatsApp, Gmail, and more to centralize your communications</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm mr-3 mt-0.5">
                3
              </div>
              <div>
                <p className="font-semibold text-white">AI-Powered Workspace</p>
                <p className="text-sm font-jersey">Manage tasks, documents, and team collaboration in a beautiful 2D pixelart environment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram Connection */}
        <div className="mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/30">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 7.928-1.268 7.928-.15.708-.55.708-.55.708s-1.958-.15-1.958-.15-1.958-.15-1.958-.15-.896-.896-.896-.896l-3.583-11.928c-.15-.708.708-.708.708-.708s11.928-4.479 11.928-4.479c.708-.15.708.708.708.708z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-press-start text-white glow-text">Connect with Telegram</h4>
                <p className="text-blue-200">Get instant access to {assistantName} via Telegram</p>
              </div>
            </div>
            
            {!isConnected ? (
              <div>
                <p className="text-white mb-4">
                  To talk to {assistantName} on this platform and connect with Telegram:
                </p>
                <ol className="text-slate-300 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="bg-cyan-400 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                    Say Hi to @konductor_ai_bot on Telegram
                  </li>
                  <li className="flex items-start">
                    <span className="bg-cyan-400 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                    Send /start to begin connecting with your Personal Assistant
                  </li>
                  <li className="flex items-start">
                    <span className="bg-cyan-400 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                    Follow the connection instructions
                  </li>
                </ol>
                
                <button
                  onClick={handleConnectTelegram}
                  disabled={isConnecting}
                  className="w-full retro-button disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    'I\'ve Connected to Telegram'
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                <div className="flex items-center text-green-400 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Successfully Connected!</span>
                </div>
                <p className="text-white">
                  Telegram linked {telegramHandle}, {assistantName} will assist you via @konductor_ai_bot from now on.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href={`/welcome/assistant?username=${encodeURIComponent(username)}`}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
          >
            ← Back
          </Link>
          
          <button
            onClick={handleFinishOnboarding}
            disabled={!isConnected}
            className="retro-button disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
          >
            {isConnected ? 'Enter Konductor Office' : 'Complete Connection First'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white font-press-start">Loading...</div>
      </div>
    }>
      <ConnectPageContent />
    </Suspense>
  );
}