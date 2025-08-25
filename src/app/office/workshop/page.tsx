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
  MoreHorizontal,
  Grid3X3,
  List,
  Filter,
  Eye,
  EyeOff
} from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelDialog } from "@/components/ui/PixelDialog";
import { PageHeader } from "@/components/ui/PageHeader";

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
      return 'dark:text-cyan-400 text-amber-600 dark:bg-cyan-400/10 bg-amber-600/10';
    case 'Writer':
      return 'dark:text-green-400 text-green-600 dark:bg-green-400/10 bg-green-600/10';
    case 'Analyst':
      return 'dark:text-purple-400 text-purple-600 dark:bg-purple-400/10 bg-purple-600/10';
    case 'Comedian':
      return 'dark:text-yellow-400 text-yellow-600 dark:bg-yellow-400/10 bg-yellow-600/10';
    case 'Researcher':
      return 'dark:text-cyan-400 text-cyan-600 dark:bg-cyan-400/10 bg-cyan-600/10';
    case 'Translator':
      return 'dark:text-pink-400 text-pink-600 dark:bg-pink-400/10 bg-pink-600/10';
    default:
      return 'dark:text-slate-400 text-stone-600 dark:bg-slate-400/10 bg-stone-600/10';
  }
}

export default function WorkshopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<'all' | MinionTitle>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMinion, setSelectedMinion] = useState<Minion | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

  const renderGridView = () => (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMinions.map((minion) => {
        const titleColor = getTitleColor(minion.title);
        
        return (
          <div key={minion.id} className={`retro-border-thick dark:bg-slate-800/50 bg-stone-200/50 p-6 transition-all hover:dark:bg-slate-700/50 hover:bg-stone-300/50 ${
            !minion.isActive ? 'opacity-60' : ''
          }`}>
            {/* Avatar and Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{minion.avatar || '🤖'}</div>
                <div>
                  <h3 className="font-press-start text-sm dark:text-white text-stone-900">{minion.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-jersey rounded-full ${titleColor}`}>
                    {minion.customTitle || minion.title}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {minion.isActive ? (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 dark:bg-slate-400 bg-stone-600 rounded-full"></div>
                )}
                <button 
                  onClick={() => {
                    setSelectedMinion(minion);
                    setShowConfigDialog(true);
                  }}
                  className="p-1 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-900 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Persona */}
            <p className="font-jersey dark:text-slate-300 text-stone-700 text-sm mb-4 line-clamp-3">
              {minion.persona}
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm dark:text-slate-400 text-stone-600 mb-4">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="font-jersey">{minion.conversationCount} chats</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span className="font-jersey">{minion.documentAccess.length === 1 && minion.documentAccess[0] === 'all' ? 'All docs' : `${minion.documentAccess.length} docs`}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setSelectedMinion(minion);
                  setShowConfigDialog(true);
                }}
                className="flex-1 retro-button-3d retro-border-thick p-2 font-press-start text-xs dark:text-cyan-400 text-amber-600"
              >
                EDIT
              </button>
              <button className="retro-button-3d retro-border-thick p-2 dark:text-slate-400 text-stone-600">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="p-6">
      <div className="space-y-4">
        {filteredMinions.map((minion) => {
          const titleColor = getTitleColor(minion.title);
          
          return (
            <div key={minion.id} className={`retro-border-thick dark:bg-slate-800/50 bg-stone-200/50 p-4 transition-all hover:dark:bg-slate-700/50 hover:bg-stone-300/50 ${
              !minion.isActive ? 'opacity-60' : ''
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{minion.avatar || '🤖'}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-press-start text-sm dark:text-white text-stone-900">{minion.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-jersey rounded-full ${titleColor}`}>
                        {minion.customTitle || minion.title}
                      </span>
                      {minion.isActive ? (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 dark:bg-slate-400 bg-stone-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="font-jersey dark:text-slate-300 text-stone-700 text-sm mb-2">
                      {minion.persona}
                    </p>
                    <div className="flex items-center space-x-4 text-xs dark:text-slate-400 text-stone-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span className="font-jersey">{minion.conversationCount} chats</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span className="font-jersey">{minion.documentAccess.length === 1 && minion.documentAccess[0] === 'all' ? 'All docs' : `${minion.documentAccess.length} docs`}</span>
                      </div>
                      <span className="font-jersey">Last used: {minion.lastUsed}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedMinion(minion);
                      setShowConfigDialog(true);
                    }}
                    className="retro-button-3d retro-border-thick p-2 font-press-start text-xs dark:text-cyan-400 text-amber-600"
                  >
                    EDIT
                  </button>
                  <button className="retro-button-3d retro-border-thick p-2 dark:text-slate-400 text-stone-600">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-1 dark:text-slate-400 text-stone-600 hover:dark:text-white hover:text-stone-900 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="page-content-with-sticky-header h-full flex flex-col">
      <PageHeader 
         title="Workshop"
         subtitle="Manage AI Minions"
         breadcrumbs={[{ label: 'Workshop' }]}
         actions={
           <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-4 text-xs">
               <div className="flex items-center space-x-2 px-2 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
                 <span className="font-jersey dark:text-slate-300 text-stone-700">{filteredMinions.length} Total</span>
               </div>
               <div className="flex items-center space-x-2 px-2 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
                 <span className="font-jersey dark:text-green-300 text-green-700">{filteredMinions.filter(m => m.isActive).length} Active</span>
               </div>
             </div>
             <button
               onClick={() => setShowCreateDialog(true)}
               className="retro-button-3d retro-border-thick px-3 py-2 font-press-start text-xs dark:text-green-400 text-green-600 flex items-center space-x-2"
             >
               <Plus className="h-3 w-3" />
               <span>CREATE</span>
             </button>
           </div>
         }
       />
      
        {/* Compact Controls */}
        <div className="retro-border-thick dark:bg-slate-900/50 bg-stone-100/50 p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 dark:text-slate-400 text-stone-600" />
                <input
                  type="text"
                  placeholder="Search minions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="retro-border-thick dark:bg-slate-800 bg-stone-200 dark:text-white text-stone-900 pl-10 pr-4 py-2 font-jersey text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              
              {/* Title Filter */}
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value as 'all' | MinionTitle)}
                className="retro-border-thick dark:bg-slate-800 bg-stone-200 dark:text-white text-stone-900 px-3 py-2 font-jersey text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`retro-border-thick p-2 font-jersey text-sm flex items-center space-x-2 transition-colors ${
                  showInactive 
                    ? 'dark:bg-cyan-400/20 bg-amber-600/20 dark:text-cyan-400 text-amber-600' 
                    : 'dark:bg-slate-800 bg-stone-200 dark:text-slate-400 text-stone-600'
                }`}
              >
                {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>Show Inactive</span>
              </button>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`retro-border-thick p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'dark:bg-cyan-400/20 bg-amber-600/20 dark:text-cyan-400 text-amber-600' 
                    : 'dark:bg-slate-800 bg-stone-200 dark:text-slate-400 text-stone-600'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`retro-border-thick p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'dark:bg-cyan-400/20 bg-amber-600/20 dark:text-cyan-400 text-amber-600' 
                    : 'dark:bg-slate-800 bg-stone-200 dark:text-slate-400 text-stone-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {filteredMinions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <Bot className="h-16 w-16 dark:text-slate-400 text-stone-600 mb-4" />
              <h3 className="font-press-start text-lg dark:text-slate-400 text-stone-600 mb-2">NO MINIONS FOUND</h3>
              <p className="font-jersey dark:text-slate-500 text-stone-500 text-center max-w-md">
                {searchQuery || selectedTitle !== 'all' || !showInactive 
                  ? "Try adjusting your search or filters to find minions."
                  : "Create your first AI minion to get started with the workshop."}
              </p>
              {!searchQuery && selectedTitle === 'all' && showInactive && (
                <button 
                  onClick={() => setShowCreateDialog(true)}
                  className="retro-button-3d retro-border-thick p-3 font-press-start text-sm dark:text-green-400 text-green-600 flex items-center space-x-2 mt-4"
                >
                  <Plus className="h-4 w-4" />
                  <span>CREATE FIRST MINION</span>
                </button>
              )}
            </div>
          ) : (
            viewMode === 'grid' ? renderGridView() : renderListView()
          )}
        </div>
    </div>
  );
}