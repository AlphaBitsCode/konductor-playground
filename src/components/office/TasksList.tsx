"use client";

import { useState } from "react";
import { CheckSquare, Plus, X } from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
};

const initialTodos: TodoItem[] = [
  { id: "1", title: "Review marketing proposals", completed: false, priority: "high", dueDate: "Today" },
  { id: "2", title: "Schedule team meeting", completed: false, priority: "medium", dueDate: "Tomorrow" },
  { id: "3", title: "Update project documentation", completed: true, priority: "low" },
  { id: "4", title: "Prepare client presentation", completed: false, priority: "high", dueDate: "Friday" },
  { id: "5", title: "Code review for new feature", completed: false, priority: "medium" },
];

interface TasksListProps {
  tasks?: TodoItem[];
}

export function TasksList({ tasks = initialTodos }: TasksListProps) {
  const [todos, setTodos] = useState(tasks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const completedTodos = todos.filter(item => item.completed).length;
  const totalTodos = todos.length;

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addNewTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: TodoItem = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        priority: newTaskPriority
      };
      setTodos(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setShowAddForm(false);
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
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

  return (
    <PixelWindow title="Tasks" stats={`${completedTodos}/${totalTodos} completed`} variant="secondary">
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
          {todos.length === 0 ? (
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
            todos.map((item) => (
              <div key={item.id} className="group flex items-start space-x-3 p-2 retro-border-thick dark:bg-slate-800/50 bg-stone-100/50 hover:dark:bg-slate-700/50 hover:bg-stone-200/50 transition-colors">
                <button
                  onClick={() => toggleTodo(item.id)}
                  className="mt-1"
                >
                  <div className={`w-4 h-4 retro-border-thick flex items-center justify-center ${
                    item.completed 
                      ? 'dark:bg-green-600 bg-green-500 dark:border-green-400 border-green-600' 
                      : 'dark:bg-slate-700 bg-stone-200 dark:border-slate-500 border-stone-400'
                  }`}>
                    {item.completed && (
                      <CheckSquare className="w-3 h-3 text-white" />
                    )}
                  </div>
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-jersey ${
                      item.completed 
                        ? 'dark:text-slate-500 text-stone-500 line-through' 
                        : 'dark:text-slate-300 text-stone-700'
                    }`}>
                      {item.title}
                    </span>
                    
                    <button
                      onClick={() => deleteTodo(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity retro-button-3d retro-border-thick p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 font-press-start retro-border-thick ${
                      getPriorityColor(item.priority)
                    }`}>
                      {item.priority.toUpperCase()}
                    </span>
                    
                    {item.dueDate && (
                      <span className="text-xs font-jersey dark:text-slate-500 text-stone-500">
                        Due: {item.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {todos.length > 0 && (
          <div className="pt-3 border-t dark:border-slate-600 border-stone-400">
            <div className="flex justify-between text-xs font-jersey dark:text-slate-400 text-stone-600">
              <span>Completed: {completedTodos}</span>
              <span>Remaining: {totalTodos - completedTodos}</span>
            </div>
          </div>
        )}
      </div>
    </PixelWindow>
  );
}