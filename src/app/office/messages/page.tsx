"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Mail,
  Phone,
  Archive,
  Star,
  MoreHorizontal,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  WifiOff
} from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelDialog } from "@/components/ui/PixelDialog";
import { PageHeader } from "@/components/ui/PageHeader";

type ConnectionStatus = {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  messageCount: number;
  lastActivity?: string;
  status: 'active' | 'inactive' | 'error';
};

type Message = {
  id: string;
  channel: 'telegram' | 'gmail' | 'whatsapp' | 'zalo' | 'slack';
  sender: string;
  subject?: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  type: 'individual' | 'group';
  topicId?: string;
};

const connections: ConnectionStatus[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💬",
    connected: true,
    messageCount: 24,
    lastActivity: "2 minutes ago",
    status: "active"
  },
  {
    id: "zalo",
    name: "Zalo",
    icon: "💙",
    connected: false,
    messageCount: 0,
    status: "inactive"
  },
  {
    id: "slack",
    name: "Slack",
    icon: "💼",
    connected: true,
    messageCount: 12,
    lastActivity: "15 minutes ago",
    status: "active"
  },
  {
    id: "email",
    name: "Email",
    icon: "📧",
    connected: true,
    messageCount: 8,
    lastActivity: "1 hour ago",
    status: "active"
  },
];

const messages: Message[] = [
  {
    id: "1",
    channel: "telegram",
    sender: "john_doe",
    preview: "Hey, can you help me with the quarterly report? I need some insights on...",
    timestamp: "2 minutes ago",
    isRead: false,
    isStarred: true,
    type: "individual",
    topicId: "TOPIC_001"
  },
  {
    id: "2",
    channel: "gmail",
    sender: "sarah@company.com",
    subject: "Meeting Reminder: Q4 Planning",
    preview: "Just a friendly reminder about our Q4 planning meeting scheduled for tomorrow at 2 PM...",
    timestamp: "15 minutes ago",
    isRead: true,
    isStarred: false,
    type: "individual",
    topicId: "TOPIC_002"
  },
  {
    id: "3",
    channel: "whatsapp",
    sender: "Marketing Team",
    preview: "Mike: The new campaign assets are ready for review. Sarah: Great! I'll check them out...",
    timestamp: "1 hour ago",
    isRead: true,
    isStarred: false,
    type: "group",
    topicId: "TOPIC_003"
  },
  {
    id: "4",
    channel: "telegram",
    sender: "emma_wilson",
    preview: "Thanks for the quick response! The document looks perfect. When can we schedule...",
    timestamp: "2 hours ago",
    isRead: false,
    isStarred: false,
    type: "individual",
    topicId: "TOPIC_004"
  },
  {
    id: "5",
    channel: "gmail",
    sender: "notifications@github.com",
    subject: "[konductor-ai] New pull request opened",
    preview: "A new pull request has been opened in the konductor-ai repository by alex_dev...",
    timestamp: "3 hours ago",
    isRead: true,
    isStarred: false,
    type: "individual",
    topicId: "TOPIC_005"
  }
];

function getChannelIcon(channel: Message['channel']) {
  switch (channel) {
    case 'telegram':
      return MessageSquare;
    case 'gmail':
      return Mail;
    case 'whatsapp':
      return Phone;
    case 'zalo':
      return MessageSquare;
    case 'slack':
      return MessageSquare;
    default:
      return MessageSquare;
  }
}

