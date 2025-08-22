'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const Clouds = dynamic(() => import('@/components/ui/Clouds'), { ssr: false });
const SeaWithShips = dynamic(() => import('@/components/ui/SeaWithShips'), { ssr: false });
const WalkingCharacter = dynamic(
    () => import('@/components/marketing/landing/WalkingCharacter').then(mod => mod.WalkingCharacter),
    { ssr: false }
  );

interface DashboardClientProps {
  model: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

export default function DashboardClient({ model }: DashboardClientProps) {
  const [stats, setStats] = useState({
    tasksCompleted: 42,
    projectsActive: 7,
    teamMembers: 3,
  });

  // Mock tasks data
  const [tasks] = useState([
    { id: 1, title: 'Update investor deck', status: 'in-progress' },
    { id: 2, title: 'Prepare Q3 report', status: 'pending' },
    { id: 3, title: 'Schedule team sync', status: 'completed' },
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-sky-200">
      {/* Sky and Clouds */}
      <div className="absolute inset-0">
        <Clouds />
      </div>

      {/* Walking Character */}
      <div className="absolute bottom-[33%] left-1/4 transform -translate-x-1/2 z-20">
        <WalkingCharacter />
      </div>

      {/* Sea with Ships */}
      <div className="absolute bottom-0 w-full h-1/3">
        <SeaWithShips />
      </div>

      {/* Stats Panel - Pixel Art Style */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-lg z-10">
        <h2 className="text-lg font-bold mb-3 text-center">📊 Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-100 p-2 rounded border border-black text-center">
            <div className="text-2xl font-mono">{stats.tasksCompleted}</div>
            <div className="text-xs">Tasks Done</div>
          </div>
          <div className="bg-blue-100 p-2 rounded border border-black text-center">
            <div className="text-2xl font-mono">{stats.projectsActive}</div>
            <div className="text-xs">Projects</div>
          </div>
          <div className="bg-green-100 p-2 rounded border border-black text-center">
            <div className="text-2xl font-mono">{stats.teamMembers}</div>
            <div className="text-xs">Team</div>
          </div>
          <div className="bg-purple-100 p-2 rounded border border-black text-center">
            <div className="text-2xl font-mono">∞</div>
            <div className="text-xs">Potential</div>
          </div>
        </div>
      </div>

      {/* Tasks Panel */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-lg z-10 w-64">
        <h2 className="text-lg font-bold mb-3">📝 Tasks</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-2 rounded border border-black ${task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {task.status === 'completed' ? '✅' : '📌'}
                </span>
                <span className="text-sm">{task.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-lg border-2 border-black shadow-lg z-10 text-center">
        <h1 className="text-2xl font-bold mb-2">Ahoy, {model.email.split('@')[0]}! ⚓</h1>
        <p className="text-gray-700">Welcome to your pixel art dashboard</p>
      </div>
    </div>
  );
}
