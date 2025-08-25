"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Bot,
  FileText,
  MessageCircle,
  TrendingUp,
  Calendar,
  CheckSquare,
  Activity
} from "lucide-react";

type StatCard = {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
};

const stats: StatCard[] = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Active Minions",
    value: "89",
    change: "+5%",
    changeType: "positive",
    icon: Bot,
  },
  {
    title: "Documents",
    value: "3,456",
    change: "+23%",
    changeType: "positive",
    icon: FileText,
  },
  {
    title: "Conversations",
    value: "12,890",
    change: "+8%",
    changeType: "positive",
    icon: MessageCircle,
  },
];

type RecentActivity = {
  id: string;
  type: 'user_joined' | 'minion_created' | 'document_uploaded' | 'task_completed';
  message: string;
  timestamp: string;
  user?: string;
};

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "user_joined",
    message: "New user john_doe joined the platform",
    timestamp: "2 minutes ago",
    user: "john_doe"
  },
  {
    id: "2",
    type: "minion_created",
    message: "AI Minion 'Marketing Assistant' was created",
    timestamp: "15 minutes ago",
    user: "sarah_m"
  },
  {
    id: "3",
    type: "document_uploaded",
    message: "Document 'Q4 Strategy.pdf' uploaded to Knowledge Library",
    timestamp: "1 hour ago",
    user: "mike_chen"
  },
  {
    id: "4",
    type: "task_completed",
    message: "Task 'Review marketing materials' marked as completed",
    timestamp: "2 hours ago",
    user: "alex_k"
  },
  {
    id: "5",
    type: "user_joined",
    message: "New user emma_wilson joined the platform",
    timestamp: "3 hours ago",
    user: "emma_wilson"
  },
];

function getActivityIcon(type: RecentActivity['type']) {
  switch (type) {
    case 'user_joined':
      return Users;
    case 'minion_created':
      return Bot;
    case 'document_uploaded':
      return FileText;
    case 'task_completed':
      return CheckSquare;
    default:
      return Activity;
  }
}

