"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Bot,
  Edit3,
  Trash2,
  Settings,
  FileText,
  Star,
  Users,
  Brain,
  Zap,
  MoreHorizontal
} from "lucide-react";

type MinionTitle = 'Assistant' | 'Writer' | 'Analyst' | 'Comedian' | 'Researcher' | 'Translator' | 'Custom';

type Minion = {
  id: string;
  name: string;
  title: MinionTitle;
  persona: string;
  backstory: string;
  documentAccess: string[];
  isActive: boolean;
  conversationCount: number;
  lastUsed: string;
  avatar?: string;
  customTitle?: string;
};

const minions: Minion[] = [
  {
    id: "1",
    name: "Alita",
    title: "Assistant",
    persona: "A helpful and professional AI assistant who excels at organizing tasks, scheduling, and providing clear, actionable advice. Always maintains a positive and supportive tone.",
    backstory: "Alita was designed to be the perfect digital companion for busy professionals. With years of experience in task management and communication, she understands the importance of efficiency and clarity.",
    documentAccess: ["all"],
    isActive: true,
    conversationCount: 1247,
    lastUsed: "2024-01-15 14:30",
    avatar: "🤖"
  },
  {
    id: "2",
    name: "Tim",
    title: "Writer",
    persona: "A creative and articulate writer who specializes in crafting compelling content, from technical documentation to marketing copy. Has a knack for adapting writing style to different audiences.",
    backstory: "Tim started as a technical writer but evolved into a versatile content creator. He's passionate about storytelling and believes that every piece of writing should engage and inform the reader.",
    documentAccess: ["marketing-docs", "style-guide", "brand-guidelines"],
    isActive: true,
    conversationCount: 892,
    lastUsed: "2024-01-15 11:20",
    avatar: "✍️"
  },
  {
    id: "3",
    name: "DataBot",
    title: "Analyst",
    persona: "A meticulous data analyst who loves diving deep into numbers and trends. Provides clear insights and actionable recommendations based on data analysis. Always backs up claims with evidence.",
    backstory: "DataBot was created to make sense of complex datasets and translate them into business insights. With a background in statistics and machine learning, it excels at pattern recognition.",
    documentAccess: ["financial-reports", "analytics-data", "market-research"],
    isActive: true,
    conversationCount: 456,
    lastUsed: "2024-01-14 16:45",
    avatar: "📊"
  },
  {
    id: "4",
    name: "Jester",
    title: "Comedian",
    persona: "A witty and entertaining AI who brings humor to any conversation while still being helpful. Knows when to be serious and when to lighten the mood with appropriate jokes.",
    backstory: "Jester believes that laughter is the best medicine, even in professional settings. With a vast repertoire of jokes and a keen sense of timing, it helps teams stay motivated and engaged.",
    documentAccess: ["team-guidelines", "company-culture"],
    isActive: false,
    conversationCount: 234,
    lastUsed: "2024-01-12 09:15",
    avatar: "🎭"
  },
  {
    id: "5",
    name: "Scholar",
    title: "Researcher",
    persona: "A thorough and methodical researcher who excels at finding accurate information, conducting literature reviews, and synthesizing complex topics into digestible summaries.",
    backstory: "Scholar has access to vast knowledge bases and is trained to verify information from multiple sources. It takes pride in providing well-researched, factual, and comprehensive answers.",
    documentAccess: ["research-papers", "knowledge-base", "reference-materials"],
    isActive: true,
    conversationCount: 678,
    lastUsed: "2024-01-13 13:22",
    avatar: "🎓"
  }
];

const titleTemplates = {
  Assistant: "A helpful and professional AI assistant who excels at organizing tasks, scheduling, and providing clear, actionable advice.",
  Writer: "A creative and articulate writer who specializes in crafting compelling content for various audiences and purposes.",
  Analyst: "A meticulous data analyst who loves diving deep into numbers and trends to provide clear insights and recommendations.",
  Comedian: "A witty and entertaining AI who brings appropriate humor to conversations while maintaining helpfulness.",
  Researcher: "A thorough and methodical researcher who excels at finding accurate information and synthesizing complex topics.",
  Translator: "A skilled linguist who provides accurate translations and cultural context across multiple languages.",
  Custom: "Define your own unique AI personality and capabilities."
};

