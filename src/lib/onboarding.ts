import { 
  initializeUserOnboarding, 
  updateOnboardingProgress, 
  getCurrentUser,
  getUserDefaultWorkspace 
} from './pocketbase-utils';
import { User, OnboardingProgress } from './types';

/**
 * Check if user needs onboarding and initialize if necessary
 */
export async function checkAndInitializeOnboarding(userId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has a workspace
    const existingWorkspace = await getUserDefaultWorkspace(userId);
    if (existingWorkspace) {
      // User already has workspace, check onboarding status
      const onboardingProgress = user.meta?.onboardingProgress as OnboardingProgress;
      if (onboardingProgress?.step === 'completed') {
        return false; // Onboarding already completed
      }
      return true; // Needs to continue onboarding
    }

    // User needs full onboarding - initialize everything
    await initializeUserOnboarding(userId);
    return true;
  } catch (error) {
    console.error('Error checking/initializing onboarding:', error);
    throw error;
  }
}

/**
 * Complete the onboarding process
 */
export async function completeOnboarding(userId: string): Promise<void> {
  try {
    await updateOnboardingProgress(userId, 'completed', {
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
}

/**
 * Update onboarding step progress
 */
export async function updateOnboardingStep(
  userId: string, 
  step: OnboardingProgress['step'], 
  additionalData?: Partial<OnboardingProgress>
): Promise<void> {
  try {
    await updateOnboardingProgress(userId, step, additionalData);
  } catch (error) {
    console.error('Error updating onboarding step:', error);
    throw error;
  }
}

/**
 * Get current onboarding progress
 */
export async function getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    
    return user.meta?.onboardingProgress as OnboardingProgress || null;
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    return null;
  }
}

/**
 * Check if user should see onboarding UI
 */
export async function shouldShowOnboarding(userId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    // Check user status
    if (user.status === 'waitlist') {
      return false; // User is still on waitlist
    }

    if (user.status === 'active') {
      return false; // User has completed onboarding
    }

    // Check if user has onboarding progress
    const progress = user.meta?.onboardingProgress as OnboardingProgress;
    if (progress?.step === 'completed') {
      return false;
    }

    return true; // User needs onboarding
  } catch (error) {
    console.error('Error checking if should show onboarding:', error);
    return false;
  }
}

/**
 * Initialize onboarding for a new user after signup
 */
export async function initializeNewUserOnboarding(userId: string, assistantName: string = 'Alita'): Promise<void> {
  try {
    // Initialize all default data
    const result = await initializeUserOnboarding(userId);
    
    // Update onboarding progress with assistant name
    await updateOnboardingProgress(userId, 'channels', {
      assistantName,
      completedSteps: ['username', 'assistant_name'],
      channelsConnected: [],
      startedAt: new Date().toISOString()
    });
    
    console.log('New user onboarding initialized:', {
      userId,
      workspaceId: result.workspace.id,
      channelsCount: result.channels.length,
      tasksCount: result.tasks.length,
      minionName: result.minion.name
    });
  } catch (error) {
    console.error('Error initializing new user onboarding:', error);
    throw error;
  }
}