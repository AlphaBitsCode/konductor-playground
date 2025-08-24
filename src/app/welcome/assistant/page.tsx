"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type AssistantOption = {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string;
};

const assistantOptions: AssistantOption[] = [
  {
    id: "alita",
    name: "Alita",
    description: "Your creative and intuitive AI companion",
    personality: "Friendly, creative, and always ready to help with innovative solutions. Alita loves to think outside the box and bring fresh perspectives to your work.",
    avatar: "/avatars/avatar1.png"
  },
  {
    id: "tim",
    name: "Tim",
    description: "Your analytical and efficient AI assistant",
    personality: "Professional, detail-oriented, and highly organized. Tim excels at breaking down complex tasks and providing structured, actionable insights.",
    avatar: "/avatars/avatar2.png"
  }
];

function AssistantSelectionPageContent() {
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    if (!usernameParam) {
      router.push('/welcome');
      return;
    }
    setUsername(usernameParam);
  }, [searchParams, router]);

  const handleContinue = () => {
    if (!selectedAssistant) return;
    router.push(`/welcome/connect?username=${encodeURIComponent(username)}&assistant=${selectedAssistant}`);
  };

  const selectedAssistantData = assistantOptions.find(a => a.id === selectedAssistant);

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
            Choose Your AI Assistant
          </h1>
          <p className="text-cyan-400 font-jersey text-lg text-center mb-8">
            Select an AI personality that will guide you through Konductor.AI
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
            <div className="w-8 h-0.5 bg-cyan-400"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                2
              </div>
              <span className="ml-2 text-cyan-400 font-medium">Assistant</span>
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

        {/* Assistant Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {assistantOptions.map((assistant) => (
            <div
              key={assistant.id}
              onClick={() => setSelectedAssistant(assistant.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 retro-border ${
                selectedAssistant === assistant.id
                  ? 'border-cyan-400 bg-cyan-500/20 glow-text'
                  : 'border-white/20 bg-white/10 hover:border-cyan-400/60'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-4">
                  <Image
                    src={assistant.avatar}
                    alt={assistant.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-press-start text-white mb-2 glow-text">{assistant.name}</h3>
                  <p className="text-gray-300 font-jersey text-sm mb-4">{assistant.description}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400 font-jersey">
                <strong>Personality:</strong> {assistant.personality}
              </div>
              {selectedAssistant === assistant.id && (
                <div className="mt-4 flex items-center text-cyan-400">
                  <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <span className="font-medium">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Assistant Preview */}
        {selectedAssistantData && (
          <div className="mb-8 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
            <h4 className="text-cyan-400 font-semibold mb-2">You've selected {selectedAssistantData.name}!</h4>
            <p className="text-white text-sm">
              {selectedAssistantData.name} will be your personal AI assistant and will help you manage your Konductor.AI workspace.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/welcome"
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
          >
            ← Back
          </Link>
          
          <button
            onClick={handleContinue}
            disabled={!selectedAssistant}
            className="retro-button disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
          >
            Continue with {selectedAssistant ? assistantOptions.find(a => a.id === selectedAssistant)?.name : 'Assistant'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function AssistantSelectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white font-press-start">Loading...</div>
      </div>
    }>
      <AssistantSelectionPageContent />
    </Suspense>
  );
}