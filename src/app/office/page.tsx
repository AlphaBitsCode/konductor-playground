"use client";

import { useState } from "react";
import {
  MessageCircle,
  Settings,
  CheckSquare
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OnboardingChannels } from "@/components/office/OnboardingChannels";
import { Timeline } from "@/components/office/Timeline";
import { TasksList } from "@/components/office/TasksList";
import { CalendarWidget } from "@/components/office/CalendarWidget";

export default function OfficeDashboard() {
  const [username] = useState('johndoe'); // This would come from user context
  
  // Mock data for stats
  const connectedChannels = 0;
  const totalChannels = 4;
  const completedTodos = 1;
  const totalTodos = 3;





  return (
    <div className="page-content-with-sticky-header">
      <PageHeader 
        title="Dashboard"
        subtitle="Workspace Overview"
        breadcrumbs={[]}
        actions={
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 px-3 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
              <MessageCircle className="h-3 w-3 dark:text-cyan-400 text-amber-600" />
              <span className="font-jersey dark:text-slate-300 text-stone-700">0 Messages</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
              <Settings className="h-3 w-3 dark:text-green-400 text-green-600" />
              <span className="font-jersey dark:text-slate-300 text-stone-700">{connectedChannels}/{totalChannels} Channels</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
              <CheckSquare className="h-3 w-3 dark:text-blue-400 text-blue-600" />
              <span className="font-jersey dark:text-slate-300 text-stone-700">{completedTodos}/{totalTodos} Tasks</span>
            </div>
          </div>
        }
      />
      
      <div className="retro-theme retro-high-contrast p-4 space-y-4 pt-2 min-h-screen">
        {/* Onboarding Channels - Full Width */}
        <OnboardingChannels username={username} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Half - Timeline */}
          <div className="space-y-4">
            <Timeline />
          </div>
          
          {/* Right Half - Tasks and Calendar */}
          <div className="space-y-4">
            <TasksList />
            <CalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
}