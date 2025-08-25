import { 
  createDefaultWorkspace,
  initializeDefaultChannels,
  initializeDefaultTasks,
  createDefaultMinion,
  initializeOnboardingCalendarEvent,
  updateUserStatus,
  updateUserMeta
} from './pocketbase-utils';
import { OnboardingProgress, Task, CalendarEvent, Message } from './types';
import pb from './pocketbase';

/**
 * Add delay to prevent PocketBase auto-cancellation
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Initialize sample data for a new user during onboarding
 * This creates a complete workspace with sample data for demonstration
 */
export async function initializeSampleDataForUser(userId: string, assistantName: string = 'Alita') {
  try {
    console.log('Initializing sample data for user:', userId);
    
    // Add initial delay to prevent auto-cancellation
    await delay(200);
    
    // 1. Create default workspace
    const workspace = await createDefaultWorkspace(userId);
    console.log('Created workspace:', workspace.id);
    
    // Add delay before next operation
    await delay(300);
    
    // 2. Initialize communication channels
    const channels = await initializeDefaultChannels(workspace.id);
    console.log('Created channels:', channels.length);
    
    // Add small delay to prevent auto-cancellation
    await delay(100);
    
    // 3. Create sample tasks with realistic content
    const sampleTasks = [
      {
        workspace: workspace.id,
        title: 'Welcome to Konductor AI! 🎉',
        description: 'Complete this onboarding checklist to get started with your AI assistant',
        status: 'in_progress' as const,
        priority: 'high' as const,
        tags: ['onboarding', 'welcome']
      },
      {
        workspace: workspace.id,
        title: 'Connect your first communication channel',
        description: 'Link WhatsApp, Telegram, or email to start receiving messages through your AI',
        status: 'pending' as const,
        priority: 'high' as const,
        tags: ['onboarding', 'channels']
      },
      {
        workspace: workspace.id,
        title: 'Test your AI assistant',
        description: 'Send a message to your AI assistant to see how it responds',
        status: 'pending' as const,
        priority: 'medium' as const,
        tags: ['onboarding', 'testing']
      },
      {
        workspace: workspace.id,
        title: 'Upload your first document',
        description: 'Add documents to the Knowledge Library for your AI to reference',
        status: 'pending' as const,
        priority: 'medium' as const,
        tags: ['onboarding', 'knowledge']
      },
      {
        workspace: workspace.id,
        title: 'Create a custom AI minion',
        description: 'Design a specialized AI with unique personality and skills',
        status: 'pending' as const,
        priority: 'low' as const,
        tags: ['onboarding', 'minions']
      },
      {
        workspace: workspace.id,
        title: 'Schedule your first meeting',
        description: 'Use the calendar to plan and organize your upcoming events',
        status: 'pending' as const,
        priority: 'low' as const,
        tags: ['onboarding', 'calendar'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
      }
    ];
    
    const tasks = [];
    for (const taskData of sampleTasks) {
      try {
        const task = await pb.collection('tasks').create(taskData) as unknown as Task;
        tasks.push(task);
        await delay(50); // Small delay between requests
      } catch (error) {
        console.error('Error creating sample task:', error);
      }
    }
    console.log('Created sample tasks:', tasks.length);
    
    // Add delay before creating minion
    await delay(100);
    
    // 4. Create default AI minion
    const minion = await createDefaultMinion(workspace.id, assistantName);
    console.log('Created default minion:', minion.name);
    
    // 5. Create welcome calendar events
    const welcomeEvent = await initializeOnboardingCalendarEvent(workspace.id);
    
    // Create additional sample calendar events
    const sampleEvents = [
      {
        workspace: workspace.id,
        title: 'Daily AI Check-in',
        description: 'Review your AI assistant\'s daily summary and pending tasks',
        type: 'reminder' as const,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 min
        source: 'manual' as const,
        metadata: {
          recurring: 'daily',
          isOnboarding: true
        }
      },
      {
        workspace: workspace.id,
        title: 'Weekly AI Performance Review',
        description: 'Analyze your AI assistant\'s performance and optimize settings',
        type: 'meeting' as const,
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour
        source: 'manual' as const,
        metadata: {
          recurring: 'weekly',
          isOnboarding: true
        }
      }
    ];
    
    const calendarEvents = [welcomeEvent];
    for (const eventData of sampleEvents) {
      try {
        const event = await pb.collection('calendar_events').create(eventData) as unknown as CalendarEvent;
        calendarEvents.push(event);
        await delay(50); // Small delay between requests
      } catch (error) {
        console.error('Error creating sample calendar event:', error);
      }
    }
    console.log('Created calendar events:', calendarEvents.length);
    
    // Add delay before creating messages
    await delay(100);
    
    // 6. Create sample messages (simulated) - Skip for now to avoid 400 errors
    const sampleMessages: any[] = [];
    
    // Note: Commenting out message creation to avoid schema issues
    // Will be re-enabled once message schema is confirmed
    /*
    const sampleMessages = [
      {
        workspace: workspace.id,
        channel: channels.find(c => c.type === 'whatsapp')?.id || channels[0]?.id,
        sender: 'System',
        subject: 'Welcome to Konductor AI',
        content: `Hi there! 👋 Welcome to Konductor AI. I'm ${assistantName}, your personal AI assistant. I'm here to help you manage your tasks, schedule, and communications. Let's get started!`,
        preview: `Welcome to Konductor AI! I'm ${assistantName}, your personal AI assistant...`,
        type: 'system',
        isRead: false,
        messageTimestamp: new Date().toISOString(),
        metadata: {
          isWelcome: true,
          priority: 'high'
        }
      }
    ];
    */
    
    const messages: Message[] = [];
    // Skip message creation for now to avoid schema issues
    console.log('Skipped sample messages creation (schema validation needed)');
    
    // 7. Update user onboarding progress
    const onboardingProgress: OnboardingProgress = {
      step: 'channels',
      completedSteps: ['username', 'assistant_name'],
      channelsConnected: [],
      assistantName,
      startedAt: new Date().toISOString()
    };
    
    await updateUserMeta(userId, { 
      onboardingProgress,
      sampleDataInitialized: true,
      sampleDataVersion: '1.0'
    });
    await updateUserStatus(userId, 'onboarding');
    
    console.log('Sample data initialization completed successfully');
    
    return {
      workspace,
      channels,
      tasks,
      minion,
      calendarEvents,
      messages,
      summary: {
        workspaceId: workspace.id,
        channelsCount: channels.length,
        tasksCount: tasks.length,
        minionName: minion.name,
        eventsCount: calendarEvents.length,
        messagesCount: messages.length
      }
    };
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
}

/**
 * Check if user has sample data initialized
 */
export async function hasSampleDataInitialized(userId: string): Promise<boolean> {
  try {
    const user = await pb.collection('users').getOne(userId);
    return user.meta?.sampleDataInitialized === true;
  } catch (error) {
    console.error('Error checking sample data status:', error);
    return false;
  }
}

/**
 * Reset sample data for a user (for testing purposes)
 */
export async function resetSampleData(userId: string): Promise<void> {
  try {
    console.log('Resetting sample data for user:', userId);
    
    // Get user's workspaces
    const workspaces = await pb.collection('workspaces').getFullList({
      filter: `owner = "${userId}"`
    });
    
    // Delete all related data
    for (const workspace of workspaces) {
      // Delete messages
      const messages = await pb.collection('messages').getFullList({
        filter: `workspace = "${workspace.id}"`
      });
      for (const message of messages) {
        await pb.collection('messages').delete(message.id);
      }
      
      // Delete calendar events
      const events = await pb.collection('calendar_events').getFullList({
        filter: `workspace = "${workspace.id}"`
      });
      for (const event of events) {
        await pb.collection('calendar_events').delete(event.id);
      }
      
      // Delete tasks
      const tasks = await pb.collection('tasks').getFullList({
        filter: `workspace = "${workspace.id}"`
      });
      for (const task of tasks) {
        await pb.collection('tasks').delete(task.id);
      }
      
      // Delete minions
      const minions = await pb.collection('minions').getFullList({
        filter: `workspace = "${workspace.id}"`
      });
      for (const minion of minions) {
        await pb.collection('minions').delete(minion.id);
      }
      
      // Delete channels
      const channels = await pb.collection('channels').getFullList({
        filter: `workspace = "${workspace.id}"`
      });
      for (const channel of channels) {
        await pb.collection('channels').delete(channel.id);
      }
      
      // Delete workspace
      await pb.collection('workspaces').delete(workspace.id);
    }
    
    // Reset user meta
    await updateUserMeta(userId, {
      onboardingProgress: null,
      sampleDataInitialized: false
    });
    await updateUserStatus(userId, 'waitlist');
    
    console.log('Sample data reset completed');
  } catch (error) {
    console.error('Error resetting sample data:', error);
    throw error;
  }
}