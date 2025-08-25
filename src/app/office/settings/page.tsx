"use client";

import { useState } from "react";
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  Building,
  Bell,
  Shield,
  Palette,
  Globe
} from "lucide-react";

type Theme = 'light' | 'dark' | 'system';

type WorkspaceSettings = {
  name: string;
  description: string;
  timezone: string;
  language: string;
  notifications: boolean;
};

const defaultWorkspaceSettings: WorkspaceSettings = {
  name: "Default Workspace",
  description: "Main workspace for all activities",
  timezone: "UTC",
  language: "English",
  notifications: true,
};

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(defaultWorkspaceSettings);
  const [activeTab, setActiveTab] = useState<'workspace' | 'appearance' | 'account' | 'notifications'>('workspace');

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('konductor-theme', newTheme);
    // Apply theme logic here
  };

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/app/actions');
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const tabs = [
    { id: 'workspace' as const, label: 'Workspace', icon: Building },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="pixel-corners--wrapper">
        <div className="pixel-corners p-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 dark:text-cyan-400 text-amber-600" />
          <div>
            <h1 className="text-3xl font-press-start dark:text-white text-stone-800">
              Settings
            </h1>
            <p className="dark:text-slate-400 text-stone-600 font-jersey text-lg mt-2">
              Manage your workspace and preferences
            </p>
          </div>
        </div>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left font-jersey transition-colors ${
                      activeTab === tab.id
                        ? 'dark:bg-cyan-500/30 dark:text-cyan-400 bg-amber-200/80 text-amber-800 border-2 dark:border-cyan-500/50 border-amber-400/60'
                        : 'dark:text-slate-300 text-stone-700 hover:dark:text-white hover:text-stone-900 hover:dark:bg-slate-700/50 hover:bg-stone-200/70'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="pixel-corners--wrapper">
            <div className="pixel-corners p-6">
            {activeTab === 'workspace' && (
              <div className="space-y-6">
                <h2 className="text-xl font-press-start dark:text-white text-stone-800 mb-4">
                  Workspace Settings
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-jersey dark:text-slate-300 text-stone-700 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={workspaceSettings.name}
                      onChange={(e) => setWorkspaceSettings({...workspaceSettings, name: e.target.value})}
                      className="w-full px-4 py-2 border-2 dark:border-slate-600 border-stone-400 dark:bg-slate-800 bg-stone-100 dark:text-white text-stone-800 font-jersey focus:outline-none focus:dark:border-cyan-400 focus:border-amber-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-jersey dark:text-slate-300 text-stone-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={workspaceSettings.description}
                      onChange={(e) => setWorkspaceSettings({...workspaceSettings, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border-2 dark:border-slate-600 border-stone-400 dark:bg-slate-800 bg-stone-100 dark:text-white text-stone-800 font-jersey focus:outline-none focus:dark:border-cyan-400 focus:border-amber-600"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-jersey dark:text-slate-300 text-stone-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={workspaceSettings.timezone}
                        onChange={(e) => setWorkspaceSettings({...workspaceSettings, timezone: e.target.value})}
                        className="w-full px-4 py-2 border-2 dark:border-slate-600 border-stone-400 dark:bg-slate-800 bg-stone-100 dark:text-white text-stone-800 font-jersey focus:outline-none focus:dark:border-cyan-400 focus:border-amber-600"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-jersey dark:text-slate-300 text-stone-700 mb-2">
                        Language
                      </label>
                      <select
                        value={workspaceSettings.language}
                        onChange={(e) => setWorkspaceSettings({...workspaceSettings, language: e.target.value})}
                        className="w-full px-4 py-2 border-2 dark:border-slate-600 border-stone-400 dark:bg-slate-800 bg-stone-100 dark:text-white text-stone-800 font-jersey focus:outline-none focus:dark:border-cyan-400 focus:border-amber-600"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Español</option>
                        <option value="French">Français</option>
                        <option value="German">Deutsch</option>
                        <option value="Japanese">日本語</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-press-start dark:text-white text-stone-800 mb-4">
                  Appearance Settings
                </h2>
                
                <div>
                  <label className="block text-sm font-jersey dark:text-slate-300 text-stone-700 mb-4">
                    Theme
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center space-x-2 px-4 py-3 border-2 transition-colors ${
                        theme === 'light'
                          ? 'dark:bg-amber-600 bg-amber-400 dark:text-white text-stone-900 dark:border-amber-500 border-amber-600'
                          : 'dark:border-slate-600 border-stone-400 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800'
                      }`}
                    >
                      <Sun className="h-5 w-5" />
                      <span className="font-jersey">Light</span>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center space-x-2 px-4 py-3 border-2 transition-colors ${
                        theme === 'dark'
                          ? 'dark:bg-cyan-600 bg-cyan-400 dark:text-white text-stone-900 dark:border-cyan-500 border-cyan-600'
                          : 'dark:border-slate-600 border-stone-400 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800'
                      }`}
                    >
                      <Moon className="h-5 w-5" />
                      <span className="font-jersey">Dark</span>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`flex items-center space-x-2 px-4 py-3 border-2 transition-colors ${
                        theme === 'system'
                          ? 'dark:bg-purple-600 bg-purple-400 dark:text-white text-stone-900 dark:border-purple-500 border-purple-600'
                          : 'dark:border-slate-600 border-stone-400 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-800'
                      }`}
                    >
                      <Monitor className="h-5 w-5" />
                      <span className="font-jersey">System</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-press-start dark:text-white text-stone-800 mb-4">
                  Account Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-2 dark:border-slate-600 border-stone-400 dark:bg-slate-800/50 bg-stone-100/50">
                    <div>
                      <h3 className="font-jersey dark:text-white text-stone-800">Account Information</h3>
                      <p className="text-sm dark:text-slate-400 text-stone-600">Konductor Admin (admin@konductor.ai)</p>
                    </div>
                    <User className="h-8 w-8 dark:text-slate-400 text-stone-600" />
                  </div>
                  
                  <div className="pt-4 border-t-2 dark:border-slate-600 border-stone-400">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-6 py-3 border-2 dark:border-red-600 border-red-500 dark:text-red-400 text-red-600 hover:dark:bg-red-500/20 hover:bg-red-100/70 transition-colors font-jersey"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-press-start dark:text-white text-stone-800 mb-4">
                  Notification Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-jersey dark:text-white text-stone-800">Enable Notifications</h3>
                      <p className="text-sm dark:text-slate-400 text-stone-600">Receive notifications for important updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.notifications}
                      onChange={(e) => setWorkspaceSettings({...workspaceSettings, notifications: e.target.checked})}
                      className="w-5 h-5 dark:bg-slate-800 bg-stone-100 border-2 dark:border-slate-600 border-stone-400"
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}