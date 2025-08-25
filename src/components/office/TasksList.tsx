"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Plus, X } from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { getCurrentUser, getUserDefaultWorkspace, getWorkspaceTasks, createTask, updateChannelStatus } from "@/lib/pocketbase-utils";
import { Task, User, Workspace } from "@/lib/types";
import { initializeSampleDataForUser } from "@/lib/sample-data";
import pb from "@/lib/pocketbase";

interface TasksListProps {
  workspaceId?: string;
}

export function TasksList({ workspaceId }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [workspaceId]);

  const loadTasks = async () => {
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
      
      const workspaceTasks = await getWorkspaceTasks(targetWorkspaceId);
      setTasks(workspaceTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'completed') {
        updateData.completedAt = new Date().toISOString();
      } else {
        updateData.completedAt = null;
      }
      
      await pb.collection('tasks').update(id, updateData);
      
      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, status: newStatus, completedAt: updateData.completedAt } : t
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const addNewTask = async () => {
    if (!newTaskTitle.trim() || !workspace) return;
    
    try {
      const newTask = await createTask({
        workspace: workspace.id,
        title: newTaskTitle.trim(),
        status: 'pending',
        priority: newTaskPriority,
        tags: []
      });
      
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await pb.collection('tasks').delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'dark:bg-red-900/30 bg-red-200/60 dark:text-red-400 text-red-700 dark:border-red-400 border-red-700';
      case 'medium':
        return 'dark:bg-yellow-900/30 bg-yellow-200/60 dark:text-yellow-400 text-yellow-700 dark:border-yellow-400 border-yellow-700';
      case 'low':
        return 'dark:bg-green-900/30 bg-green-200/60 dark:text-green-400 text-green-700 dark:border-green-400 border-green-700';
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <PixelWindow title="Tasks" stats="Loading..." variant="secondary">
        <div className="space-y-3">
          <div className="animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2 retro-border-thick dark:bg-slate-800/50 bg-stone-100/50">
                <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PixelWindow>
    );
  }

  return (
    <PixelWindow title="Tasks" stats={`${completedTasks}/${totalTasks} completed`} variant="secondary">
      <div className="space-y-3">
        {/* Add Task Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full retro-button-3d retro-border-thick p-3 font-press-start text-xs flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>ADD TASK</span>
          </button>
        )}

        {/* Add Task Form */}
        {showAddForm && (
          <div className="retro-border-thick p-3 dark:bg-slate-800 bg-stone-200 space-y-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full p-2 retro-border-thick dark:bg-slate-700 bg-stone-100 font-jersey text-sm dark:text-white text-stone-900 placeholder:dark:text-slate-400 placeholder:text-stone-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
            />
            
            <div className="flex items-center space-x-2">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="flex-1 p-2 retro-border-thick dark:bg-slate-700 bg-stone-100 font-jersey text-sm dark:text-white text-stone-900"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <button
                onClick={addNewTask}
                className="retro-button-3d retro-border-thick p-2 font-press-start text-xs"
              >
                ADD
              </button>
              
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                  setNewTaskPriority('medium');
                }}
                className="retro-button-3d retro-border-thick p-2 font-press-start text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 mx-auto dark:text-slate-500 text-stone-500 mb-4" />
              <div className="text-sm font-jersey dark:text-slate-300 text-stone-700 mb-2">
                No tasks yet
              </div>
              <div className="text-xs dark:text-slate-500 text-stone-500">
                Add your first task to get started
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="group flex items-start space-x-3 p-2 retro-border-thick dark:bg-slate-800/50 bg-stone-100/50 hover:dark:bg-slate-700/50 hover:bg-stone-200/50 transition-colors">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1"
                >
                  <div className={`w-4 h-4 retro-border-thick flex items-center justify-center ${
                    task.status === 'completed' 
                      ? 'dark:bg-green-600 bg-green-500 dark:border-green-400 border-green-600' 
                      : 'dark:bg-slate-700 bg-stone-200 dark:border-slate-500 border-stone-400'
                  }`}>
                    {task.status === 'completed' && (
                      <CheckSquare className="w-3 h-3 text-white" />
                    )}
                  </div>
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-jersey ${
                      task.status === 'completed' 
                        ? 'dark:text-slate-500 text-stone-500 line-through' 
                        : 'dark:text-slate-300 text-stone-700'
                    }`}>
                      {task.title}
                    </span>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity retro-button-3d retro-border-thick p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 font-press-start retro-border-thick ${
                      getPriorityColor(task.priority)
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                    
                    {task.dueDate && (
                      <span className="text-xs font-jersey dark:text-slate-500 text-stone-500">
                        Due: {formatDueDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {tasks.length > 0 && (
          <div className="pt-3 border-t dark:border-slate-600 border-stone-400">
            <div className="flex justify-between text-xs font-jersey dark:text-slate-400 text-stone-600">
              <span>Completed: {completedTasks}</span>
              <span>Remaining: {totalTasks - completedTasks}</span>
            </div>
          </div>
        )}
      </div>
    </PixelWindow>
  );
}