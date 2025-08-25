
import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { ClientResponseError } from 'pocketbase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, betaAccessCode } = await request.json();

    // Handle user creation if betaAccessCode is provided
    if (betaAccessCode) {
      return await handleUserCreation(email, betaAccessCode);
    }

    // Handle login
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    try {
      // Use PocketBase authentication
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      if (pb.authStore.isValid && authData.record) {
        return NextResponse.json({
          success: true,
          user: {
            id: authData.record.id,
            username: authData.record.username,
            email: authData.record.email,
            verified: authData.record.verified || true,
            betaAccessCode: authData.record.betaAccessCode,
            waitlistNumber: authData.record.meta?.waitlist_number || null
          }
        });
      } else {
        return NextResponse.json({ 
          error: 'Invalid email or password' 
        }, { status: 401 });
      }

    } catch (err) {
      if (err instanceof ClientResponseError && err.status === 400) {
        return NextResponse.json({ 
          error: 'Invalid email or password' 
        }, { status: 401 });
      }
      throw err;
    }

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function handleUserCreation(email: string, betaAccessCode: string) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Validate access code format (6-digit numeric)
    const accessCodeRegex = /^[0-9]{6}$/;
    if (!accessCodeRegex.test(betaAccessCode)) {
      return NextResponse.json({ 
        error: 'Access code must be 6 digits' 
      }, { status: 400 });
    }

    // Check if user already exists
    try {
      const existingUser = await pb.collection('users').getFirstListItem(`email = "${email}"`);
      if (existingUser) {
        return NextResponse.json({ 
          error: 'Email already exists' 
        }, { status: 409 });
      }
    } catch (err) {
      // User doesn't exist, which is what we want
    }

    // Create new user with betaAccessCode as password
    const userData = {
      username: email.split('@')[0], // Generate username from email
      email: email,
      password: betaAccessCode,
      passwordConfirm: betaAccessCode,
      betaAccessCode: betaAccessCode,
      verified: true,
      meta: {
        created_via: 'beta_signup'
      }
    };

    const newUser = await pb.collection('users').create(userData);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        verified: true,
        betaAccessCode: newUser.betaAccessCode
      }
    });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}
