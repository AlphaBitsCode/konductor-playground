"use client";

import { Clock, MessageCircle, Mail, Calendar, CheckSquare } from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";

type TimelineEvent = {
  id: string;
  type: 'message' | 'email' | 'task' | 'calendar';
  title: string;
  description: string;
  timestamp: string;
  source?: string;
};

const sampleEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "message",
    title: "New WhatsApp Message",
    description: "Message from John: Meeting at 3 PM today?",
    timestamp: "2 minutes ago",
    source: "WhatsApp"
  },
  {
    id: "2",
    type: "email",
    title: "Email Received",
    description: "Project update from Sarah",
    timestamp: "15 minutes ago",
    source: "Gmail"
  },
  {
    id: "3",
    type: "task",
    title: "Task Completed",
    description: "Review marketing proposals",
    timestamp: "1 hour ago"
  },
  {
    id: "4",
    type: "calendar",
    title: "Upcoming Meeting",
    description: "Team Standup in 30 minutes",
    timestamp: "30 minutes",
    source: "Calendar"
  },
  {
    id: "5",
    type: "message",
    title: "Slack Notification",
    description: "New message in #general channel",
    timestamp: "2 hours ago",
    source: "Slack"
  }
];

interface TimelineProps {
  events?: TimelineEvent[];
}

export function Timeline({ events = sampleEvents }: TimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'task':
        return <CheckSquare className="w-4 h-4" />;
      case 'calendar':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'message':
        return 'dark:text-green-400 text-green-600';
      case 'email':
        return 'dark:text-red-400 text-red-600';
      case 'task':
        return 'dark:text-blue-400 text-blue-600';
      case 'calendar':
        return 'dark:text-purple-400 text-purple-600';
      default:
        return 'dark:text-slate-400 text-stone-600';
    }
  };

  const getBorderColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'message':
        return 'dark:border-green-400 border-green-600';
      case 'email':
        return 'dark:border-red-400 border-red-600';
      case 'task':
        return 'dark:border-blue-400 border-blue-600';
      case 'calendar':
        return 'dark:border-purple-400 border-purple-600';
      default:
        return 'dark:border-slate-400 border-stone-600';
    }
  };

  return (
    <PixelWindow title="Timeline" stats={`${events.length} events`} variant="primary">
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto dark:text-slate-500 text-stone-500 mb-4" />
            <div className="text-sm font-jersey dark:text-slate-300 text-stone-700 mb-2">
              No recent activity
            </div>
            <div className="text-xs dark:text-slate-500 text-stone-500">
              Connect channels to see timeline updates
            </div>
          </div>
        ) : (
          events.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {index < events.length - 1 && (
                <div className="absolute left-6 top-8 w-0.5 h-8 dark:bg-slate-600 bg-stone-400"></div>
              )}
              
              <div className="flex items-start space-x-3">
                {/* Event icon */}
                <div className={`w-12 h-12 retro-border-thick flex items-center justify-center ${getEventColor(event.type)} ${getBorderColor(event.type)} dark:bg-slate-800 bg-stone-200`}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-press-start text-xs dark:text-white text-stone-900 truncate">
                      {event.title}
                    </h4>
                    <span className="text-xs font-jersey dark:text-slate-500 text-stone-500 whitespace-nowrap ml-2">
                      {event.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-sm font-jersey dark:text-slate-300 text-stone-700 mb-1">
                    {event.description}
                  </p>
                  
                  {event.source && (
                    <span className="inline-block px-2 py-1 text-xs font-press-start retro-border-thick dark:bg-slate-700 bg-stone-300 dark:text-slate-300 text-stone-700">
                      {event.source}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-slate-600 border-stone-400">
          <button className="w-full retro-button-3d retro-border-thick p-2 font-press-start text-xs">
            VIEW ALL ACTIVITY
          </button>
        </div>
      )}
    </PixelWindow>
  );
}