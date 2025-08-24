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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-press-start text-white mb-4">
            Konductor Office
          </h1>
          <p className="text-cyan-400 font-jersey text-lg">
            Welcome back! Here's what's happening in your AI workspace.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <p className="text-slate-400 text-sm">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-cyan-400 font-mono text-lg">
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
              className="bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur-lg rounded-xl p-6 border-2 border-cyan-400/30 retro-border hover:border-cyan-400/60 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-jersey">{stat.title}</p>
                  <p className="text-2xl font-press-start text-cyan-400 mt-1 glow-text">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-jersey ${
                      stat.changeType === 'positive' ? 'text-green-400' :
                      stat.changeType === 'negative' ? 'text-red-400' :
                      'text-slate-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-slate-400 text-sm font-jersey ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-cyan-400/20 rounded-lg">
                  <Icon className="h-6 w-6 text-cyan-400" />
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
          <div className="bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur-lg rounded-xl p-6 border-2 border-cyan-400/30 retro-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-press-start text-white">Recent Activity</h2>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{activity.message}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        {activity.user && (
                          <span className="text-cyan-400 text-xs font-medium">
                            @{activity.user}
                          </span>
                        )}
                        <span className="text-slate-400 text-xs">{activity.timestamp}</span>
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
          <div className="bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-400/30 retro-border">
            <h3 className="text-lg font-press-start text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm font-jersey">Active Sessions</span>
                <span className="text-cyan-400 font-press-start text-sm glow-text">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm font-jersey">Messages Today</span>
                <span className="text-green-400 font-press-start text-sm glow-text">1,892</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm font-jersey">Tasks Completed</span>
                <span className="text-purple-400 font-press-start text-sm glow-text">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">System Health</span>
                <span className="text-green-400 font-semibold flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Excellent
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-400/30 retro-border">
            <h3 className="text-lg font-press-start text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full retro-button hover:scale-105 transition-transform duration-200">
                Create New Minion
              </button>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-black font-press-start text-xs py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 border-2 border-purple-400">
                Upload Document
              </button>
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-press-start text-xs py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 border-2 border-green-400">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}