"use client";

import { useState, useEffect } from "react";
import { Clock, MessageCircle, Mail, Calendar, CheckSquare } from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { getCurrentUser, getUserDefaultWorkspace, getWorkspaceTasks, getWorkspaceCalendarEvents } from "@/lib/pocketbase-utils";
import { Task, CalendarEvent, Message, User, Workspace } from "@/lib/types";
import { initializeSampleDataForUser } from "@/lib/sample-data";
import pb from "@/lib/pocketbase";

type TimelineEvent = {
  id: string;
  type: 'message' | 'email' | 'task' | 'calendar';
  title: string;
  description: string;
  timestamp: string;
  source?: string;
  originalData?: Task | CalendarEvent | Message;
};

interface TimelineProps {
  workspaceId?: string;
}

export function Timeline({ workspaceId }: TimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimelineData();
  }, [workspaceId]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        console.error('No authenticated user found');
        return;
      }
      
      setUser(currentUser);
      
      let targetWorkspaceId = workspaceId;
       if (!targetWorkspaceId) {
         let defaultWorkspace = await getUserDefaultWorkspace(currentUser.id);
         if (!defaultWorkspace) {
           console.log('No default workspace found, initializing sample data...');
           try {
             const sampleData = await initializeSampleDataForUser(currentUser.id);
             defaultWorkspace = sampleData.workspace;
             console.log('Sample data initialized successfully:', sampleData.summary);
           } catch (error) {
             console.error('Failed to initialize sample data:', error);
             return;
           }
         }
         setWorkspace(defaultWorkspace);
         targetWorkspaceId = defaultWorkspace.id;
       }
      
      // Load tasks, calendar events, and messages
      const [tasks, calendarEvents, messages] = await Promise.all([
        getWorkspaceTasks(targetWorkspaceId),
        getWorkspaceCalendarEvents(targetWorkspaceId),
        pb.collection('messages').getFullList({
          filter: `workspace = "${targetWorkspaceId}"`,
          sort: '-created',
          limit: 10
        }) as unknown as Message[]
      ]);
      
      // Convert to timeline events
      const timelineEvents: TimelineEvent[] = [];
      
      // Add recent task completions
      tasks
        .filter(task => task.status === 'completed' && task.completedAt)
        .slice(0, 3)
        .forEach(task => {
          timelineEvents.push({
            id: `task-${task.id}`,
            type: 'task',
            title: 'Task Completed',
            description: task.title,
            timestamp: formatRelativeTime(task.completedAt!),
            originalData: task
          });
        });
      
      // Add upcoming calendar events
      const now = new Date();
      const upcomingEvents = calendarEvents
        .filter(event => new Date(event.startTime) > now)
        .slice(0, 3);
      
      upcomingEvents.forEach(event => {
        timelineEvents.push({
          id: `calendar-${event.id}`,
          type: 'calendar',
          title: 'Upcoming Event',
          description: event.title,
          timestamp: formatRelativeTime(event.startTime, true),
          source: event.source,
          originalData: event
        });
      });
      
      // Add recent messages
      messages.slice(0, 5).forEach(message => {
        timelineEvents.push({
          id: `message-${message.id}`,
          type: message.type === 'email' ? 'email' : 'message',
          title: message.type === 'email' ? 'Email Received' : 'New Message',
          description: message.subject || message.preview || message.content.substring(0, 50) + '...',
          timestamp: formatRelativeTime(message.created),
          source: getChannelName(message.channel),
          originalData: message
        });
      });
      
      // Sort by timestamp (most recent first)
      timelineEvents.sort((a, b) => {
        const timeA = getTimestampValue(a.originalData);
        const timeB = getTimestampValue(b.originalData);
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });
      
      setEvents(timelineEvents.slice(0, 10)); // Limit to 10 most recent events
    } catch (error) {
      console.error('Error loading timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string, future = false): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = future ? date.getTime() - now.getTime() : now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (future) {
      if (diffMinutes < 60) return `in ${diffMinutes} minutes`;
      if (diffHours < 24) return `in ${diffHours} hours`;
      return `in ${diffDays} days`;
    } else {
      if (diffMinutes < 1) return 'just now';
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    }
  };

  const getChannelName = (channelId: string): string => {
    // This would ideally be resolved from the channel data
    // For now, return a placeholder
    return 'Channel';
  };

  const getTimestampValue = (data: any): string => {
    if (data?.completedAt) return data.completedAt;
    if (data?.startTime) return data.startTime;
    if (data?.messageTimestamp) return data.messageTimestamp;
    if (data?.created) return data.created;
    return new Date().toISOString();
  };
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

  if (loading) {
    return (
      <PixelWindow title="Timeline" stats="Loading..." variant="primary">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PixelWindow>
    );
  }

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