"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  BookOpen,
  CheckSquare,
  Calendar,
  Wrench,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
};

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/office",
    icon: Home,
  },
  {
    name: "Communication",
    href: "/office/channels",
    icon: MessageSquare,
    children: [
      { name: "Channels", href: "/office/channels", icon: MessageSquare },
      { name: "Messages", href: "/office/messages", icon: MessageSquare },
    ]
  },
  {
    name: "Knowledge",
    href: "/office/library",
    icon: BookOpen,
  },
  {
    name: "Tasks",
    href: "/office/tasks",
    icon: CheckSquare,
  },
  {
    name: "Calendar",
    href: "/office/calendar",
    icon: Calendar,
  },
  {
    name: "Workshop",
    href: "/office/workshop",
    icon: Wrench,
  },
  {
    name: "Town",
    href: "/town",
    icon: Users,
  },
];

function NavigationItem({ item, isExpanded, onToggle, collapsed }: {
  item: NavigationItem;
  isExpanded: boolean;
  onToggle: () => void;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <Link
        href={item.href}
        onClick={hasChildren ? (e) => { e.preventDefault(); onToggle(); } : undefined}
        className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium retro-nav-item transition-all duration-200 ${
          isActive
            ? 'retro-nav-active dark:bg-cyan-500/20 dark:text-cyan-400 bg-amber-200/60 text-amber-800 retro-button-inset'
            : 'dark:text-slate-300 text-stone-700 hover:dark:text-white hover:text-stone-900 hover:dark:bg-white/10 hover:bg-stone-200/50'
        } ${collapsed ? 'justify-center' : ''}`}
        title={collapsed ? item.name : undefined}
      >
        <div className="flex items-center">
          <item.icon className={`${collapsed ? '' : 'mr-3'} h-5 w-5`} />
          {!collapsed && <span className="font-jersey">{item.name}</span>}
        </div>
        {hasChildren && !collapsed && (
          <div className="ml-auto">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </Link>

      {hasChildren && isExpanded && !collapsed && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium retro-nav-item transition-all duration-200 ${
                pathname === child.href
                  ? 'retro-nav-active dark:bg-cyan-500/20 dark:text-cyan-400 bg-amber-200/60 text-amber-800 retro-button-inset'
                  : 'dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800 hover:dark:bg-white/10 hover:bg-stone-200/50'
              }`}
            >
              <child.icon className="mr-3 h-4 w-4" />
              <span className="font-jersey">{child.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

type Theme = 'light' | 'dark' | 'system';

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Communication']);
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

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 from-stone-200 via-amber-50 to-stone-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } retro-window-border dark:bg-slate-900/95 bg-stone-100/95 backdrop-blur-lg`}>
        <div className="absolute inset-0 retro-window-inset"></div>
        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className={`flex items-center justify-between p-4 retro-section-border dark:border-slate-700/50 border-stone-400/50 ${sidebarCollapsed ? 'px-2' : 'px-6'}`}>
            <Link href="/office" className="flex items-center">
              {sidebarCollapsed ? (
                <div className="w-10 h-10 pixelated flex items-center justify-center">
                  <Image
                    src="/logos/k_icon.png"
                    alt="Konductor Icon"
                    width={32}
                    height={32}
                    className="pixelated"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 pixelated">
                    <Image
                      src={theme === 'dark' ? "/logos/k_logo_white.png" : "/logos/k_icon.png"}
                      alt="Konductor Logo"
                      width={32}
                      height={32}
                      className="pixelated"
                    />
                  </div>
                  <span className="text-xl font-press-start dark:text-white text-stone-800">Konductor</span>
                </div>
              )}
            </Link>
            <div className="flex items-center space-x-2">
              {!sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block p-1 rounded retro-button-small dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800"
                >
                  <Menu className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Theme Switcher */}
          {!sidebarCollapsed && (
            <div className="px-4 py-2 retro-section-border dark:border-slate-700/50 border-stone-400/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-press-start dark:text-slate-300 text-stone-700">Theme</span>
                <div className="flex items-center space-x-1 retro-button-group">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-1 rounded retro-button-small ${theme === 'light' ? 'retro-button-active' : ''}`}
                    title="Light Theme"
                  >
                    <Sun className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-1 rounded retro-button-small ${theme === 'dark' ? 'retro-button-active' : ''}`}
                    title="Dark Theme"
                  >
                    <Moon className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`p-1 rounded retro-button-small ${theme === 'system' ? 'retro-button-active' : ''}`}
                    title="System Theme"
                  >
                    <Monitor className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
           <nav className={`flex-1 ${sidebarCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2 overflow-y-auto`}>
             {navigation.map((item) => (
               <NavigationItem
                 key={item.name}
                 item={item}
                 isExpanded={expandedItems.includes(item.name)}
                 onToggle={() => toggleExpanded(item.name)}
                 collapsed={sidebarCollapsed}
               />
             ))}
           </nav>

          {/* User Profile & Logout */}
           <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} retro-section-border dark:border-slate-700/50 border-stone-400/50`}>
             {!sidebarCollapsed && (
               <div className="flex items-center mb-4">
                 <div className="w-10 h-10 retro-avatar dark:bg-gradient-to-br dark:from-cyan-400 dark:to-blue-500 bg-gradient-to-br from-amber-400 to-orange-500 rounded-sm flex items-center justify-center pixelated">
                   <span className="dark:text-white text-stone-900 font-bold text-sm">K</span>
                 </div>
                 <div className="ml-3">
                   <p className="dark:text-white text-stone-800 font-medium text-sm font-jersey">Konductor Admin</p>
                   <p className="dark:text-slate-400 text-stone-600 text-xs">admin@konductor.ai</p>
                 </div>
               </div>
             )}

             <div className="space-y-1">
               <Link
                 href="/office/settings"
                 className={`group flex items-center w-full px-3 py-2 text-sm font-medium retro-nav-item transition-all duration-200 dark:text-slate-300 text-stone-700 hover:dark:text-cyan-400 hover:text-amber-700 hover:dark:bg-white/10 hover:bg-stone-200/50 ${sidebarCollapsed ? 'justify-center' : ''}`}
                 title={sidebarCollapsed ? 'Settings' : undefined}
               >
                 <Settings className={`${sidebarCollapsed ? '' : 'mr-3'} h-4 w-4`} />
                 {!sidebarCollapsed && <span className="font-jersey">Settings</span>}
               </Link>

               <button
                 onClick={async () => {
                   try {
                     const { logout } = await import('@/app/actions');
                     await logout();
                   } catch (error) {
                     console.error('Logout failed:', error);
                   }
                 }}
                 className={`group flex items-center w-full px-3 py-2 text-sm font-medium retro-nav-item transition-all duration-200 dark:text-slate-300 text-stone-700 hover:dark:text-cyan-400 hover:text-red-700 hover:dark:bg-red-500/10 hover:bg-red-100/50 ${sidebarCollapsed ? 'justify-center' : ''}`}
                 title={sidebarCollapsed ? 'Logout' : undefined}
               >
                 <LogOut className={`${sidebarCollapsed ? '' : 'mr-3'} h-4 w-4`} />
                 {!sidebarCollapsed && <span className="font-jersey">Logout</span>}
               </button>
             </div>

             {sidebarCollapsed && (
               <div className="mt-4 flex justify-center">
                 <button
                   onClick={() => setSidebarCollapsed(false)}
                   className="p-2 rounded retro-button-small dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800"
                   title="Expand Sidebar"
                 >
                   <ChevronRight className="h-4 w-4" />
                 </button>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 retro-window-border dark:bg-slate-900/95 bg-stone-100/95 backdrop-blur-lg">
          <div className="absolute inset-0 retro-window-inset"></div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative z-10 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative z-10 flex items-center space-x-2">
            <Image
              src={theme === 'dark' ? "/logos/k_logo_white.png" : "/logos/k_logo.png"}
              alt="Konductor Logo"
              width={24}
              height={24}
              className="pixelated"
            />
            <span className="text-lg font-press-start dark:text-white text-stone-800">Konductor</span>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="min-h-screen retro-content-area dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-purple-900/30 bg-gradient-to-br from-stone-50 to-amber-50/50">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}