"use client";

import { useState, useEffect } from "react";
import { Copy, Check, QrCode } from "lucide-react";
import { PixelDialog } from "@/components/ui/PixelDialog";
import { 
  getCurrentUser, 
  getUserDefaultWorkspace, 
  getWorkspaceChannels, 
  updateChannelStatus,
  getWhatsAppQR,
  getWhatsAppStatus
} from "@/lib/pocketbase-utils";
import { Channel, User, Workspace, WhatsAppQRResponse, WhatsAppStatusResponse } from "@/lib/types";
import { initializeSampleDataForUser } from "@/lib/sample-data";
import { OnboardingFlow } from "./OnboardingFlow";

type ConnectionStep = 'initial' | 'qr' | 'connecting' | 'connected';

interface OnboardingChannelsProps {
  username?: string;
}

const getChannelIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    whatsapp: "/misc/wa-hires.png",
    zalo: "/misc/zalo.png",
    slack: "/misc/slack.png",
    gmail: "/misc/email.png"
  };
  return iconMap[type] || "/misc/email.png";
};

const getChannelColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    whatsapp: "text-green-500",
    zalo: "text-blue-500",
    slack: "text-purple-500",
    gmail: "text-red-500"
  };
  return colorMap[type] || "text-gray-500";
};

export function OnboardingChannels({ username }: OnboardingChannelsProps) {
  const [showChannelDialog, setShowChannelDialog] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>('initial');
  const [copiedText, setCopiedText] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<WhatsAppQRResponse | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatusResponse | null>(null);
  const [showOnboardingFlow, setShowOnboardingFlow] = useState(false);

  // Load user data and channels on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        console.error('No authenticated user found');
        return;
      }
      
      setUser(currentUser);
      
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
      
      const workspaceChannels = await getWorkspaceChannels(defaultWorkspace.id);
      setChannels(workspaceChannels);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectedChannels = channels.filter(ch => ch.status === 'connected').length;
  const totalChannels = channels.length;

  const handleChannelClick = (channel: Channel) => {
    if (channel.type === 'whatsapp') {
      // Use the new onboarding flow for WhatsApp
      setSelectedChannel(channel);
      setShowOnboardingFlow(true);
    } else {
      // Use the old dialog for other channels
      setSelectedChannel(channel);
      setConnectionStep('initial');
      setShowChannelDialog(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboardingFlow(false);
    // Refresh channels data
    loadUserData();
  };

  const handleOnboardingClose = () => {
    setShowOnboardingFlow(false);
  };

  const handleConnect = async () => {
    if (!selectedChannel) return;
    
    if (selectedChannel.type === 'whatsapp') {
      try {
        const qrResponse = await getWhatsAppQR();
        setQrData(qrResponse);
        setConnectionStep('qr');
        
        // Start polling for connection status
        pollWhatsAppStatus();
      } catch (error) {
        console.error('Error getting WhatsApp QR:', error);
      }
    } else if (selectedChannel.type === 'zalo') {
      setConnectionStep('qr');
    } else if (selectedChannel.type === 'gmail') {
      setConnectionStep('connected');
    } else if (selectedChannel.type === 'slack') {
      setConnectionStep('connected');
    }
  };

  const pollWhatsAppStatus = async () => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;
    
    const poll = async () => {
      try {
        const status = await getWhatsAppStatus();
        setWhatsappStatus(status);
        
        if (status.status === 'connected') {
          await handleWhatsAppConnected();
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        }
      } catch (error) {
        console.error('Error polling WhatsApp status:', error);
      }
    };
    
    poll();
  };

  const handleWhatsAppConnected = async () => {
    if (!selectedChannel) return;
    
    try {
      setConnectionStep('connected');
      
      // Update channel status in database
      await updateChannelStatus(selectedChannel.id, 'connected', {
        connectedAt: new Date().toISOString()
      });
      
      // Refresh channels list
      if (workspace) {
        const updatedChannels = await getWorkspaceChannels(workspace.id);
        setChannels(updatedChannels);
      }
    } catch (error) {
      console.error('Error updating WhatsApp channel status:', error);
    }
  };

  const handleQRClick = () => {
    if (selectedChannel?.type === 'whatsapp') {
      setConnectionStep('connecting');
      // The actual connection will be handled by the polling mechanism
    } else {
      // For other channels, simulate connection
      setConnectionStep('connecting');
      setTimeout(() => {
        setConnectionStep('connected');
      }, 2000);
    }
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
    if (selectedChannel.type === 'whatsapp') {
      switch (connectionStep) {
        case 'initial':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <img 
                    src={getChannelIcon(selectedChannel.type)} 
                    alt={selectedChannel.name} 
                    className="w-16 h-16 mx-auto object-contain"
                  />
                </div>
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
                  {qrData?.qr ? (
                    <img 
                      src={qrData.qr} 
                      alt="WhatsApp QR Code" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-32 h-32 text-black" />
                  )}
                </div>
                <p className="font-jersey dark:text-slate-300 text-stone-700 mt-4">
                  {qrData?.qr ? 'Scan with WhatsApp to connect' : 'Loading QR code...'}
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
                  WhatsApp connected successfully!
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
    if (selectedChannel.type === 'zalo') {
      switch (connectionStep) {
        case 'initial':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <img 
                    src={getChannelIcon(selectedChannel.type)} 
                    alt={selectedChannel.name} 
                    className="w-16 h-16 mx-auto object-contain"
                  />
                </div>
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
    if (selectedChannel.type === 'gmail') {
      const emailAddress = `${user?.username || 'user'}@konductor.ai`;
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <img 
                src={getChannelIcon(selectedChannel.type)} 
                alt={selectedChannel.name} 
                className="w-16 h-16 mx-auto object-contain"
              />
            </div>
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
    if (selectedChannel.type === 'slack') {
      const webhookUrl = 'https://konductor.ai/slack-callback';
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <img 
                src={getChannelIcon(selectedChannel.type)} 
                alt={selectedChannel.name} 
                className="w-16 h-16 mx-auto object-contain"
              />
            </div>
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

  if (loading) {
    return (
      <div className="w-full mb-6">
        <div className="retro-border-thick p-6 dark:bg-slate-900/50 bg-stone-100/50">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-6">
      <div className="retro-border-thick p-6 dark:bg-slate-900/50 bg-stone-100/50">
        <div className="text-center mb-6">
          <h2 className="font-press-start text-xl dark:text-white text-stone-900 mb-2">
            Connect Your Channels
          </h2>
          <p className="font-jersey dark:text-slate-300 text-stone-700">
            Connect your communication channels to get started with Konductor AI
          </p>
          <div className="mt-2">
            <span className="font-press-start text-sm dark:text-cyan-400 text-amber-600">
              {connectedChannels}/{totalChannels} Connected
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex flex-col items-center">
              <button
                onClick={() => handleChannelClick(channel)}
                className={`w-16 h-16 retro-border-thick flex items-center justify-center text-3xl retro-button-3d ${
                  channel.status === 'connected' 
                    ? 'hover:scale-105 dark:bg-green-900/30 bg-green-200/60' 
                    : 'hover:scale-105'
                }`}
              >
                <img 
                  src={getChannelIcon(channel.type)} 
                  alt={channel.name} 
                  className="w-8 h-8 object-contain"
                />
              </button>
              <span className="text-sm font-jersey dark:text-slate-400 text-stone-600 mt-2 text-center">
                {channel.name}
              </span>
              {channel.status === 'connected' && (
                <span className="text-xs font-press-start dark:text-green-400 text-green-600 mt-1">
                  ✓ CONNECTED
                </span>
              )}
              {channel.status === 'pending' && (
                <span className="text-xs font-press-start dark:text-yellow-400 text-yellow-600 mt-1">
                  ⏳ PENDING
                </span>
              )}
              {channel.status === 'error' && (
                <span className="text-xs font-press-start dark:text-red-400 text-red-600 mt-1">
                  ❌ ERROR
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <PixelDialog
        isOpen={showChannelDialog}
        onClose={handleClose}
        title={selectedChannel ? `Connect ${selectedChannel.name}` : 'Connect Channel'}
        size="md"
      >
        {renderConnectionContent()}
      </PixelDialog>
      
      {/* New Onboarding Flow for WhatsApp */}
      <OnboardingFlow
        isOpen={showOnboardingFlow}
        onClose={handleOnboardingClose}
        onComplete={handleOnboardingComplete}
        channelId={selectedChannel?.id}
      />
    </div>
  );
}