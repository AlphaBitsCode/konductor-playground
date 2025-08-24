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
  MoreHorizontal
} from "lucide-react";

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
};

const messages: Message[] = [
  {
    id: "1",
    channel: "telegram",
    sender: "john_doe",
    preview: "Hey, can you help me with the quarterly report? I need some insights on...",
    timestamp: "2 minutes ago",
    isRead: false,
    isStarred: true,
    type: "individual"
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
    type: "individual"
  },
  {
    id: "3",
    channel: "whatsapp",
    sender: "Marketing Team",
    preview: "Mike: The new campaign assets are ready for review. Sarah: Great! I'll check them out...",
    timestamp: "1 hour ago",
    isRead: true,
    isStarred: false,
    type: "group"
  },
  {
    id: "4",
    channel: "telegram",
    sender: "emma_wilson",
    preview: "Thanks for the quick response! The document looks perfect. When can we schedule...",
    timestamp: "2 hours ago",
    isRead: false,
    isStarred: false,
    type: "individual"
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
    type: "individual"
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [selectedChannel, setSelectedChannel] = useState<'all' | Message['channel']>('all');

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Press_Start_2P'] text-2xl text-white mb-2">
            Message Threads
          </h1>
          <p className="text-slate-300">
            View and manage all incoming messages from your connected channels.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Messages</p>
              <p className="text-2xl font-bold text-white mt-1">{messages.length}</p>
            </div>
            <MessageSquare className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Unread</p>
              <p className="text-2xl font-bold text-white mt-1">
                {messages.filter(m => !m.isRead).length}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Starred</p>
              <p className="text-2xl font-bold text-white mt-1">
                {messages.filter(m => m.isStarred).length}
              </p>
            </div>
            <Star className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Channels</p>
              <p className="text-2xl font-bold text-white mt-1">
                {new Set(messages.map(m => m.channel)).size}
              </p>
            </div>
            <Filter className="h-6 w-6 text-purple-400" />
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
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {(['all', 'unread', 'starred'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value as typeof selectedChannel)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Channels</option>
            <option value="telegram">Telegram</option>
            <option value="gmail">Gmail</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="zalo">Zalo</option>
            <option value="slack">Slack</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Messages ({filteredMessages.length})</h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No messages found matching your criteria.</p>
            </div>
          ) : (
            filteredMessages.map((message) => {
              const Icon = getChannelIcon(message.channel);
              const channelColor = getChannelColor(message.channel);
              
              return (
                <div key={message.id} className={`p-6 hover:bg-white/5 transition-colors cursor-pointer ${
                  !message.isRead ? 'bg-cyan-500/5 border-l-4 border-l-cyan-400' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Channel Icon */}
                      <div className={`p-2 rounded-lg ${channelColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-semibold ${
                            !message.isRead ? 'text-white' : 'text-slate-300'
                          }`}>
                            {message.sender}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {message.channel}
                          </span>
                          {message.type === 'group' && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                              Group
                            </span>
                          )}
                        </div>
                        
                        {message.subject && (
                          <p className={`font-medium mb-1 ${
                            !message.isRead ? 'text-white' : 'text-slate-300'
                          }`}>
                            {message.subject}
                          </p>
                        )}
                        
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {message.preview}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-slate-500 text-xs whitespace-nowrap">
                        {message.timestamp}
                      </span>
                      
                      {message.isStarred && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                      
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