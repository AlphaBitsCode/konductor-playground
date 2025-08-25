"use client";

import { useState, useMemo } from "react";
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
};

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: new Date(2024, 0, 15, 9, 0), // Today 9:00 AM
    end: new Date(2024, 0, 15, 9, 30),   // Today 9:30 AM
  },
  {
    id: "2",
    title: "Client Presentation",
    start: new Date(2024, 0, 15, 14, 30), // Today 2:30 PM
    end: new Date(2024, 0, 15, 15, 30),   // Today 3:30 PM
  },
  {
    id: "3",
    title: "Project Review",
    start: new Date(2024, 0, 16, 10, 0), // Tomorrow 10:00 AM
    end: new Date(2024, 0, 16, 11, 0),   // Tomorrow 11:00 AM
  },
  {
    id: "4",
    title: "Design Workshop",
    start: new Date(2024, 0, 17, 13, 0), // Day after tomorrow 1:00 PM
    end: new Date(2024, 0, 17, 16, 0),   // Day after tomorrow 4:00 PM
  },
  {
    id: "5",
    title: "Weekly Planning",
    start: new Date(2024, 0, 18, 11, 0), // Thursday 11:00 AM
    end: new Date(2024, 0, 18, 12, 0),   // Thursday 12:00 PM
  },
  {
    id: "6",
    title: "Team Lunch",
    start: new Date(2024, 0, 19, 12, 30), // Friday 12:30 PM
    end: new Date(2024, 0, 19, 13, 30),   // Friday 1:30 PM
  }
];

interface CalendarWidgetProps {
  events?: CalendarEvent[];
}

export function CalendarWidget({ events = sampleEvents }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('work_week');

  // Get the start of the work week (Monday)
  const getWorkWeekStart = (date: Date) => {
    const start = moment(date).startOf('isoWeek'); // Monday
    return start.toDate();
  };

  // Get the end of the work week (Friday)
  const getWorkWeekEnd = (date: Date) => {
    const end = moment(date).startOf('isoWeek').add(4, 'days').endOf('day'); // Friday
    return end.toDate();
  };

  const navigateToNext = () => {
    const nextWeek = moment(currentDate).add(1, 'week').toDate();
    setCurrentDate(nextWeek);
  };

  const navigateToPrev = () => {
    const prevWeek = moment(currentDate).subtract(1, 'week').toDate();
    setCurrentDate(prevWeek);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const weekRange = useMemo(() => {
    const start = getWorkWeekStart(currentDate);
    const end = getWorkWeekEnd(currentDate);
    return {
      start: moment(start).format('MMM D'),
      end: moment(end).format('MMM D, YYYY')
    };
  }, [currentDate]);

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: '#0f172a',
        borderColor: '#06b6d4',
        color: '#ffffff',
        border: '2px solid #06b6d4',
        borderRadius: '0',
        fontSize: '11px',
        fontFamily: 'Jersey 25, monospace',
        padding: '2px 4px'
      }
    };
  };

  return (
    <PixelWindow title="Calendar" stats={`${events.length} events`} variant="secondary">
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={navigateToPrev}
              className="retro-button-3d retro-border-thick p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={navigateToToday}
              className="retro-button-3d retro-border-thick px-3 py-2 font-press-start text-xs"
            >
              TODAY
            </button>
            
            <button
              onClick={navigateToNext}
              className="retro-button-3d retro-border-thick p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="font-press-start text-xs dark:text-cyan-400 text-amber-600">
            {weekRange.start} - {weekRange.end}
          </div>
        </div>

        {/* Calendar Component */}
        <div className="retro-border-thick dark:bg-slate-800 bg-stone-100 p-2" style={{ height: '300px' }}>
          <style jsx global>{`
            .rbc-calendar {
              font-family: 'Jersey 25', monospace;
              background: transparent;
            }
            .rbc-header {
              background: transparent;
              border-bottom: 2px solid;
              border-color: rgb(71 85 105);
              color: rgb(203 213 225);
              font-family: 'Press Start 2P', monospace;
              font-size: 10px;
              padding: 8px 4px;
              text-align: center;
            }
            .rbc-time-view {
              background: transparent;
            }
            .rbc-time-header {
              background: transparent;
              border-bottom: 2px solid;
              border-color: rgb(71 85 105);
            }
            .rbc-time-content {
              background: transparent;
            }
            .rbc-timeslot-group {
              border-bottom: 1px solid;
              border-color: rgb(71 85 105);
            }
            .rbc-time-slot {
              border-top: 1px solid;
              border-color: rgb(71 85 105);
            }
            .rbc-day-slot {
              border-right: 2px solid;
              border-color: rgb(71 85 105);
            }
            .rbc-today {
              background-color: rgba(6, 182, 212, 0.1);
            }
            .rbc-event {
              background-color: rgb(15 23 42);
              border: 2px solid rgb(6 182 212);
              color: white;
              border-radius: 0;
              font-family: 'Jersey 25', monospace;
              font-size: 11px;
              padding: 2px 4px;
            }
            .rbc-event:hover {
              background-color: rgb(30 41 59);
            }
            .rbc-time-gutter {
              background: transparent;
              border-right: 2px solid;
              border-color: rgb(71 85 105);
            }
            .rbc-time-gutter .rbc-timeslot-group {
              border-bottom: 1px solid;
              border-color: rgb(71 85 105);
            }
            .rbc-label {
              color: rgb(148 163 184);
              font-family: 'Jersey 25', monospace;
              font-size: 10px;
            }
            .rbc-toolbar {
              display: none;
            }
          `}</style>
          
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            onView={setView}
            date={currentDate}
            onNavigate={setCurrentDate}
            toolbar={false}
            eventPropGetter={eventStyleGetter}
            min={new Date(2024, 0, 1, 8, 0)} // 8 AM
            max={new Date(2024, 0, 1, 18, 0)} // 6 PM
            step={30}
            timeslots={2}
            views={{
              work_week: true
            }}
            defaultView="work_week"
          />
        </div>

        {/* Quick Event List */}
        <div className="space-y-2">
          <h4 className="font-press-start text-xs dark:text-white text-stone-900">
            Upcoming Events
          </h4>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {events
              .filter(event => moment(event.start).isAfter(moment()))
              .sort((a, b) => moment(a.start).diff(moment(b.start)))
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-3 h-3 dark:text-cyan-400 text-amber-600" />
                    <span className="font-jersey dark:text-slate-300 text-stone-700 truncate">
                      {event.title}
                    </span>
                  </div>
                  <span className="text-xs font-jersey dark:text-slate-500 text-stone-500 whitespace-nowrap">
                    {moment(event.start).format('MMM D, h:mm A')}
                  </span>
                </div>
              ))
            }
          </div>
          
          {events.filter(event => moment(event.start).isAfter(moment())).length === 0 && (
            <div className="text-center py-4">
              <CalendarIcon className="w-8 h-8 mx-auto dark:text-slate-500 text-stone-500 mb-2" />
              <div className="text-xs font-jersey dark:text-slate-500 text-stone-500">
                No upcoming events
              </div>
            </div>
          )}
        </div>
      </div>
    </PixelWindow>
  );
}