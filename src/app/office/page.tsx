"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MessageCircle,
  Mail,
  Calendar,
  CheckSquare,
  Clock,
  ArrowRight,
  ArrowDown,
  Settings,
  Copy,
  Check,
  QrCode,
  Smartphone
} from "lucide-react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelDialog } from "@/components/ui/PixelDialog";
import { PageHeader } from "@/components/ui/PageHeader";

type CommunicationChannel = {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  color: string;
  connectedInfo?: string;
};

const communicationChannels: CommunicationChannel[] = [
  { id: "whatsapp", name: "WhatsApp", icon: "💬", connected: false, color: "text-green-500" },
  { id: "zalo", name: "Zalo", icon: "💙", connected: false, color: "text-blue-500" },
  { id: "slack", name: "Slack", icon: "💼", connected: false, color: "text-purple-500" },
  { id: "email", name: "Email", icon: "📧", connected: false, color: "text-red-500" },
];

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
};

const todoItems: TodoItem[] = [
  { id: "1", title: "Review marketing proposals", completed: false, priority: "high" },
  { id: "2", title: "Schedule team meeting", completed: false, priority: "medium" },
  { id: "3", title: "Update project documentation", completed: true, priority: "low" },
];

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  date: string;
};

const upcomingEvents: CalendarEvent[] = [
  { id: "1", title: "Team Standup", time: "09:00", date: "Today" },
  { id: "2", title: "Client Presentation", time: "14:30", date: "Today" },
  { id: "3", title: "Project Review", time: "10:00", date: "Tomorrow" },
];

type ConnectionStep = 'initial' | 'qr' | 'connecting' | 'connected';