function getActivityColor(type: RecentActivity['type']) {
  switch (type) {
    case 'user_joined':
      return 'text-green-400 bg-green-400/10';
    case 'minion_created':
      return 'text-blue-400 bg-blue-400/10';
    case 'document_uploaded':
      return 'text-purple-400 bg-purple-400/10';
    case 'task_completed':
      return 'text-cyan-400 bg-cyan-400/10';
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

export default function OfficeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between retro-window-border dark:bg-slate-900/30 bg-stone-100/60 backdrop-blur-sm p-6 rounded-sm">
        <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-press-start dark:text-white text-stone-800 mb-4 glow-text">
            Konductor Office
          </h1>
          <p className="dark:text-cyan-400 text-amber-700 font-jersey text-lg">
            Welcome back! Here's what's happening in your AI workspace.
          </p>
        </div>
        <div className="relative z-10 mt-4 sm:mt-0 text-right">
          <p className="dark:text-slate-400 text-stone-600 text-sm font-jersey">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="dark:text-cyan-400 text-amber-600 font-mono text-lg font-bold">
            {currentTime.toLocaleTimeString('en-US', {
              hour12: false
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="retro-window-border dark:bg-slate-900/60 bg-stone-50/80 backdrop-blur-sm p-6 rounded-sm hover:scale-105 transition-all duration-300 relative"
            >
              <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="dark:text-slate-400 text-stone-600 text-sm font-jersey">{stat.title}</p>
                  <p className="text-2xl font-press-start dark:text-cyan-400 text-amber-700 mt-1 glow-text">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-jersey ${
                      stat.changeType === 'positive' ? 'dark:text-green-400 text-green-600' :
                      stat.changeType === 'negative' ? 'dark:text-red-400 text-red-600' :
                      'dark:text-slate-400 text-stone-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="dark:text-slate-400 text-stone-500 text-sm font-jersey ml-1">from last month</span>
                  </div>
                </div>
                <div className="retro-window-border dark:bg-cyan-400/20 bg-amber-200/60 p-3 rounded-sm">
                  <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                  <Icon className="relative z-10 h-6 w-6 dark:text-cyan-400 text-amber-700 pixelated" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="retro-window-border dark:bg-slate-900/60 bg-stone-50/80 backdrop-blur-sm p-6 rounded-sm relative">
            <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
            <div className="relative z-10 flex items-center justify-between mb-6">
              <h2 className="text-xl font-press-start dark:text-white text-stone-800 glow-text">Recent Activity</h2>
              <button className="retro-button-small dark:text-cyan-400 text-amber-700 hover:dark:text-cyan-300 hover:text-amber-600 text-sm font-medium transition-colors px-3 py-1">
                View All
              </button>
            </div>
            
            <div className="relative z-10 space-y-4">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 retro-window-border dark:bg-slate-800/30 bg-stone-100/50 p-3 rounded-sm relative">
                    <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                    <div className={`relative z-10 p-2 rounded-sm retro-window-border ${colorClass}`}>
                      <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                      <Icon className="relative z-10 h-4 w-4 pixelated" />
                    </div>
                    <div className="relative z-10 flex-1 min-w-0">
                      <p className="dark:text-white text-stone-800 text-sm font-jersey">{activity.message}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        {activity.user && (
                          <span className="dark:text-cyan-400 text-amber-600 text-xs font-medium font-press-start">
                            @{activity.user}
                          </span>
                        )}
                        <span className="dark:text-slate-400 text-stone-500 text-xs font-jersey">{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="retro-window-border dark:bg-slate-900/60 bg-stone-50/80 backdrop-blur-sm p-6 rounded-sm relative">
            <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
            <h3 className="relative z-10 text-lg font-press-start dark:text-white text-stone-800 mb-4 glow-text">Quick Stats</h3>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between retro-window-border dark:bg-slate-800/30 bg-stone-100/50 p-2 rounded-sm relative">
                <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                <span className="relative z-10 dark:text-slate-300 text-stone-700 text-sm font-jersey">Active Sessions</span>
                <span className="relative z-10 dark:text-cyan-400 text-amber-600 font-press-start text-sm glow-text">247</span>
              </div>
              <div className="flex items-center justify-between retro-window-border dark:bg-slate-800/30 bg-stone-100/50 p-2 rounded-sm relative">
                <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                <span className="relative z-10 dark:text-slate-300 text-stone-700 text-sm font-jersey">Messages Today</span>
                <span className="relative z-10 dark:text-green-400 text-green-600 font-press-start text-sm glow-text">1,892</span>
              </div>
              <div className="flex items-center justify-between retro-window-border dark:bg-slate-800/30 bg-stone-100/50 p-2 rounded-sm relative">
                <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                <span className="relative z-10 dark:text-slate-300 text-stone-700 text-sm font-jersey">Tasks Completed</span>
                <span className="relative z-10 dark:text-purple-400 text-purple-600 font-press-start text-sm glow-text">156</span>
              </div>
              <div className="flex items-center justify-between retro-window-border dark:bg-slate-800/30 bg-stone-100/50 p-2 rounded-sm relative">
                <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                <span className="relative z-10 dark:text-slate-300 text-stone-700 text-sm font-jersey">System Health</span>
                <span className="relative z-10 dark:text-green-400 text-green-600 font-semibold flex items-center">
                  <div className="w-2 h-2 dark:bg-green-400 bg-green-600 rounded-full mr-2 pixelated"></div>
                  Excellent
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="retro-window-border dark:bg-slate-900/60 bg-stone-50/80 backdrop-blur-sm p-6 rounded-sm relative">
            <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
            <h3 className="relative z-10 text-lg font-press-start dark:text-white text-stone-800 mb-4 glow-text">Quick Actions</h3>
            <div className="relative z-10 space-y-3">
              <button className="w-full retro-button hover:scale-105 transition-transform duration-200 py-3 px-4 text-xs">
                Create New Minion
              </button>
              <button className="w-full retro-window-border dark:bg-gradient-to-r dark:from-purple-500 dark:to-pink-500 bg-gradient-to-r from-amber-400 to-orange-500 hover:dark:from-purple-600 hover:dark:to-pink-600 hover:from-amber-500 hover:to-orange-600 dark:text-white text-stone-900 font-press-start text-xs py-3 px-4 rounded-sm transition-all duration-200 hover:scale-105 relative">
                <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                <span className="relative z-10">Upload Document</span>
              </button>
              <button className="w-full retro-window-border dark:bg-gradient-to-r dark:from-green-500 dark:to-emerald-500 bg-gradient-to-r from-green-400 to-emerald-400 hover:dark:from-green-600 hover:dark:to-emerald-600 hover:from-green-500 hover:to-emerald-500 dark:text-white text-stone-900 font-press-start text-xs py-3 px-4 rounded-sm transition-all duration-200 hover:scale-105 relative">
                <div className="absolute inset-0 retro-window-inset rounded-sm"></div>
                <span className="relative z-10">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}