function getTitleColor(title: MinionTitle) {
  switch (title) {
    case 'Assistant':
      return 'text-blue-400 bg-blue-400/10';
    case 'Writer':
      return 'text-green-400 bg-green-400/10';
    case 'Analyst':
      return 'text-purple-400 bg-purple-400/10';
    case 'Comedian':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'Researcher':
      return 'text-cyan-400 bg-cyan-400/10';
    case 'Translator':
      return 'text-pink-400 bg-pink-400/10';
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

export default function WorkshopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<'all' | MinionTitle>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMinions = minions.filter(minion => {
    const matchesSearch = minion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         minion.persona.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         minion.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTitle = selectedTitle === 'all' || minion.title === selectedTitle;
    const matchesActive = showInactive || minion.isActive;
    
    return matchesSearch && matchesTitle && matchesActive;
  });

  const minionStats = {
    total: minions.length,
    active: minions.filter(m => m.isActive).length,
    totalConversations: minions.reduce((sum, m) => sum + m.conversationCount, 0),
    avgConversations: Math.round(minions.reduce((sum, m) => sum + m.conversationCount, 0) / minions.length)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Press_Start_2P'] text-2xl text-white mb-2">
            Minion Workshop
          </h1>
          <p className="text-slate-300">
            Create and manage your specialized AI Minions with unique personalities and capabilities.
          </p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors mt-4 sm:mt-0">
          <Plus className="h-4 w-4" />
          <span>Craft New Minion</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Minions</p>
              <p className="text-2xl font-bold text-white mt-1">{minionStats.total}</p>
            </div>
            <Bot className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-white mt-1">{minionStats.active}</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Chats</p>
              <p className="text-2xl font-bold text-white mt-1">{minionStats.totalConversations.toLocaleString()}</p>
            </div>
            <Users className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Avg per Minion</p>
              <p className="text-2xl font-bold text-white mt-1">{minionStats.avgConversations}</p>
            </div>
            <Brain className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search minions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
          
          {/* Title Filter */}
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value as typeof selectedTitle)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Titles</option>
            <option value="Assistant">Assistant</option>
            <option value="Writer">Writer</option>
            <option value="Analyst">Analyst</option>
            <option value="Comedian">Comedian</option>
            <option value="Researcher">Researcher</option>
            <option value="Translator">Translator</option>
            <option value="Custom">Custom</option>
          </select>
          
          {/* Show Inactive Toggle */}
          <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-400"
            />
            <span className="text-white text-sm">Show Inactive</span>
          </label>
          
          {/* View Mode Toggle */}
          <div className="flex space-x-2">
            {(['grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Minions Display */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Your Minions ({filteredMinions.length})</h2>
        </div>
        
        {filteredMinions.length === 0 ? (
          <div className="p-12 text-center">
            <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No minions found matching your criteria.</p>
            <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors mx-auto">
              <Plus className="h-4 w-4" />
              <span>Create Your First Minion</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMinions.map((minion) => {
              const titleColor = getTitleColor(minion.title);
              
              return (
                <div key={minion.id} className={`bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all ${
                  !minion.isActive ? 'opacity-60' : ''
                }`}>
                  {/* Avatar and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{minion.avatar || '🤖'}</div>
                      <div>
                        <h3 className="font-bold text-white">{minion.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${titleColor}`}>
                          {minion.customTitle || minion.title}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {minion.isActive ? (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      )}
                      <button className="p-1 text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Persona */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    {minion.persona}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{minion.conversationCount} chats</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{minion.documentAccess.length === 1 && minion.documentAccess[0] === 'all' ? 'All docs' : `${minion.documentAccess.length} docs`}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-white/10 text-slate-400 rounded-lg hover:bg-white/20 hover:text-white transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          }
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredMinions.map((minion) => {
              const titleColor = getTitleColor(minion.title);
              
              return (
                <div key={minion.id} className={`p-6 hover:bg-white/5 transition-colors ${
                  !minion.isActive ? 'opacity-60' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-2xl">{minion.avatar || '🤖'}</div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-white">{minion.name}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${titleColor}`}>
                            {minion.customTitle || minion.title}
                          </span>
                          {minion.isActive ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-green-400 text-xs">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                              <span className="text-slate-400 text-xs">Inactive</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                          {minion.persona}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{minion.conversationCount} conversations</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{minion.documentAccess.length === 1 && minion.documentAccess[0] === 'all' ? 'All documents' : `${minion.documentAccess.length} documents`}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-4 w-4" />
                            <span>Last used {minion.lastUsed}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          }
          </div>
        )}
      </div>
    </div>
  );
}