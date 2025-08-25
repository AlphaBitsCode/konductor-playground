"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MessageCircle,
  Mail,
  Calendar,
  CheckSquare,
  Clock,
  ChevronDown,
  ArrowRight,
  ArrowDown
} from "lucide-react";

type Workspace = {
  id: string;
  name: string;
  isDefault: boolean;
};

const workspaces: Workspace[] = [
  { id: "1", name: "Default Workspace", isDefault: true },
  { id: "2", name: "Marketing Team", isDefault: false },
  { id: "3", name: "Development", isDefault: false },
];

type CommunicationChannel = {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  color: string;
};

const communicationChannels: CommunicationChannel[] = [
  { id: "whatsapp", name: "WhatsApp", icon: "💬", connected: false, color: "text-green-500" },
  { id: "zalo", name: "Zalo", icon: "💙", connected: false, color: "text-blue-500" },
  { id: "slack", name: "Slack", icon: "💼", connected: false, color: "text-purple-500" },
  { id: "email", name: "Email", icon: "📧", connected: false, color: "text-red-500" },
];

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
};

const todoItems: TodoItem[] = [
  { id: "1", title: "Review marketing proposals", completed: false, priority: "high" },
  { id: "2", title: "Schedule team meeting", completed: false, priority: "medium" },
  { id: "3", title: "Update project documentation", completed: true, priority: "low" },
];

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  date: string;
};

const upcomingEvents: CalendarEvent[] = [
  { id: "1", title: "Team Standup", time: "09:00", date: "Today" },
  { id: "2", title: "Client Presentation", time: "14:30", date: "Today" },
  { id: "3", title: "Project Review", time: "10:00", date: "Tomorrow" },
];

export default function OfficeDashboard() {
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Top Bar with Workspace Selection */}
      <div className="flex justify-end mb-8">
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="flex items-center space-x-2 px-4 py-2 dark:bg-slate-800/60 bg-stone-200/80 border-2 border-solid dark:border-slate-600 border-stone-400 font-jersey dark:text-white text-stone-800 hover:dark:bg-slate-700/60 hover:bg-stone-300/80 transition-colors pixelated-stairs"
          >
            <span>{selectedWorkspace.name}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showWorkspaceDropdown && (
            <div className="absolute right-0 mt-2 w-64 dark:bg-slate-800 bg-stone-100 border-2 border-solid dark:border-slate-600 border-stone-400 shadow-lg z-50 pixelated-stairs">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => {
                    setSelectedWorkspace(workspace);
                    setShowWorkspaceDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 font-jersey hover:dark:bg-slate-700 hover:bg-stone-200 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedWorkspace.id === workspace.id ? 'dark:bg-slate-700 bg-stone-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="dark:text-white text-stone-800">{workspace.name}</span>
                    {workspace.isDefault && (
                      <span className="text-xs dark:text-cyan-400 text-amber-600 font-press-start">DEFAULT</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Communication Channels Column */}
        <div className="lg:col-span-2">
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners dark:bg-slate-800/40 bg-stone-100/60 p-6">
            <h3 className="font-press-start text-sm dark:text-white text-stone-800 mb-6 text-center">Channels</h3>
            <div className="space-y-4">
              {communicationChannels.map((channel) => (
                <div key={channel.id} className="flex flex-col items-center">
                  <button
                    className={`w-12 h-12 border-2 border-solid flex items-center justify-center text-2xl transition-all pixelated-stairs ${
                      channel.connected 
                        ? 'dark:bg-slate-700 bg-stone-200 dark:border-slate-500 border-stone-500 hover:scale-105' 
                        : 'dark:bg-slate-900/50 bg-stone-300/50 dark:border-slate-700 border-stone-500 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!channel.connected}
                  >
                    {channel.icon}
                  </button>
                  <span className="text-xs font-jersey dark:text-slate-400 text-stone-600 mt-1 text-center">
                    {channel.name}
                  </span>
                  {/* Arrow pointing right */}
                  <ArrowRight className="h-4 w-4 dark:text-slate-500 text-stone-500 mt-2" />
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* Konductor Logo Column */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners dark:bg-slate-800/40 bg-stone-100/60 p-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4">
                <Image
                  src="/logos/k_icon.png"
                  alt="Konductor Logo"
                  width={64}
                  height={64}
                  className="pixelated"
                />
              </div>
              <span className="font-press-start text-xs dark:text-white text-stone-800 text-center">KONDUCTOR</span>
            </div>
            </div>
          </div>
          
          {/* Arrows pointing to sections */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <ArrowDown className="h-6 w-6 dark:text-slate-500 text-stone-500" />
            <ArrowDown className="h-6 w-6 dark:text-slate-500 text-stone-500" />
            <ArrowDown className="h-6 w-6 dark:text-slate-500 text-stone-500" />
            <ArrowDown className="h-6 w-6 dark:text-slate-500 text-stone-500" />
          </div>
        </div>

        {/* Right Side Sections */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeline Section */}
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners dark:bg-slate-800/40 bg-stone-100/60 p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 dark:text-cyan-400 text-amber-600 mr-2" />
              <h3 className="font-press-start text-sm dark:text-white text-stone-800">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
                No recent activity
              </div>
              <div className="text-xs dark:text-slate-500 text-stone-500">
                Connect channels to see timeline updates
              </div>
            </div>
            </div>
          </div>

          {/* TODO List Section */}
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners dark:bg-slate-800/40 bg-stone-100/60 p-6">
            <div className="flex items-center mb-4">
              <CheckSquare className="h-5 w-5 dark:text-cyan-400 text-amber-600 mr-2" />
              <h3 className="font-press-start text-sm dark:text-white text-stone-800">TODO List</h3>
            </div>
            <div className="space-y-3">
              {todoItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="w-4 h-4 border-2 dark:border-slate-500 border-stone-500 pixelated"
                    readOnly
                  />
                  <span className={`text-sm font-jersey ${
                    item.completed 
                      ? 'dark:text-slate-500 text-stone-500 line-through' 
                      : 'dark:text-slate-300 text-stone-700'
                  }`}>
                    {item.title}
                  </span>
                  <span className={`text-xs px-2 py-1 font-press-start pixelated-stairs ${
                    item.priority === 'high' ? 'dark:bg-red-900/30 bg-red-200/60 dark:text-red-400 text-red-700' :
                    item.priority === 'medium' ? 'dark:bg-yellow-900/30 bg-yellow-200/60 dark:text-yellow-400 text-yellow-700' :
                    'dark:bg-green-900/30 bg-green-200/60 dark:text-green-400 text-green-700'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Conversations Summary Section */}
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners dark:bg-slate-800/40 bg-stone-100/60 p-6">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-5 w-5 dark:text-cyan-400 text-amber-600 mr-2" />
              <h3 className="font-press-start text-sm dark:text-white text-stone-800">Conversations</h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
                No conversations yet
              </div>
              <div className="text-xs dark:text-slate-500 text-stone-500">
                Connect communication channels to start
              </div>
            </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners dark:bg-slate-800/40 bg-stone-100/60 p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 dark:text-cyan-400 text-amber-600 mr-2" />
              <h3 className="font-press-start text-sm dark:text-white text-stone-800">Calendar</h3>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
                      {event.title}
                    </div>
                    <div className="text-xs dark:text-slate-500 text-stone-500">
                      {event.date} at {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}