"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Office", href: "/office", icon: "🏢" },
  { label: "Messages", href: "/office/messages", icon: "💬" },
  { label: "Workshop", href: "/office/workshop", icon: "🔧" },
  { label: "Town", href: "/town", icon: "🏘️" },
  { label: "Settings", href: "/office/settings", icon: "⚙️" },
];

export default function FloatingNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className="fixed top-4 left-4 z-50 transition-all duration-300">
      <div className={`pixel-corners p-3 dark:bg-slate-800/90 bg-stone-100/90 backdrop-blur-sm border-2 dark:border-slate-600 border-stone-300 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-auto'
      }`}>
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logos/k_icon.png"
              alt="Konductor.AI"
              width={24}
              height={24}
              className="pixelated"
            />
            {isExpanded && (
              <span className="dark:text-white text-stone-800 font-press-start text-xs">
                Konductor
              </span>
            )}
          </Link>
          
          <button
            onClick={toggleExpanded}
            className="ml-2 p-1 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800 transition-colors"
            aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
          >
            <div className="w-4 h-4 flex flex-col justify-center items-center space-y-0.5">
              <div className={`w-3 h-0.5 dark:bg-current bg-current transition-transform duration-200 ${
                isExpanded ? 'rotate-45 translate-y-1' : ''
              }`} />
              <div className={`w-3 h-0.5 dark:bg-current bg-current transition-opacity duration-200 ${
                isExpanded ? 'opacity-0' : 'opacity-100'
              }`} />
              <div className={`w-3 h-0.5 dark:bg-current bg-current transition-transform duration-200 ${
                isExpanded ? '-rotate-45 -translate-y-1' : ''
              }`} />
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        {isExpanded && (
          <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/office' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-2 rounded transition-all duration-200 ${
                    isActive
                      ? 'dark:bg-cyan-500/20 bg-amber-500/20 dark:text-cyan-400 text-amber-700 border dark:border-cyan-500/30 border-amber-500/30'
                      : 'dark:text-slate-300 text-stone-700 hover:dark:bg-slate-700/50 hover:bg-stone-200/50 dark:hover:text-white hover:text-stone-900'
                  }`}
                  onClick={() => setIsExpanded(false)}
                >
                  <span className="text-sm pixelated">{item.icon}</span>
                  <span className="font-jersey text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </nav>
  );
}