"use client";

import { useState } from "react";
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

function NavigationItem({ item, isExpanded, onToggle }: {
  item: NavigationItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <Link
        href={item.href}
        onClick={hasChildren ? (e) => { e.preventDefault(); onToggle(); } : undefined}
        className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            : 'text-slate-300 hover:text-white hover:bg-white/10'
        }`}
      >
        <div className="flex items-center">
          <item.icon className="mr-3 h-5 w-5" />
          <span className="font-jersey">{item.name}</span>
        </div>
        {hasChildren && (
          <div className="ml-auto">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </Link>

      {hasChildren && isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === child.href
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
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

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Communication']);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/office" className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center pixelated retro-border">
                  <span className="text-black font-press-start text-xs glow-text">K</span>
                </div>
                <span className="text-xl font-press-start text-white glow-text">Konductor</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                isExpanded={expandedItems.includes(item.name)}
                onToggle={() => toggleExpanded(item.name)}
              />
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium text-sm">Konductor Admin</p>
                <p className="text-slate-400 text-xs">admin@konductor.ai</p>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                href="/office/settings"
                className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:text-cyan-400 hover:bg-white/10 transition-all duration-200 hover:glow-text"
              >
                <Settings className="mr-3 h-4 w-4" />
                <span className="font-jersey">Settings</span>
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
                className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:text-cyan-400 hover:bg-red-500/10 transition-all duration-200 hover:glow-text"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-jersey">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/95 backdrop-blur-lg border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded flex items-center justify-center pixelated retro-border">
              <span className="text-black font-press-start text-xs glow-text">K</span>
            </div>
            <span className="text-lg font-press-start text-white glow-text">Konductor</span>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}