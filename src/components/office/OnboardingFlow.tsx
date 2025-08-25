"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Smartphone, QrCode, CheckCircle, RefreshCw } from "lucide-react";
import { PixelDialog } from "@/components/ui/PixelDialog";
import { getWhatsAppQR, getWhatsAppStatus, updateChannelStatus } from "@/lib/pocketbase-utils";
import { WhatsAppQRResponse, WhatsAppStatusResponse } from "@/lib/types";

type OnboardingStep = 'welcome' | 'whatsapp-qr' | 'connecting' | 'completed';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  channelId?: string;
}

export function OnboardingFlow({ isOpen, onClose, onComplete, channelId }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [qrData, setQrData] = useState<WhatsAppQRResponse | null>(null);
  const [qrExpiry, setQrExpiry] = useState<number>(30);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppStatusResponse | null>(null);

  // QR Code expiry countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentStep === 'whatsapp-qr' && qrData && qrExpiry > 0) {
      interval = setInterval(() => {
        setQrExpiry(prev => {
          if (prev <= 1) {
            // QR expired, refresh it
            loadWhatsAppQR();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, qrData, qrExpiry]);

  // Poll for connection status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    if (currentStep === 'whatsapp-qr' || currentStep === 'connecting') {
      pollInterval = setInterval(async () => {
        try {
          const status = await getWhatsAppStatus();
          setConnectionStatus(status);
          
          if (status.status === 'connected') {
            setCurrentStep('connecting');
            
            // Update channel status in database
            if (channelId) {
              await updateChannelStatus(channelId, 'connected', {
                connectedAt: new Date().toISOString()
              });
            }
            
            // Show success for 2 seconds then complete
            setTimeout(() => {
              setCurrentStep('completed');
              setTimeout(() => {
                onComplete();
              }, 2000);
            }, 2000);
          }
        } catch (error) {
          console.error('Error polling WhatsApp status:', error);
        }
      }, 3000); // Poll every 3 seconds
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [currentStep, channelId, onComplete]);

  const loadWhatsAppQR = async () => {
    try {
      setIsLoadingQR(true);
      const qrResponse = await getWhatsAppQR();
      setQrData(qrResponse);
      setQrExpiry(30); // Reset expiry timer
    } catch (error) {
      console.error('Error loading WhatsApp QR:', error);
    } finally {
      setIsLoadingQR(false);
    }
  };

  const handleWelcomeNext = () => {
    setCurrentStep('whatsapp-qr');
    loadWhatsAppQR();
  };

  const handleRefreshQR = () => {
    loadWhatsAppQR();
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="font-press-start text-xl dark:text-white text-stone-900 mb-4">
        Welcome to Konductor AI!
      </h2>
      <div className="space-y-4 text-left">
        <p className="font-jersey dark:text-slate-300 text-stone-700">
          Let's get you connected! We'll start by linking your WhatsApp so your AI assistant can help manage your messages.
        </p>
        <div className="retro-border-thick p-4 dark:bg-slate-800/50 bg-stone-200/50">
          <h3 className="font-press-start text-sm dark:text-cyan-400 text-amber-600 mb-3">
            What you'll get:
          </h3>
          <ul className="space-y-2 font-jersey dark:text-slate-300 text-stone-700 text-sm">
            <li>• AI-powered message management</li>
            <li>• Smart task creation from conversations</li>
            <li>• Automated responses and scheduling</li>
            <li>• Seamless integration with your workflow</li>
          </ul>
        </div>
      </div>
      <button
        onClick={handleWelcomeNext}
        className="w-full retro-button-3d retro-border-thick p-4 font-press-start text-sm flex items-center justify-center space-x-2"
      >
        <span>GET STARTED</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderWhatsAppQRStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Smartphone className="w-6 h-6 dark:text-green-400 text-green-600" />
          <h2 className="font-press-start text-lg dark:text-white text-stone-900">
            Connect WhatsApp
          </h2>
        </div>
        
        {/* Step-by-step instructions */}
        <div className="retro-border-thick p-4 dark:bg-slate-800/50 bg-stone-200/50 mb-6 text-left">
          <h3 className="font-press-start text-sm dark:text-cyan-400 text-amber-600 mb-3">
            Follow these steps:
          </h3>
          <div className="space-y-3 font-jersey dark:text-slate-300 text-stone-700 text-sm">
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600 mt-1">1.</span>
              <span>Open WhatsApp on your phone</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600 mt-1">2.</span>
              <span>Tap the three dots (⋮) in the top right corner</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600 mt-1">3.</span>
              <span>Select "Linked Devices"</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600 mt-1">4.</span>
              <span>Tap "Link a Device"</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-press-start text-xs dark:text-cyan-400 text-amber-600 mt-1">5.</span>
              <span>Scan the QR code below</span>
            </div>
          </div>
        </div>
        
        {/* QR Code Display */}
        <div className="relative">
          {isLoadingQR ? (
            <div className="w-48 h-48 mx-auto retro-border-thick dark:bg-slate-700 bg-stone-300 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin dark:text-slate-400 text-stone-600" />
            </div>
          ) : qrData?.qr ? (
            <div className="relative">
              <div className="w-48 h-48 mx-auto retro-border-thick dark:bg-white bg-white p-2">
                <img 
                  src={qrData.qr} 
                  alt="WhatsApp QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Expiry Timer */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className={`px-3 py-1 retro-border-thick font-press-start text-xs ${
                  qrExpiry <= 10 
                    ? 'dark:bg-red-900/50 bg-red-200/70 dark:text-red-400 text-red-700' 
                    : 'dark:bg-slate-800/50 bg-stone-200/50 dark:text-slate-300 text-stone-700'
                }`}>
                  Expires in {qrExpiry}s
                </div>
              </div>
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto retro-border-thick dark:bg-slate-700 bg-stone-300 flex items-center justify-center">
              <QrCode className="w-16 h-16 dark:text-slate-400 text-stone-600" />
            </div>
          )}
        </div>
        
        {/* Refresh Button */}
        <div className="mt-8">
          <button
            onClick={handleRefreshQR}
            disabled={isLoadingQR}
            className="retro-button-3d retro-border-thick px-4 py-2 font-press-start text-xs flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingQR ? 'animate-spin' : ''}`} />
            <span>REFRESH QR</span>
          </button>
        </div>
        
        <p className="font-jersey dark:text-slate-400 text-stone-600 text-sm mt-4">
          Having trouble? Make sure WhatsApp is updated to the latest version.
        </p>
      </div>
    </div>
  );

  const renderConnectingStep = () => (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4 animate-pulse">📱</div>
      <h2 className="font-press-start text-xl dark:text-white text-stone-900 mb-4">
        Connecting...
      </h2>
      <p className="font-jersey dark:text-slate-300 text-stone-700">
        Great! We detected your WhatsApp connection. Setting up your AI assistant...
      </p>
      <div className="flex justify-center">
        <RefreshCw className="w-8 h-8 animate-spin dark:text-cyan-400 text-amber-600" />
      </div>
    </div>
  );

  const renderCompletedStep = () => (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="font-press-start text-xl dark:text-white text-stone-900 mb-4">
        All Set!
      </h2>
      <div className="retro-border-thick p-4 dark:bg-green-900/20 bg-green-200/50">
        <p className="font-jersey dark:text-green-300 text-green-800 mb-2">
          WhatsApp successfully connected!
        </p>
        <p className="font-jersey dark:text-slate-300 text-stone-700 text-sm">
          Your AI assistant is now ready to help manage your WhatsApp messages.
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'whatsapp-qr':
        return renderWhatsAppQRStep();
      case 'connecting':
        return renderConnectingStep();
      case 'completed':
        return renderCompletedStep();
      default:
        return renderWelcomeStep();
    }
  };

  const handleDialogClose = () => {
    if (currentStep === 'completed') {
      onClose();
    }
    // For other steps, we don't allow closing to ensure onboarding completion
  };

  return (
    <PixelDialog
      isOpen={isOpen}
      onClose={handleDialogClose}
      title="Onboarding Setup"
      size="lg"
    >
      {renderCurrentStep()}
    </PixelDialog>
  );
}