export default function OfficeDashboard() {
  const [showChannelDialog, setShowChannelDialog] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel | null>(null);
  const [channels, setChannels] = useState(communicationChannels);
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>('initial');
  const [copiedText, setCopiedText] = useState('');
  const [username] = useState('johndoe'); // This would come from user context

  const completedTodos = todoItems.filter(item => item.completed).length;
  const totalTodos = todoItems.length;
  const connectedChannels = channels.filter(ch => ch.connected).length;
  const totalChannels = channels.length;

  const handleChannelClick = (channel: CommunicationChannel) => {
    setSelectedChannel(channel);
    setConnectionStep('initial');
    setShowChannelDialog(true);
  };

  const handleConnect = () => {
    if (!selectedChannel) return;
    
    if (selectedChannel.id === 'whatsapp' || selectedChannel.id === 'zalo') {
      setConnectionStep('qr');
    } else if (selectedChannel.id === 'email') {
      setConnectionStep('connected');
    } else if (selectedChannel.id === 'slack') {
      setConnectionStep('connected');
    }
  };

  const handleQRClick = () => {
    setConnectionStep('connecting');
    setTimeout(() => {
      setConnectionStep('connected');
      // Update the channel as connected
      setChannels(prev => prev.map(ch => 
        ch.id === selectedChannel?.id 
          ? { 
              ...ch, 
              connected: true, 
              connectedInfo: selectedChannel.id === 'whatsapp' ? '+84111222333' : 'Connected'
            }
          : ch
      ));
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleClose = () => {
    setShowChannelDialog(false);
    setConnectionStep('initial');
  };

  const renderConnectionContent = () => {
    if (!selectedChannel) return null;

    // WhatsApp Flow
    if (selectedChannel.id === 'whatsapp') {
      switch (connectionStep) {
        case 'initial':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedChannel.icon}</div>
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
                  Connect WhatsApp
                </h3>
                <p className="font-jersey dark:text-slate-300 text-stone-700">
                  Follow these steps to connect your WhatsApp:
                </p>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">1.</span>
                  <span className="font-jersey dark:text-slate-300 text-stone-700">
                    Open WhatsApp on your phone
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">2.</span>
                  <span className="font-jersey dark:text-slate-300 text-stone-700">
                    Go to Settings → Linked Devices
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">3.</span>
                  <span className="font-jersey dark:text-slate-300 text-stone-700">
                    Tap "Link a Device" and scan the QR code
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleConnect}
                className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm"
              >
                SHOW QR CODE
              </button>
            </div>
          );
        
        case 'qr':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-4">
                  Scan QR Code
                </h3>
                <div 
                  className="w-48 h-48 mx-auto retro-border-thick dark:bg-white bg-gray-100 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={handleQRClick}
                >
                  <QrCode className="w-32 h-32 text-black" />
                </div>
                <p className="font-jersey dark:text-slate-300 text-stone-700 mt-4">
                  Click on QR code to simulate scanning
                </p>
              </div>
            </div>
          );
        
        case 'connecting':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
                  Connecting...
                </h3>
                <p className="font-jersey dark:text-slate-300 text-stone-700">
                  Please wait while we establish the connection
                </p>
              </div>
            </div>
          );
        
        case 'connected':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
                  Connected!
                </h3>
                <p className="font-jersey dark:text-slate-300 text-stone-700 mb-4">
                  WhatsApp number: <span className="font-press-start text-xs dark:text-green-400 text-green-600">+84111222333</span>
                </p>
                <p className="font-jersey dark:text-slate-300 text-stone-700">
                  Listening for incoming messages...
                </p>
              </div>
              
              <button 
                onClick={handleClose}
                className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm"
              >
                CLOSE
              </button>
            </div>
          );
      }
    }

    // Zalo Flow
    if (selectedChannel.id === 'zalo') {
      switch (connectionStep) {
        case 'initial':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedChannel.icon}</div>
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
                  Connect Zalo
                </h3>
                <p className="font-jersey dark:text-slate-300 text-stone-700">
                  Follow these steps to connect your Zalo:
                </p>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">1.</span>
                  <span className="font-jersey dark:text-slate-300 text-stone-700">
                    Open Zalo on your phone
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">2.</span>
                  <span className="font-jersey dark:text-slate-300 text-stone-700">
                    Go to Personal → QR Code Scanner
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">3.</span>
                  <span className="font-jersey dark:text-slate-300 text-stone-700">
                    Scan the QR code to link your account
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleConnect}
                className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm"
              >
                SHOW QR CODE
              </button>
            </div>
          );
        
        case 'qr':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-4">
                  Scan QR Code
                </h3>
                <div 
                  className="w-48 h-48 mx-auto retro-border-thick dark:bg-white bg-gray-100 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={handleQRClick}
                >
                  <QrCode className="w-32 h-32 text-black" />
                </div>
                <p className="font-jersey dark:text-slate-300 text-stone-700 mt-4">
                  Click on QR code to simulate scanning
                </p>
              </div>
            </div>
          );
        
        case 'connecting':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
                  Connecting...
                </h3>
                <p className="font-jersey dark:text-slate-300 text-stone-700">
                  Please wait while we establish the connection
                </p>
              </div>
            </div>
          );
        
        case 'connected':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
                  Connected!
                </h3>
                <p className="font-jersey dark:text-slate-300 text-stone-700 mb-4">
                  Zalo account successfully linked
                </p>
                <p className="font-jersey dark:text-slate-300 text-stone-700">
                  Listening for incoming messages...
                </p>
              </div>
              
              <button 
                onClick={handleClose}
                className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm"
              >
                CLOSE
              </button>
            </div>
          );
      }
    }

    // Email Flow
    if (selectedChannel.id === 'email') {
      const emailAddress = `${username}@konductor.ai`;
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedChannel.icon}</div>
            <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
              Email Integration
            </h3>
            <p className="font-jersey dark:text-slate-300 text-stone-700">
              Your personal Konductor email address:
            </p>
          </div>
          
          <div className="retro-border-thick p-4 dark:bg-slate-800 bg-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-press-start text-sm dark:text-cyan-400 text-amber-600">
                {emailAddress}
              </span>
              <button
                onClick={() => copyToClipboard(emailAddress)}
                className="retro-button-3d retro-border-thick p-2"
              >
                {copiedText === emailAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="font-jersey dark:text-slate-300 text-stone-700 text-sm">
              Send a test email to this address to verify the connection.
            </p>
            <p className="font-jersey dark:text-slate-500 text-stone-500 text-xs">
              All emails sent to this address will be processed by your AI assistant.
            </p>
          </div>
          
          <button 
            onClick={handleClose}
            className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm"
          >
            CLOSE
          </button>
        </div>
      );
    }

    // Slack Flow
    if (selectedChannel.id === 'slack') {
      const webhookUrl = 'https://konductor.ai/slack-callback';
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedChannel.icon}</div>
            <h3 className="font-press-start text-lg dark:text-white text-stone-900 mb-2">
              Slack Integration
            </h3>
            <p className="font-jersey dark:text-slate-300 text-stone-700">
              Follow these steps to connect Slack:
            </p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">1.</span>
              <span className="font-jersey dark:text-slate-300 text-stone-700">
                Go to your Slack workspace settings
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">2.</span>
              <span className="font-jersey dark:text-slate-300 text-stone-700">
                Create a new Slack app or webhook
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600">3.</span>
              <span className="font-jersey dark:text-slate-300 text-stone-700">
                Copy and paste this webhook URL:
              </span>
            </div>
          </div>
          
          <div className="retro-border-thick p-4 dark:bg-slate-800 bg-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600 break-all">
                {webhookUrl}
              </span>
              <button
                onClick={() => copyToClipboard(webhookUrl)}
                className="retro-button-3d retro-border-thick p-2 ml-2"
              >
                {copiedText === webhookUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="font-jersey dark:text-slate-300 text-stone-700 text-sm">
              Once configured, your Slack messages will be processed by Konductor AI.
            </p>
            <p className="font-jersey dark:text-slate-500 text-stone-500 text-xs">
              Make sure to grant the necessary permissions for message reading.
            </p>
          </div>
          
          <button 
            onClick={handleClose}
            className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm"
          >
            CLOSE
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="page-content-with-sticky-header">
      <PageHeader 
        title="Dashboard"
        subtitle="Workspace Overview"
        breadcrumbs={[]}
        actions={
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 px-3 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
                <MessageCircle className="h-3 w-3 dark:text-cyan-400 text-amber-600" />
                <span className="font-jersey dark:text-slate-300 text-stone-700">0 Messages</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
                <Settings className="h-3 w-3 dark:text-green-400 text-green-600" />
                <span className="font-jersey dark:text-slate-300 text-stone-700">{connectedChannels}/{totalChannels} Channels</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 dark:bg-slate-800/50 bg-stone-200/50 border border-slate-600">
                <CheckSquare className="h-3 w-3 dark:text-blue-400 text-blue-600" />
                <span className="font-jersey dark:text-slate-300 text-stone-700">{completedTodos}/{totalTodos} Tasks</span>
              </div>
          </div>
        }
      />
      
      <div className="retro-theme retro-high-contrast p-4 space-y-4 pt-2 min-h-screen">
        {/* Main Dashboard Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Communication Channels Column */}
        <div className="lg:col-span-3">
          <PixelWindow 
            title="Channels" 
            stats={`${connectedChannels}/${totalChannels}`}
            variant="primary"
          >
            <div className="space-y-4">
              {channels.map((channel) => (
                <div key={channel.id} className="flex flex-col items-center">
                  <button
                    onClick={() => handleChannelClick(channel)}
                    className={`w-12 h-12 retro-border-thick flex items-center justify-center text-2xl retro-button-3d ${
                      channel.connected 
                        ? 'hover:scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    {channel.icon}
                  </button>
                  <span className="text-xs font-jersey dark:text-slate-400 text-stone-600 mt-1 text-center">
                    {channel.name}
                  </span>
                  {channel.connected && channel.connectedInfo && (
                    <span className="text-xs font-press-start dark:text-green-400 text-green-600 mt-1">
                      {channel.connectedInfo}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 dark:text-cyan-400 text-amber-600 mt-2" />
                </div>
              ))}
            </div>
          </PixelWindow>
        </div>

        

        {/* Right Side Sections */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timeline Section */}
          <PixelWindow title="Timeline" stats="0 events">
            <div className="space-y-3">
              <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
                No recent activity
              </div>
              <div className="text-xs dark:text-slate-500 text-stone-500">
                Connect channels to see timeline updates
              </div>
            </div>
          </PixelWindow>

          {/* TODO List Section */}
          <PixelWindow title="TODO List" stats={`${completedTodos}/${totalTodos} tasks`}>
            <div className="space-y-3">
              {todoItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="w-4 h-4 retro-border-thick pixelated"
                    readOnly
                  />
                  <span className={`text-sm font-jersey ${
                    item.completed 
                      ? 'dark:text-slate-500 text-stone-500 line-through' 
                      : 'dark:text-slate-300 text-stone-700'
                  }`}>
                    {item.title}
                  </span>
                  <span className={`text-xs px-2 py-1 font-press-start retro-border-thick ${
                    item.priority === 'high' ? 'dark:bg-red-900/30 bg-red-200/60 dark:text-red-400 text-red-700 dark:border-red-400 border-red-700' :
                    item.priority === 'medium' ? 'dark:bg-yellow-900/30 bg-yellow-200/60 dark:text-yellow-400 text-yellow-700 dark:border-yellow-400 border-yellow-700' :
                    'dark:bg-green-900/30 bg-green-200/60 dark:text-green-400 text-green-700 dark:border-green-400 border-green-700'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </PixelWindow>

          {/* Conversations Summary Section */}
          <PixelWindow title="Conversations" stats="0 messages">
            <div className="space-y-3">
              <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
                No conversations yet
              </div>
              <div className="text-xs dark:text-slate-500 text-stone-500">
                Connect communication channels to start
              </div>
            </div>
          </PixelWindow>

          {/* Calendar Section */}
          <PixelWindow title="Calendar" stats={`${upcomingEvents.length} events`}>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-jersey dark:text-slate-300 text-stone-700">
                      {event.title}
                    </div>
                    <div className="text-xs dark:text-slate-500 text-stone-500">
                      {event.date} at {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PixelWindow>
        </div>

        {/* Channel Connection Dialog */}
         <PixelDialog
           isOpen={showChannelDialog}
           onClose={handleClose}
           title={selectedChannel ? `Connect ${selectedChannel.name}` : 'Connect Channel'}
           size="md"
         >
           {renderConnectionContent()}
         </PixelDialog>
         </div>
       </div>
     </div>
   );
}