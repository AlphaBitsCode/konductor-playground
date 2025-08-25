
import { ClientResponseError } from 'pocketbase';

export interface LoginCredentials {
  username: string;
  accessCode: string;
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

export function validateUsername(username: string): string | null {
  if (!username) {
    return "Username is required";
  }
  
  if (username.length < 5 || username.length > 25) {
    return "Username must be between 5 and 25 characters";
  }

  const validPattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/;
  if (!validPattern.test(username)) {
    return "Username can only contain letters, numbers, and one dot";
  }

  const dotCount = (username.match(/\./g) || []).length;
  if (dotCount > 1) {
    return "Username can contain at most one dot";
  }

  return null;
}

export function validateAccessCode(accessCode: string): string | null {
  if (!accessCode) {
    return "Access code is required";
  }
  
  const accessCodeRegex = /^[0-9]{6}$/;
  if (!accessCodeRegex.test(accessCode)) {
    return "Access code must be 6 digits";
  }
  return null;
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginResult> {
  const { username, accessCode } = credentials;

  // Validate inputs
  const usernameError = validateUsername(username);
  if (usernameError) {
    return { success: false, error: usernameError };
  }

  const accessCodeError = validateAccessCode(accessCode);
  if (accessCodeError) {
    return { success: false, error: accessCodeError };
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, accessCode }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Set client-side auth cookie
      document.cookie = `pb_auth=${encodeURIComponent(JSON.stringify({
        token: `beta_${username}_${Date.now()}`,
        model: data.user
      }))}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;

      return {
        success: true,
        user: data.user
      };
    } else {
      return {
        success: false,
        error: data.error || "Access denied. Invalid credentials or insufficient clearance level."
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: "Connection failed. Network protocols may be compromised."
    };
  }
}
