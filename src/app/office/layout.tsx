"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";

type Theme = 'light' | 'dark' | 'system';

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('konductor-theme') as Theme || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('konductor-theme', newTheme);
    applyTheme(newTheme);
  };



  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 from-stone-200 via-amber-50 to-stone-300">
      {/* Main content - positioned at top */}
      <main className="flex-1 w-full dark:bg-gradient-to-br dark:from-slate-800/30 dark:to-purple-900/20 bg-gradient-to-br from-stone-50 to-amber-50/30">
        {children}
      </main>

      {/* Floating Avatar Panel */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="pixel-corners p-3 dark:bg-slate-800 bg-stone-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 dark:bg-cyan-500 bg-amber-500 border-2 dark:border-slate-500 border-stone-400 flex items-center justify-center pixelated" title="admin@konductor.ai">
              <span className="dark:text-white text-stone-900 font-bold text-sm">K</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="dark:text-white text-stone-800 font-medium text-sm font-jersey">@admin</p>
              <p className="dark:text-slate-400 text-stone-600 text-xs font-jersey">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}