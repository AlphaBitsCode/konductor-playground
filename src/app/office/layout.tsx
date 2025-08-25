"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import SidebarNavigation from "@/components/ui/SidebarNavigation";

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex transition-colors duration-300 bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 from-stone-200 via-amber-50 to-stone-300">
        {/* Sidebar Navigation */}
        <SidebarNavigation />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto dark:bg-gradient-to-br dark:from-slate-800/30 dark:to-purple-900/20 bg-gradient-to-br from-stone-50 to-amber-50/30">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}