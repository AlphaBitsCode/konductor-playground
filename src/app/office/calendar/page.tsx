"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Search,
  Bell,
  Video,
  Phone
} from "lucide-react";

type EventType = 'meeting' | 'reminder' | 'task' | 'personal';

type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  isAllDay?: boolean;
  reminder?: string;
  source: 'manual' | 'gmail' | 'outlook' | 'task';
};

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    description: "Daily team sync and progress updates",
    type: "meeting",
    startTime: "2024-01-16T09:00:00",
    endTime: "2024-01-16T09:30:00",
    location: "Conference Room A",
    attendees: ["john@company.com", "sarah@company.com", "mike@company.com"],
    reminder: "15 minutes",
    source: "gmail"
  },
  {
    id: "2",
    title: "Client Presentation",
    description: "Q4 results presentation for Acme Corp",
    type: "meeting",
    startTime: "2024-01-16T14:00:00",
    endTime: "2024-01-16T15:30:00",
    location: "Zoom Meeting",
    attendees: ["client@acme.com", "sales@company.com"],
    reminder: "30 minutes",
    source: "outlook"
  },
  {
    id: "3",
    title: "Lunch Break",
    type: "personal",
    startTime: "2024-01-16T12:00:00",
    endTime: "2024-01-16T13:00:00",
    source: "manual"
  },
  {
    id: "4",
    title: "Review Financial Reports",
    description: "Complete quarterly financial analysis",
    type: "task",
    startTime: "2024-01-17T10:00:00",
    endTime: "2024-01-17T12:00:00",
    reminder: "1 hour",
    source: "task"
  },
  {
    id: "5",
    title: "Doctor Appointment",
    type: "personal",
    startTime: "2024-01-18T15:00:00",
    endTime: "2024-01-18T16:00:00",
    location: "Medical Center",
    reminder: "2 hours",
    source: "manual"
  },
  {
    id: "6",
    title: "Project Planning Session",
    description: "Plan Q1 roadmap and resource allocation",
    type: "meeting",
    startTime: "2024-01-19T13:00:00",
    endTime: "2024-01-19T15:00:00",
    location: "Conference Room B",
    attendees: ["team@company.com"],
    reminder: "1 hour",
    source: "gmail"
  }
];

function getEventTypeColor(type: EventType) {
  switch (type) {
    case 'meeting':
      return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
    case 'reminder':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
    case 'task':
      return 'bg-green-500/20 text-green-400 border-green-400/30';
    case 'personal':
      return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-400/30';
  }
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function isSameDay(date1: string, date2: Date) {
  const d1 = new Date(date1);
  return d1.toDateString() === date2.toDateString();
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<'all' | EventType>('all');

  // Get events for current view
  const getEventsForView = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      
      if (selectedView === 'day') {
        return isSameDay(event.startTime, currentDate);
      } else if (selectedView === 'week') {
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }
      // For month view, show all events (simplified)
      return true;
    });
  };

  const filteredEvents = getEventsForView().filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || event.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Group events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const date = new Date(event.startTime).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const eventStats = {
    total: events.length,
    today: events.filter(e => isSameDay(e.startTime, new Date())).length,
    thisWeek: events.filter(e => {
      const eventDate = new Date(e.startTime);
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }).length,
    meetings: events.filter(e => e.type === 'meeting').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Press_Start_2P'] text-2xl text-white mb-2">
            Calendar View
          </h1>
          <p className="text-slate-300">
            View and manage your schedule from all connected sources.
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Events</p>
              <p className="text-2xl font-bold text-white mt-1">{eventStats.total}</p>
            </div>
            <CalendarIcon className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Today</p>
              <p className="text-2xl font-bold text-white mt-1">{eventStats.today}</p>
            </div>
            <Clock className="h-6 w-6 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">This Week</p>
              <p className="text-2xl font-bold text-white mt-1">{eventStats.thisWeek}</p>
            </div>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Meetings</p>
              <p className="text-2xl font-bold text-white mt-1">{eventStats.meetings}</p>
            </div>
            <Users className="h-6 w-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white min-w-0">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* View Selector */}
          <div className="flex space-x-2">
            {(['day', 'week', 'month'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  selectedView === view
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Types</option>
            <option value="meeting">Meetings</option>
            <option value="task">Tasks</option>
            <option value="reminder">Reminders</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Events ({filteredEvents.length})</h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {Object.keys(eventsByDate).length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No events found for the selected period.</p>
            </div>
          ) : (
            Object.entries(eventsByDate)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, dayEvents]) => (
                <div key={date} className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {formatDate(date)}
                  </h3>
                  
                  <div className="space-y-3">
                    {dayEvents
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .map((event) => {
                        const typeColor = getEventTypeColor(event.type);
                        
                        return (
                          <div key={event.id} className={`p-4 rounded-lg border ${typeColor}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-white">{event.title}</h4>
                                  <span className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs rounded-full capitalize">
                                    {event.type}
                                  </span>
                                  <span className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs rounded-full">
                                    {event.source}
                                  </span>
                                </div>
                                
                                {event.description && (
                                  <p className="text-slate-300 text-sm mb-3">{event.description}</p>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </span>
                                  </div>
                                  
                                  {event.location && (
                                    <div className="flex items-center space-x-1">
                                      {event.location.includes('Zoom') || event.location.includes('Meet') ? (
                                        <Video className="h-4 w-4" />
                                      ) : event.location.includes('Phone') ? (
                                        <Phone className="h-4 w-4" />
                                      ) : (
                                        <MapPin className="h-4 w-4" />
                                      )}
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                  
                                  {event.attendees && event.attendees.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-4 w-4" />
                                      <span>{event.attendees.length} attendees</span>
                                    </div>
                                  )}
                                  
                                  {event.reminder && (
                                    <div className="flex items-center space-x-1">
                                      <Bell className="h-4 w-4" />
                                      <span>{event.reminder} reminder</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}