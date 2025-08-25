"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Wrench,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  Settings,
} from "lucide-react";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  description?: string;
  special?: string;
};

const navigation: NavigationItem[] = [
  {
    name: "Office",
    href: "/office",
    icon: Home,
  },
  {
    name: "Workshop",
    href: "/office/workshop",
    icon: Wrench,
    description: "AI Minions"
  },
  {
    name: "Town",
    href: "/town",
    icon: Users,
    special: "town"
  },
  {
    name: "Settings",
    href: "/office/settings",
    icon: Settings,
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
  const isTown = item.special === 'town';

  return (
    <div>
      <Link
        href={item.href}
        onClick={hasChildren ? (e) => { e.preventDefault(); onToggle(); } : undefined}
        className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-all duration-200 pixelated-stairs ${
          isActive
            ? isTown
              ? 'dark:bg-green-500/30 dark:text-green-400 bg-green-200/80 text-green-800 border-2 dark:border-green-500/50 border-green-400/60'
              : 'dark:bg-cyan-500/30 dark:text-cyan-400 bg-amber-200/80 text-amber-800 border-2 dark:border-cyan-500/50 border-amber-400/60'
            : isTown
              ? 'dark:text-green-300 text-green-700 hover:dark:text-green-200 hover:text-green-800 hover:dark:bg-green-700/30 hover:bg-green-200/50'
              : 'dark:text-slate-300 text-stone-700 hover:dark:text-white hover:text-stone-900 hover:dark:bg-slate-700/50 hover:bg-stone-200/70'
        } ${collapsed ? 'justify-center' : ''}`}
        title={collapsed ? `${item.name}${item.description ? ` - ${item.description}` : ''}` : undefined}
      >
        <div className="flex items-center">
          <item.icon className={`${collapsed ? '' : 'mr-3'} h-5 w-5`} />
          {!collapsed && (
            <div>
              <span className="font-jersey">{item.name}</span>
              {item.description && (
                <div className="text-xs opacity-75 font-jersey">{item.description}</div>
              )}
            </div>
          )}
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
              className={`group flex items-center px-3 py-2 text-sm font-medium pixelated-stairs transition-all duration-200 ${
                pathname === child.href
                  ? 'dark:bg-cyan-500/30 dark:text-cyan-400 bg-amber-200/80 text-amber-800 border-2 dark:border-cyan-500/50 border-amber-400/60'
                  : 'dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800 hover:dark:bg-slate-700/50 hover:bg-stone-200/70'
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

interface SidebarProps {
  theme: Theme;
}

export default function Sidebar({ theme }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false); // Expand on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-4 left-4 bottom-4 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } pixel-corners cursor-move shadow-lg dark:bg-slate-800 bg-stone-100`} 
           style={{ touchAction: 'none' }}
           onMouseDown={(e) => {
             const sidebar = e.currentTarget;
             const startX = e.clientX - sidebar.offsetLeft;
             const startY = e.clientY - sidebar.offsetTop;
             
             const handleMouseMove = (e: MouseEvent) => {
               sidebar.style.left = `${e.clientX - startX}px`;
               sidebar.style.top = `${e.clientY - startY}px`;
             };
             
             const handleMouseUp = () => {
               document.removeEventListener('mousemove', handleMouseMove);
               document.removeEventListener('mouseup', handleMouseUp);
             };
             
             document.addEventListener('mousemove', handleMouseMove);
             document.addEventListener('mouseup', handleMouseUp);
           }}>
        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className={`flex items-center justify-between p-4 border-b-2 dark:border-slate-600 border-stone-400 ${sidebarCollapsed ? 'px-2' : 'px-6'}`}>
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
                <div className="flex items-center">
                  <div className="h-8 pixelated">
                    <Image
                      src={theme === 'dark' ? "/logos/k_logo_white.png" : "/logos/k_logo.png"}
                      alt="Konductor Logo"
                      width={148}
                      height={32}
                      className="pixelated"
                    />
                  </div>
                </div>
              )}
            </Link>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

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

          {/* Collapse/Expand Button */}
          <div className="mt-auto p-4 border-t-2 dark:border-slate-600 border-stone-400">
            <div className="flex items-center justify-center">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 border-2 dark:border-slate-600 border-stone-400 dark:bg-slate-700 bg-stone-200 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800 transition-colors pixelated-stairs"
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header - floating */}
      <div className="lg:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center justify-between p-3 pixel-corners shadow-lg dark:bg-slate-800 bg-stone-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800 mr-3"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Image
              src={theme === 'dark' ? "/logos/k_logo_white.png" : "/logos/k_logo.png"}
              alt="Konductor Logo"
              width={20}
              height={20}
              className="pixelated"
            />
            <span className="text-sm font-press-start dark:text-white text-stone-800">Konductor</span>
          </div>
        </div>
      </div>
    </>
  );
}