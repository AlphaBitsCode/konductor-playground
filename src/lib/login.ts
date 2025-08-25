
import { ClientResponseError } from 'pocketbase';
import pb from './pocketbase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    verified: boolean;
    betaAccessCode: string;
    waitlistNumber?: number;
  };
}

export function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  if (email.length > 254) {
    return "Email address is too long";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required";
  }
  
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginResult> {
  const { email, password } = credentials;

  // Validate inputs
  const emailError = validateEmail(email);
  if (emailError) {
    return { success: false, error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  try {
    // Use PocketBase authWithPassword for authentication
    const authData = await pb.collection('users').authWithPassword(email, password);
    
    if (pb.authStore.isValid && authData.record) {
      return {
        success: true,
        user: {
          id: authData.record.id,
          username: authData.record.username,
          email: authData.record.email,
          verified: authData.record.verified || true,
          betaAccessCode: authData.record.betaAccessCode,
          waitlistNumber: authData.record.meta?.waitlist_number || null
        }
      };
    } else {
      return {
        success: false,
        error: "Authentication failed. Invalid credentials."
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof ClientResponseError) {
      if (error.status === 400) {
        return {
          success: false,
          error: "Invalid username or password."
        };
      }
    }
    
    return {
      success: false,
      error: "Connection failed. Please try again."
    };
  }
}

// Logout function
export function logoutUser(): void {
  // Clear PocketBase auth store
  pb.authStore.clear();
  
  // Clear any client-side cookies if they exist
  if (typeof document !== 'undefined') {
    document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

// Get current user data
export function getCurrentUser() {
  if (pb.authStore.isValid && pb.authStore.record) {
    return {
      id: pb.authStore.record.id,
      username: pb.authStore.record.username,
      email: pb.authStore.record.email,
      verified: pb.authStore.record.verified || true,
      betaAccessCode: pb.authStore.record.betaAccessCode,
      waitlistNumber: pb.authStore.record.meta?.waitlist_number || null
    };
  }
  return null;
}

// Create user with betaAccessCode as password
export async function createUserWithBetaCode(email: string, betaAccessCode: string): Promise<LoginResult> {
  const emailError = validateEmail(email);
  if (emailError) {
    return { success: false, error: emailError };
  }

  const passwordError = validatePassword(betaAccessCode);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, betaAccessCode }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        user: data.user
      };
    } else {
      return {
        success: false,
        error: data.error || "Failed to create user account."
      };
    }
  } catch (error) {
    console.error('User creation error:', error);
    return {
      success: false,
      error: "Connection failed. Please try again."
    };
  }
}
