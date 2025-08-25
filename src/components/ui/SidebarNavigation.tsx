"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  Wrench,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  { label: "Office", href: "/office", icon: Home },
  { label: "Messages", href: "/office/messages", icon: MessageSquare },
  { label: "Minion Workshop", href: "/office/workshop", icon: Wrench },
  { label: "Task Lists", href: "/office/tasks", icon: Building2 },
  { label: "Settings", href: "/office/settings", icon: Settings },
];

export default function SidebarNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Update CSS custom property for sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isCollapsed ? '4rem' : '16rem'
    );
  }, [isCollapsed]);

  return (
    <div className={`h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } dark:bg-slate-900/90 bg-stone-100/90 backdrop-blur-sm border-r-2 dark:border-slate-600 border-stone-300 fixed left-0 top-0 z-40`}>
      {/* Header */}
      <div className="p-4 border-b-2 dark:border-slate-600 border-stone-300">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logos/k_logo.png"
              alt="Konductor.AI"
              width={195}
              height={42}
            />
          </Link>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-32">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/office' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded transition-all duration-200 group ${
                isActive
                  ? 'dark:bg-cyan-500/20 bg-amber-500/20 dark:text-cyan-400 text-amber-700 retro-border-thick dark:border-cyan-500/30 border-amber-500/30'
                  : 'dark:text-slate-300 text-stone-700 hover:dark:bg-slate-700/50 hover:bg-stone-200/50 dark:hover:text-white hover:text-stone-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${
                isActive ? 'dark:text-cyan-400 text-amber-700' : ''
              }`} />
              {!isCollapsed && (
                <span className="font-jersey text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section - Fixed at bottom */}
      <div className={`fixed bottom-0 left-0 p-4 border-t-2 dark:border-slate-600 border-stone-300 dark:bg-slate-900/95 bg-stone-100/95 backdrop-blur-sm transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className={`flex items-center space-x-3 p-3 dark:bg-slate-800/50 bg-stone-200/50 rounded ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div className="w-8 h-8 dark:bg-cyan-500 bg-amber-500 border-2 dark:border-slate-500 border-stone-400 flex items-center justify-center pixelated flex-shrink-0">
            <span className="dark:text-white text-stone-900 font-bold text-xs">K</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="dark:text-white text-stone-800 font-medium text-sm font-jersey truncate">@admin</p>
              <p className="dark:text-slate-400 text-stone-600 text-xs font-jersey">Online</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <button className="w-full mt-2 flex items-center justify-center space-x-2 p-2 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800 transition-colors">
            <LogOut className="h-4 w-4" />
            <span className="font-jersey text-sm">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}