function getChannelColor(channel: Message['channel']) {
  switch (channel) {
    case 'telegram':
      return 'text-blue-400 bg-blue-400/10';
    case 'gmail':
      return 'text-red-400 bg-red-400/10';
    case 'whatsapp':
      return 'text-green-400 bg-green-400/10';
    case 'zalo':
      return 'text-purple-400 bg-purple-400/10';
    case 'slack':
      return 'text-yellow-400 bg-yellow-400/10';
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'messages'>('connections');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [selectedChannel, setSelectedChannel] = useState<'all' | Message['channel']>('all');
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionStatus | null>(null);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (message.subject && message.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !message.isRead) ||
                         (selectedFilter === 'starred' && message.isStarred);
    
    const matchesChannel = selectedChannel === 'all' || message.channel === selectedChannel;
    
    return matchesSearch && matchesFilter && matchesChannel;
  });

  const handleConnectionConfig = (connection: ConnectionStatus) => {
    setSelectedConnection(connection);
    setShowConfigDialog(true);
  };

  const renderConnectionsTab = () => (
    <div className="space-y-6">
      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {connections.map((connection) => (
          <PixelWindow 
            key={connection.id}
            title={connection.name}
            stats={`${connection.messageCount} msgs`}
            variant={connection.connected ? "primary" : "default"}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-4xl">{connection.icon}</div>
                <div className="flex items-center space-x-2">
                  {connection.connected ? (
                    <div className="flex items-center space-x-1">
                      <Wifi className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-press-start text-green-400">ONLINE</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <WifiOff className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-press-start text-red-400">OFFLINE</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-jersey dark:text-slate-400 text-stone-600">Messages:</span>
                  <span className="text-xs font-press-start dark:text-cyan-400 text-amber-600">
                    {connection.messageCount}
                  </span>
                </div>
                
                {connection.lastActivity && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-jersey dark:text-slate-400 text-stone-600">Last Activity:</span>
                    <span className="text-xs font-jersey dark:text-slate-300 text-stone-700">
                      {connection.lastActivity}
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleConnectionConfig(connection)}
                className="w-full retro-button-3d retro-border-thick p-2 font-press-start text-xs"
              >
                <Settings className="w-3 h-3 inline mr-2" />
                CONFIG
              </button>
            </div>
          </PixelWindow>
        ))}
      </div>
      
      {/* Connection Summary */}
      <PixelWindow title="Connection Summary" variant="secondary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-press-start dark:text-green-400 text-green-600 mb-2">
              {connections.filter(c => c.connected).length}
            </div>
            <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
              Active Connections
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-press-start dark:text-cyan-400 text-amber-600 mb-2">
              {connections.reduce((sum, c) => sum + c.messageCount, 0)}
            </div>
            <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
              Total Messages
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-press-start dark:text-purple-400 text-purple-600 mb-2">
              {connections.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
              Active Channels
            </div>
          </div>
        </div>
      </PixelWindow>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <PixelWindow title="Total" stats={`${messages.length}`}>
          <div className="flex items-center justify-center">
            <MessageSquare className="h-8 w-8 dark:text-cyan-400 text-amber-600" />
          </div>
        </PixelWindow>
        
        <PixelWindow title="Unread" stats={`${messages.filter(m => !m.isRead).length}`}>
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-red-400 rounded-full"></div>
          </div>
        </PixelWindow>
        
        <PixelWindow title="Starred" stats={`${messages.filter(m => m.isStarred).length}`}>
          <div className="flex items-center justify-center">
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
        </PixelWindow>
        
        <PixelWindow title="Channels" stats={`${new Set(messages.map(m => m.channel)).size}`}>
          <div className="flex items-center justify-center">
            <Filter className="h-8 w-8 dark:text-purple-400 text-purple-600" />
          </div>
        </PixelWindow>
      </div>

      {/* Filters and Search */}
      <PixelWindow title="Filters & Search">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 dark:text-slate-400 text-stone-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 retro-border-thick dark:bg-slate-800 bg-stone-200 dark:text-white text-stone-900 placeholder-slate-400 font-jersey"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {(['all', 'unread', 'starred'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 retro-border-thick font-press-start text-xs transition-colors ${
                  selectedFilter === filter
                    ? 'dark:bg-cyan-500 bg-amber-500 dark:text-white text-white'
                    : 'dark:bg-slate-700 bg-stone-300 dark:text-slate-300 text-stone-700 hover:dark:bg-slate-600 hover:bg-stone-400'
                }`}
              >
                {filter.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value as typeof selectedChannel)}
            className="px-4 py-2 retro-border-thick dark:bg-slate-700 bg-stone-300 dark:text-white text-stone-900 font-jersey"
          >
            <option value="all">All Channels</option>
            <option value="telegram">Telegram</option>
            <option value="gmail">Gmail</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="zalo">Zalo</option>
            <option value="slack">Slack</option>
          </select>
        </div>
      </PixelWindow>

      {/* Messages Data Table */}
      <PixelWindow title={`Messages (${filteredMessages.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="retro-border-thick border-b dark:border-slate-600 border-stone-400">
                <th className="text-left p-3 font-press-start text-xs dark:text-cyan-400 text-amber-600">CHANNEL</th>
                <th className="text-left p-3 font-press-start text-xs dark:text-cyan-400 text-amber-600">SENDER</th>
                <th className="text-left p-3 font-press-start text-xs dark:text-cyan-400 text-amber-600">TOPIC ID</th>
                <th className="text-left p-3 font-press-start text-xs dark:text-cyan-400 text-amber-600">PREVIEW</th>
                <th className="text-left p-3 font-press-start text-xs dark:text-cyan-400 text-amber-600">TIMESTAMP</th>
                <th className="text-left p-3 font-press-start text-xs dark:text-cyan-400 text-amber-600">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 dark:text-slate-400 text-stone-500 mx-auto mb-4" />
                    <p className="dark:text-slate-400 text-stone-500 font-jersey">No messages found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message) => {
                  const Icon = getChannelIcon(message.channel);
                  const channelColor = getChannelColor(message.channel);
                  
                  return (
                    <tr key={message.id} className={`retro-border-thick border-b dark:border-slate-700 border-stone-300 hover:dark:bg-slate-800 hover:bg-stone-100 transition-colors ${
                      !message.isRead ? 'dark:bg-cyan-500/5 bg-amber-500/5' : ''
                    }`}>
                      <td className="p-3">
                        <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded ${channelColor}`}>
                          <Icon className="h-3 w-3" />
                          <span className="font-press-start text-xs">{message.channel.toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`font-jersey text-sm ${
                          !message.isRead ? 'dark:text-white text-stone-900 font-semibold' : 'dark:text-slate-300 text-stone-700'
                        }`}>
                          {message.sender}
                        </span>
                        {message.type === 'group' && (
                          <span className="ml-2 px-1 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded font-press-start">
                            GRP
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-press-start text-xs dark:text-purple-400 text-purple-600">
                          {message.topicId || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs">
                        {message.subject && (
                          <p className={`font-jersey text-sm mb-1 ${
                            !message.isRead ? 'dark:text-white text-stone-900 font-semibold' : 'dark:text-slate-300 text-stone-700'
                          }`}>
                            {message.subject}
                          </p>
                        )}
                        <p className="dark:text-slate-400 text-stone-500 text-sm font-jersey truncate">
                          {message.preview}
                        </p>
                      </td>
                      <td className="p-3">
                        <span className="dark:text-slate-500 text-stone-500 text-xs font-jersey whitespace-nowrap">
                          {message.timestamp}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          )}
                          {message.isStarred && (
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          )}
                          <button className="p-1 dark:text-slate-400 text-stone-500 hover:dark:text-white hover:text-stone-900 transition-colors">
                            <MoreHorizontal className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </PixelWindow>
    </div>
  );

  return (
    <div>
      <PageHeader 
        title="Messages"
        subtitle="Communication Hub"
        breadcrumbs={[{ label: 'Messages' }]}
        actions={
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2 px-2 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
                <span className="font-jersey dark:text-slate-300 text-stone-700">{messages.length} Messages</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
                <span className="font-jersey dark:text-blue-300 text-blue-700">{connections.filter(c => c.connected).length} Connected</span>
              </div>
            </div>
          </div>
        }
      />
      
      <div className="retro-theme retro-high-contrast p-4 space-y-4 pt-2 min-h-screen">

      {/* Tab Navigation */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-6 py-3 retro-border-thick font-press-start text-sm transition-colors ${
            activeTab === 'connections'
              ? 'dark:bg-cyan-500 bg-amber-500 dark:text-white text-white'
              : 'dark:bg-slate-700 bg-stone-300 dark:text-slate-300 text-stone-700 hover:dark:bg-slate-600 hover:bg-stone-400'
          }`}
        >
          CONNECTIONS
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 retro-border-thick font-press-start text-sm transition-colors ${
            activeTab === 'messages'
              ? 'dark:bg-cyan-500 bg-amber-500 dark:text-white text-white'
              : 'dark:bg-slate-700 bg-stone-300 dark:text-slate-300 text-stone-700 hover:dark:bg-slate-600 hover:bg-stone-400'
          }`}
        >
          MESSAGES
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'connections' ? renderConnectionsTab() : renderMessagesTab()}

      {/* Configuration Dialog */}
      <PixelDialog
        isOpen={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        title={selectedConnection ? `Configure ${selectedConnection.name}` : 'Configure Connection'}
        size="md"
      >
        {selectedConnection && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedConnection.icon}</div>
              <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
                {selectedConnection.name}
              </h3>
              <p className="font-jersey dark:text-slate-300 text-stone-700">
                Configure your {selectedConnection.name} connection settings.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 retro-border-thick dark:bg-slate-800 bg-stone-200">
                <span className="font-jersey dark:text-slate-300 text-stone-700">Status:</span>
                <span className={`font-press-start text-xs ${
                  selectedConnection.connected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedConnection.connected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 retro-border-thick dark:bg-slate-800 bg-stone-200">
                <span className="font-jersey dark:text-slate-300 text-stone-700">Messages:</span>
                <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">
                  {selectedConnection.messageCount}
                </span>
              </div>
              
              {selectedConnection.lastActivity && (
                <div className="flex justify-between items-center p-4 retro-border-thick dark:bg-slate-800 bg-stone-200">
                  <span className="font-jersey dark:text-slate-300 text-stone-700">Last Activity:</span>
                  <span className="font-jersey dark:text-slate-300 text-stone-700">
                    {selectedConnection.lastActivity}
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <button className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm">
                {selectedConnection.connected ? 'RECONNECT' : 'CONNECT'}
              </button>
              
              <button className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm">
                TEST CONNECTION
              </button>
              
              {selectedConnection.connected && (
                <button className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm text-red-400">
                  DISCONNECT
                </button>
              )}
            </div>
          </div>
        )}
      </PixelDialog>
      </div>
    </div>
  );
}