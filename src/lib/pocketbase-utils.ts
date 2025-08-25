import pb from './pocketbase';
import { 
  User, 
  Workspace, 
  Channel, 
  Task, 
  Minion, 
  CalendarEvent, 
  OnboardingProgress,
  WhatsAppQRResponse,
  WhatsAppStatusResponse,
  COLLECTIONS 
} from './types';

// User Operations
export async function getCurrentUser(): Promise<User | null> {
  try {
    if (!pb.authStore.isValid) {
      return null;
    }
    return pb.authStore.model as unknown as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function updateUserMeta(userId: string, meta: Record<string, any>): Promise<User> {
  return await pb.collection(COLLECTIONS.USERS).update(userId, { meta }) as unknown as User;
}

export async function updateUserStatus(userId: string, status: 'waitlist' | 'onboarding' | 'active'): Promise<User> {
  return await pb.collection(COLLECTIONS.USERS).update(userId, { status }) as unknown as User;
}

// Workspace Operations
export async function createDefaultWorkspace(userId: string): Promise<Workspace> {
  const workspace = await pb.collection(COLLECTIONS.WORKSPACES).create({
    name: 'Default Workspace',
    description: 'Main workspace for all activities',
    owner: userId,
    isDefault: true,
    settings: {
      timezone: 'UTC',
      language: 'English',
      notifications: true
    }
  }) as unknown as Workspace;

  // Update user's defaultWorkspace
  await pb.collection(COLLECTIONS.USERS).update(userId, {
    defaultWorkspace: workspace.id
  });

  return workspace;
}

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  return await pb.collection(COLLECTIONS.WORKSPACES).getFullList({
    filter: `owner = "${userId}" || members.id ?= "${userId}"`
  }) as unknown as Workspace[];
}

export async function getUserDefaultWorkspace(userId: string): Promise<Workspace | null> {
  try {
    const workspaces = await pb.collection(COLLECTIONS.WORKSPACES).getFullList({
      filter: `owner = "${userId}" && isDefault = true`
    }) as unknown as Workspace[];
    return workspaces[0] || null;
  } catch (error) {
    console.error('Error getting default workspace:', error);
    return null;
  }
}

// Channel Operations
export async function getWorkspaceChannels(workspaceId: string): Promise<Channel[]> {
  return await pb.collection(COLLECTIONS.CHANNELS).getFullList({
    filter: `workspace = "${workspaceId}"`
  }) as unknown as Channel[];
}

export async function createChannel(data: Partial<Channel>): Promise<Channel> {
  return await pb.collection(COLLECTIONS.CHANNELS).create(data) as unknown as Channel;
}

export async function updateChannelStatus(channelId: string, status: Channel['status'], config?: Record<string, any>): Promise<Channel> {
  const updateData: any = { status };
  if (config) {
    updateData.config = config;
  }
  return await pb.collection(COLLECTIONS.CHANNELS).update(channelId, updateData) as unknown as Channel;
}

export async function initializeDefaultChannels(workspaceId: string): Promise<Channel[]> {
  const defaultChannels = [
    {
      workspace: workspaceId,
      name: 'WhatsApp',
      type: 'whatsapp' as const,
      status: 'disconnected' as const,
      description: 'WhatsApp messaging integration'
    },
    {
      workspace: workspaceId,
      name: 'Zalo',
      type: 'zalo' as const,
      status: 'disconnected' as const,
      description: 'Zalo messaging integration'
    },
    {
      workspace: workspaceId,
      name: 'Slack',
      type: 'slack' as const,
      status: 'disconnected' as const,
      description: 'Slack workspace integration'
    },
    {
      workspace: workspaceId,
      name: 'Gmail',
      type: 'gmail' as const,
      status: 'disconnected' as const,
      description: 'Gmail email integration'
    }
  ];

  const channels = [];
  for (const channelData of defaultChannels) {
    try {
      const channel = await createChannel(channelData);
      channels.push(channel);
    } catch (error) {
      console.error(`Error creating ${channelData.name} channel:`, error);
    }
  }

  return channels;
}

// Task Operations
export async function getWorkspaceTasks(workspaceId: string): Promise<Task[]> {
  return await pb.collection(COLLECTIONS.TASKS).getFullList({
    filter: `workspace = "${workspaceId}"`,
    sort: '-created'
  }) as unknown as Task[];
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  return await pb.collection(COLLECTIONS.TASKS).create(data) as unknown as Task;
}

export async function initializeDefaultTasks(workspaceId: string): Promise<Task[]> {
  const defaultTasks = [
    {
      workspace: workspaceId,
      title: 'Complete onboarding setup',
      description: 'Connect your communication channels and configure your AI assistant',
      status: 'in_progress' as const,
      priority: 'high' as const,
      tags: ['onboarding', 'setup']
    },
    {
      workspace: workspaceId,
      title: 'Connect WhatsApp channel',
      description: 'Scan QR code to link your WhatsApp account',
      status: 'pending' as const,
      priority: 'medium' as const,
      tags: ['onboarding', 'whatsapp']
    },
    {
      workspace: workspaceId,
      title: 'Test AI assistant interaction',
      description: 'Send a test message to verify your AI assistant is working',
      status: 'pending' as const,
      priority: 'low' as const,
      tags: ['onboarding', 'testing']
    }
  ];

  const tasks = [];
  for (const taskData of defaultTasks) {
    try {
      const task = await createTask(taskData);
      tasks.push(task);
    } catch (error) {
      console.error('Error creating default task:', error);
    }
  }

  return tasks;
}

// Minion Operations
export async function getWorkspaceMinions(workspaceId: string): Promise<Minion[]> {
  return await pb.collection(COLLECTIONS.MINIONS).getFullList({
    filter: `workspace = "${workspaceId}"`
  }) as unknown as Minion[];
}

export async function createMinion(data: Partial<Minion>): Promise<Minion> {
  return await pb.collection(COLLECTIONS.MINIONS).create(data) as unknown as Minion;
}

export async function createDefaultMinion(workspaceId: string, assistantName: string = 'Alita'): Promise<Minion> {
  return await createMinion({
    workspace: workspaceId,
    name: assistantName,
    title: 'Assistant',
    persona: 'A helpful and professional AI assistant who excels at organizing tasks, scheduling, and providing clear, actionable advice. Always maintains a positive and supportive tone.',
    backstory: `${assistantName} was designed to be the perfect digital companion for busy professionals. With years of experience in task management and communication, she understands the importance of efficiency and clarity.`,
    documentAccess: ['all'],
    isActive: true,
    conversationCount: 0,
    avatar: '🤖'
  });
}

// Calendar Operations
export async function getWorkspaceCalendarEvents(workspaceId: string): Promise<CalendarEvent[]> {
  return await pb.collection(COLLECTIONS.CALENDAR_EVENTS).getFullList({
    filter: `workspace = "${workspaceId}"`,
    sort: 'startTime'
  }) as unknown as CalendarEvent[];
}

export async function createCalendarEvent(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
  return await pb.collection(COLLECTIONS.CALENDAR_EVENTS).create(data) as unknown as CalendarEvent;
}

export async function initializeOnboardingCalendarEvent(workspaceId: string): Promise<CalendarEvent> {
  const now = new Date();
  const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

  return await createCalendarEvent({
    workspace: workspaceId,
    title: 'Konductor AI Onboarding',
    description: 'Complete your Konductor AI setup and connect your first channels',
    type: 'reminder',
    startTime: now.toISOString(),
    endTime: endTime.toISOString(),
    source: 'manual',
    metadata: {
      isOnboarding: true
    }
  });
}

// WhatsApp Integration
export async function getWhatsAppQR(): Promise<WhatsAppQRResponse> {
  const response = await fetch('https://master.konductor.ai/api/links/wa-qr');
  if (!response.ok) {
    throw new Error('Failed to fetch WhatsApp QR code');
  }
  return await response.json();
}

export async function getWhatsAppStatus(): Promise<WhatsAppStatusResponse> {
  const response = await fetch('https://master.konductor.ai/api/links/wa-status');
  if (!response.ok) {
    throw new Error('Failed to fetch WhatsApp status');
  }
  return await response.json();
}

// Onboarding Operations
export async function initializeUserOnboarding(userId: string): Promise<{
  workspace: Workspace;
  channels: Channel[];
  tasks: Task[];
  minion: Minion;
  calendarEvent: CalendarEvent;
}> {
  try {
    // Create default workspace
    const workspace = await createDefaultWorkspace(userId);
    
    // Initialize default channels
    const channels = await initializeDefaultChannels(workspace.id);
    
    // Create default tasks
    const tasks = await initializeDefaultTasks(workspace.id);
    
    // Create default minion
    const minion = await createDefaultMinion(workspace.id);
    
    // Create onboarding calendar event
    const calendarEvent = await initializeOnboardingCalendarEvent(workspace.id);
    
    // Update user status and onboarding progress
    const onboardingProgress: OnboardingProgress = {
      step: 'channels',
      completedSteps: ['username', 'assistant_name'],
      channelsConnected: [],
      assistantName: minion.name,
      startedAt: new Date().toISOString()
    };
    
    await updateUserMeta(userId, { onboardingProgress });
    await updateUserStatus(userId, 'onboarding');
    
    return {
      workspace,
      channels,
      tasks,
      minion,
      calendarEvent
    };
  } catch (error) {
    console.error('Error initializing user onboarding:', error);
    throw error;
  }
}

export async function updateOnboardingProgress(userId: string, step: OnboardingProgress['step'], additionalData?: Partial<OnboardingProgress>): Promise<void> {
  const user = await pb.collection(COLLECTIONS.USERS).getOne(userId) as unknown as User;
  const currentProgress = user.meta?.onboardingProgress || {};
  
  const updatedProgress: OnboardingProgress = {
    ...currentProgress,
    step,
    ...additionalData
  };
  
  if (step === 'completed') {
    updatedProgress.completedAt = new Date().toISOString();
    await updateUserStatus(userId, 'active');
  }
  
  await updateUserMeta(userId, {
    ...user.meta,
    onboardingProgress: updatedProgress
  });
}

// Statistics Operations
export async function getWorkspaceStats(workspaceId: string) {
  try {
    const [channels, tasks, messages] = await Promise.all([
      getWorkspaceChannels(workspaceId),
      getWorkspaceTasks(workspaceId),
      pb.collection(COLLECTIONS.MESSAGES).getFullList({
        filter: `workspace = "${workspaceId}"`,
        fields: 'id'
      }) as unknown as { id: string }[]
    ]);
    
    const connectedChannels = channels.filter(ch => ch.status === 'connected').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    
    return {
      connectedChannels,
      totalChannels: channels.length,
      completedTasks,
      totalTasks: tasks.length,
      totalMessages: messages.length
    };
  } catch (error) {
    console.error('Error getting workspace stats:', error);
    return {
      connectedChannels: 0,
      totalChannels: 0,
      completedTasks: 0,
      totalTasks: 0,
      totalMessages: 0
    };
  }
}