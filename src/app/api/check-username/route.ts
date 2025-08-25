
import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { ClientResponseError } from 'pocketbase';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/;
    if (username.length < 5 || username.length > 25 || !usernameRegex.test(username)) {
      return NextResponse.json({
        available: false,
        error: 'Username must be 5-25 characters, alphanumeric with optional single dot'
      }, { status: 400 });
    }

    // Check if username is already taken
    try {
      const existingUsernameUser = await pb.collection('users').getFirstListItem(`username = "${username}"`);
      if (existingUsernameUser) {
        return NextResponse.json({
          available: false,
          error: 'Username is already taken'
        }, { status: 200 });
      }
    } catch (err) {
      // Username not found, which is good - it's available
      if (!(err instanceof ClientResponseError) || err.status !== 404) {
        console.error('Error checking username:', err);
        return NextResponse.json({
          error: 'Unable to check username availability at this time.'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      available: true,
      message: 'Username is available'
    });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
