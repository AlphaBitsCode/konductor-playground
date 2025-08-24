"use client";

import { useState } from "react";
import {
  Plus,
  MessageSquare,
  Mail,
  Phone,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

type Channel = {
  id: string;
  name: string;
  type: 'telegram' | 'gmail' | 'whatsapp' | 'zalo' | 'slack';
  status: 'connected' | 'disconnected' | 'pending';
  description: string;
  lastSync?: string;
  messageCount?: number;
};

const channels: Channel[] = [
  {
    id: "1",
    name: "Telegram Bot",
    type: "telegram",
    status: "connected",
    description: "@konductor_ai_bot - Personal AI Assistant",
    lastSync: "2 minutes ago",
    messageCount: 1247
  },
  {
    id: "2",
    name: "Gmail Integration",
    type: "gmail",
    status: "disconnected",
    description: "Read/send emails and manage calendar events",
    messageCount: 0
  },
  {
    id: "3",
    name: "WhatsApp Business",
    type: "whatsapp",
    status: "pending",
    description: "Connect via QR code for personal and group messages",
    messageCount: 0
  },
  {
    id: "4",
    name: "Zalo Official Account",
    type: "zalo",
    status: "disconnected",
    description: "Vietnamese messaging platform integration",
    messageCount: 0
  },
  {
    id: "5",
    name: "Slack Workspace",
    type: "slack",
    status: "disconnected",
    description: "Team communication and collaboration",
    messageCount: 0
  }
];

function getChannelIcon(type: Channel['type']) {
  switch (type) {
    case 'telegram':
      return MessageSquare;
    case 'gmail':
      return Mail;
    case 'whatsapp':
      return Phone;
    case 'zalo':
      return Zap;
    case 'slack':
      return MessageSquare;
    default:
      return MessageSquare;
  }
}

function getStatusColor(status: Channel['status']) {
  switch (status) {
    case 'connected':
      return 'text-green-400 bg-green-400/10 border-green-400/30';
    case 'disconnected':
      return 'text-red-400 bg-red-400/10 border-red-400/30';
    case 'pending':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
  }
}

function getStatusIcon(status: Channel['status']) {
  switch (status) {
    case 'connected':
      return CheckCircle;
    case 'disconnected':
      return AlertCircle;
    case 'pending':
      return Clock;
    default:
      return AlertCircle;
  }
}

export default function ChannelsPage() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const handleConnect = (channelId: string) => {
    console.log('Connecting channel:', channelId);
    // TODO: Implement actual connection logic
  };

  const handleDisconnect = (channelId: string) => {
    console.log('Disconnecting channel:', channelId);
    // TODO: Implement actual disconnection logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Press_Start_2P'] text-2xl text-white mb-2">
            Communication Channels
          </h1>
          <p className="text-slate-300">
            Connect and manage your communication platforms to centralize all interactions.
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Connected Channels</p>
              <p className="text-2xl font-bold text-white mt-1">
                {channels.filter(c => c.status === 'connected').length}
              </p>
            </div>
            <div className="p-3 bg-green-400/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Messages</p>
              <p className="text-2xl font-bold text-white mt-1">
                {channels.reduce((sum, c) => sum + (c.messageCount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-cyan-400/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Pending Setup</p>
              <p className="text-2xl font-bold text-white mt-1">
                {channels.filter(c => c.status !== 'connected').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Channels List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Available Channels</h2>
          <p className="text-slate-400 mt-1">Connect your communication platforms to get started.</p>
        </div>
        
        <div className="divide-y divide-white/10">
          {channels.map((channel) => {
            const Icon = getChannelIcon(channel.type);
            const StatusIcon = getStatusIcon(channel.status);
            const statusColor = getStatusColor(channel.status);
            
            return (
              <div key={channel.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
                      <p className="text-slate-400 text-sm">{channel.description}</p>
                      {channel.lastSync && (
                        <p className="text-slate-500 text-xs mt-1">Last sync: {channel.lastSync}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Status Badge */}
                    <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-medium ${statusColor}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                    </div>
                    
                    {/* Message Count */}
                    {channel.messageCount !== undefined && channel.messageCount > 0 && (
                      <div className="text-slate-400 text-sm">
                        {channel.messageCount.toLocaleString()} messages
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {channel.status === 'connected' ? (
                        <>
                          <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <Settings className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDisconnect(channel.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleConnect(channel.id)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg text-sm transition-all duration-200"
                        >
                          {channel.status === 'pending' ? 'Complete Setup' : 'Connect'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}