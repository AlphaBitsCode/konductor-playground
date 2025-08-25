// PocketBase Collection Types

export interface User {
  id: string;
  email: string;
  name?: string;
  username: string;
  betaAccessCode?: string;
  avatar?: string;
  status?: 'waitlist' | 'onboarding' | 'active';
  defaultWorkspace?: string;
  meta?: Record<string, any>;
  created: string;
  updated: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner: string;
  members?: string[];
  isDefault?: boolean;
  settings?: Record<string, any>;
  created: string;
  updated: string;
}

export interface Channel {
  id: string;
  workspace: string;
  name: string;
  type: 'telegram' | 'gmail' | 'whatsapp' | 'zalo' | 'slack';
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  description?: string;
  config?: Record<string, any>;
  lastSync?: string;
  messageCount?: number;
  created: string;
  updated: string;
}

export interface Message {
  id: string;
  workspace: string;
  channel: string;
  externalId?: string;
  sender: string;
  subject?: string;
  content: string;
  preview?: string;
  type: string;
  isRead?: boolean;
  isStarred?: boolean;
  isIgnored?: boolean;
  topicId?: string;
  parentMessage?: string;
  messageTimestamp?: string;
  metadata?: Record<string, any>;
  created: string;
  updated: string;
}

export interface Task {
  id: string;
  workspace: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  reminderAt?: string;
  completedAt?: string;
  tags?: string[];
  sourceMessage?: string;
  metadata?: Record<string, any>;
  created: string;
  updated: string;
}

export interface Minion {
  id: string;
  workspace: string;
  name: string;
  title: 'Assistant' | 'Writer' | 'Analyst' | 'Comedian' | 'Researcher' | 'Translator' | 'Custom';
  customTitle?: string;
  persona: string;
  backstory: string;
  documentAccess?: string[];
  isActive?: boolean;
  conversationCount?: number;
  lastUsed?: string;
  avatar?: string;
  metadata?: Record<string, any>;
  created: string;
  updated: string;
}

export interface Document {
  id: string;
  workspace: string;
  title: string;
  type: 'pdf' | 'doc' | 'video' | 'link' | 'gdrive' | 'gdocs';
  url?: string;
  size?: string;
  tokens?: number;
  lastFetched?: string;
  refreshInterval: 'manual' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'processing' | 'error';
  metadata?: Record<string, any>;
  created: string;
  updated: string;
}

export interface CalendarEvent {
  id: string;
  workspace: string;
  externalId?: string;
  title: string;
  description?: string;
  type: 'meeting' | 'task' | 'personal' | 'reminder';
  startTime: string;
  endTime?: string;
  location?: string;
  attendees?: string[];
  reminderAt?: string;
  source: 'manual' | 'gmail' | 'task' | 'telegram';
  sourceTask?: string;
  metadata?: Record<string, any>;
  created: string;
  updated: string;
}

// WhatsApp API Response Types
export interface WhatsAppQRResponse {
  qr: string;
  status: 'scan_to_connect' | 'connected';
  updated: number;
}

export interface WhatsAppStatusResponse {
  status: 'scan_to_connect' | 'connected' | 'disconnected';
  updated: number;
  qr?: string;
}

// Onboarding Progress Types
export interface OnboardingProgress {
  step: 'username' | 'assistant_name' | 'channels' | 'completed';
  completedSteps: string[];
  channelsConnected: string[];
  assistantName?: string;
  startedAt: string;
  completedAt?: string;
}

// Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  WORKSPACES: 'workspaces', 
  CHANNELS: 'channels',
  MESSAGES: 'messages',
  TASKS: 'tasks',
  MINIONS: 'minions',
  DOCUMENTS: 'documents',
  CALENDAR_EVENTS: 'calendar_events'
} as const;