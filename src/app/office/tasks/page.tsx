"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Flag,
  Tag,
  Clock,
  Filter,
  MoreHorizontal,
  Bell,
  Star
} from "lucide-react";

type Priority = 'high' | 'medium' | 'low';
type TaskStatus = 'pending' | 'in_progress' | 'completed';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  tags: string[];
  reminder?: string;
  createdAt: string;
  completedAt?: string;
};

const tasks: Task[] = [
  {
    id: "1",
    title: "Review quarterly financial reports",
    description: "Analyze Q4 performance metrics and prepare summary for board meeting",
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
    tags: ["finance", "urgent"],
    reminder: "2024-01-19 09:00",
    createdAt: "2024-01-15 10:30"
  },
  {
    id: "2",
    title: "Update team documentation",
    description: "Revise onboarding guides and API documentation",
    status: "in_progress",
    priority: "medium",
    dueDate: "2024-01-25",
    tags: ["documentation", "team"],
    createdAt: "2024-01-14 14:15"
  },
  {
    id: "3",
    title: "Schedule client meeting with Acme Corp",
    status: "completed",
    priority: "high",
    tags: ["client", "meeting"],
    createdAt: "2024-01-13 11:20",
    completedAt: "2024-01-14 16:45"
  },
  {
    id: "4",
    title: "Research new AI tools for automation",
    description: "Evaluate potential tools for workflow automation and cost analysis",
    status: "pending",
    priority: "low",
    dueDate: "2024-02-01",
    tags: ["research", "ai", "automation"],
    reminder: "2024-01-30 10:00",
    createdAt: "2024-01-12 09:45"
  },
  {
    id: "5",
    title: "Prepare presentation for stakeholders",
    description: "Create slides for project milestone review",
    status: "in_progress",
    priority: "high",
    dueDate: "2024-01-18",
    tags: ["presentation", "stakeholders"],
    reminder: "2024-01-17 08:00",
    createdAt: "2024-01-10 13:30"
  }
];

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case 'high':
      return 'text-red-400 bg-red-400/10';
    case 'medium':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'low':
      return 'text-green-400 bg-green-400/10';
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

function getStatusColor(status: TaskStatus) {
  switch (status) {
    case 'completed':
      return 'text-green-400';
    case 'in_progress':
      return 'text-yellow-400';
    case 'pending':
      return 'text-slate-400';
    default:
      return 'text-slate-400';
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<'all' | TaskStatus>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | Priority>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesCompleted = showCompleted || task.status !== 'completed';
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCompleted;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Press_Start_2P'] text-2xl text-white mb-2">
            Task Lists & Reminders
          </h1>
          <p className="text-slate-300">
            Manage your tasks, set reminders, and track progress.
          </p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors mt-4 sm:mt-0">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium">Total</p>
              <p className="text-xl font-bold text-white mt-1">{taskStats.total}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-cyan-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium">Pending</p>
              <p className="text-xl font-bold text-white mt-1">{taskStats.pending}</p>
            </div>
            <Circle className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium">In Progress</p>
              <p className="text-xl font-bold text-white mt-1">{taskStats.inProgress}</p>
            </div>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium">Completed</p>
              <p className="text-xl font-bold text-white mt-1">{taskStats.completed}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium">Overdue</p>
              <p className="text-xl font-bold text-white mt-1">{taskStats.overdue}</p>
            </div>
            <Flag className="h-5 w-5 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as typeof selectedPriority)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          {/* Show Completed Toggle */}
          <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-400"
            />
            <span className="text-white text-sm">Show Completed</span>
          </label>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Tasks ({filteredTasks.length})</h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No tasks found matching your criteria.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const priorityColor = getPriorityColor(task.priority);
              const statusColor = getStatusColor(task.status);
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
              
              return (
                <div key={task.id} className={`p-6 hover:bg-white/5 transition-colors ${
                  task.status === 'completed' ? 'opacity-60' : ''
                } ${isOverdue ? 'border-l-4 border-l-red-400 bg-red-500/5' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Status Icon */}
                      <button className={`mt-1 ${statusColor}`}>
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      
                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-semibold ${
                            task.status === 'completed' ? 'line-through text-slate-400' : 'text-white'
                          }`}>
                            {task.title}
                          </h3>
                          
                          {/* Priority Badge */}
                          <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${priorityColor}`}>
                            {task.priority}
                          </span>
                          
                          {isOverdue && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                              Overdue
                            </span>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                        )}
                        
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span className={isOverdue ? 'text-red-400' : ''}>
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                          )}
                          
                          {task.reminder && (
                            <div className="flex items-center space-x-1">
                              <Bell className="h-4 w-4" />
                              <span>Reminder set</span>
                            </div>
                          )}
                          
                          {task.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Tag className="h-4 w-4" />
                              <div className="flex space-x-1">
                                {task.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-slate-500 text-xs whitespace-nowrap">
                        {task.completedAt ? `Completed ${formatDate(task.completedAt)}` : `Created ${formatDate(task.createdAt)}`}
                      </span>
                      
                      <button className="p-1 text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}