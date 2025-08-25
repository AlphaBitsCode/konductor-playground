"use server";

import { redirect } from "next/navigation";
import PocketBase, { ClientResponseError } from "pocketbase";
import { cookies } from "next/headers";

// Initialize PocketBase with debug logging
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
console.log("PocketBase initialized with URL:", pb.baseUrl);

export type ActionResult =
  | { success: true; error?: never }
  | { success: false; error: string | null };

export async function signup(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  if (password !== passwordConfirm) {
    return { success: false, error: "Passwords do not match" };
  }

  try {
    // Create user account
    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm,
    });

    // Send verification email
    await pb.collection("users").requestVerification(email);

    return { success: true };
  } catch (error) {
    if (error instanceof ClientResponseError) {
      if (error.status === 400) {
        const data = error.response?.data;
        if (data) {
          const fieldErrors = Object.entries(data)
            .map(([field, errors]) => `${field}: ${errors}`)
            .join(", ");
          return {
            success: false,
            error: `Please fix the following: ${fieldErrors}`,
          };
        }
      }

      if (error.status === 0) {
        return {
          success: false,
          error: "Unable to connect to the server. Please try again later.",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}

export async function login(formData: FormData): Promise<ActionResult> {
  const username = formData.get('username') as string;
  const accessCode = formData.get('accessCode') as string;

  if (!username || !accessCode) {
    return { success: false, error: 'Username and access code are required' };
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/;
  if (username.length < 5 || username.length > 25 || !usernameRegex.test(username)) {
    return { success: false, error: 'Invalid username format' };
  }

  // Validate access code format (6-digit numeric)
  const accessCodeRegex = /^[0-9]{6}$/;
  if (!accessCodeRegex.test(accessCode)) {
    return { success: false, error: 'Access code must be 6 digits' };
  }

  try {
    // Find user by username and verify access code
    const records = await pb.collection('earlyAccess').getList(1, 1, {
      filter: `username = "${username}" && betaAccessCode = "${accessCode}"`,
    });

    if (records.items.length === 0) {
      return { success: false, error: 'Invalid username or access code' };
    }

    const userRecord = records.items[0];

    // Create or authenticate user account
    // For now, we'll create a simple authentication token
    // In a full implementation, you might want to create a proper user session

    // Set auth cookie with user data
    cookies().set('pb_auth', JSON.stringify({
      token: `beta_${username}_${Date.now()}`, // Simple token generation
      model: {
        id: userRecord.id,
        username: userRecord.username,
        email: userRecord.email,
        verified: true,
        betaAccessCode: userRecord.betaAccessCode,
        waitlistNumber: userRecord.waitlistNumber
      }
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle specific PocketBase errors
    if (error?.status === 400) {
      return { success: false, error: 'Invalid username or access code' };
    }

    return { success: false, error: 'Login failed. Please try again.' };
  }
}

export async function verifyEmail(token: string): Promise<ActionResult> {
  try {
    await pb.collection("users").confirmVerification(token);
    return { success: true };
  } catch (error) {
    if (error instanceof ClientResponseError) {
      if (error.status === 400) {
        return {
          success: false,
          error: "Invalid or expired verification token",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}

export async function resendVerification(email: string): Promise<ActionResult> {
  try {
    await pb.collection("users").requestVerification(email);
    return { success: true };
  } catch (error) {
    if (error instanceof ClientResponseError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("pb_auth");
  redirect("/login");
}