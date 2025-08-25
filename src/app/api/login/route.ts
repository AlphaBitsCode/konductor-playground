
import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { ClientResponseError } from 'pocketbase';

export async function POST(request: NextRequest) {
  try {
    const { username, accessCode } = await request.json();

    if (!username || !accessCode) {
      return NextResponse.json({ 
        error: 'Username and access code are required' 
      }, { status: 400 });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/;
    if (username.length < 5 || username.length > 25 || !usernameRegex.test(username)) {
      return NextResponse.json({ 
        error: 'Invalid username format' 
      }, { status: 400 });
    }

    // Validate access code format (6-digit numeric)
    const accessCodeRegex = /^[0-9]{6}$/;
    if (!accessCodeRegex.test(accessCode)) {
      return NextResponse.json({ 
        error: 'Access code must be 6 digits' 
      }, { status: 400 });
    }

    try {
      // Find user by username and verify access code in the users collection
      const records = await pb.collection('users').getList(1, 1, {
        filter: `username = "${username}" && betaAccessCode = "${accessCode}"`,
      });

      if (records.items.length === 0) {
        return NextResponse.json({ 
          error: 'Invalid username or access code' 
        }, { status: 401 });
      }

      const userRecord = records.items[0];

      // Return success with user data (client will handle cookie setting)
      return NextResponse.json({
        success: true,
        user: {
          id: userRecord.id,
          username: userRecord.username,
          email: userRecord.email,
          verified: true,
          betaAccessCode: userRecord.betaAccessCode,
          waitlistNumber: userRecord.meta?.waitlist_number || null
        }
      });

    } catch (err) {
      if (err instanceof ClientResponseError && err.status === 404) {
        return NextResponse.json({ 
          error: 'Invalid username or access code' 
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
