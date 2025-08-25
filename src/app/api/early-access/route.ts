
import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import PocketBase, { ClientResponseError, RecordModel } from 'pocketbase';

// Email cleanup function
function cleanupEmail(email: string): string {
  // Remove +suffix from email (e.g., sample+test@gmail.com -> sample@gmail.com)
  const cleanedEmail = email.replace(/\+[^@]*@/, '@');
  
  // Validate no more than 1 dot before @
  const [localPart, domain] = cleanedEmail.split('@');
  if (localPart && (localPart.match(/\./g) || []).length > 1) {
    throw new Error('Email can contain at most one dot before the @ symbol');
  }
  
  return cleanedEmail.toLowerCase().trim();
}

// Generate 6-digit numeric beta access code
function generateBetaAccessCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Clean up email
    let cleanedEmail: string;
    try {
      cleanedEmail = cleanupEmail(email);
    } catch (emailError) {
      return NextResponse.json({
        error: emailError instanceof Error ? emailError.message : 'Invalid email format'
      }, { status: 400 });
    }

    // Validate email format
    if (!cleanedEmail || typeof cleanedEmail !== 'string' || !cleanedEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/;
    if (username.length < 5 || username.length > 25 || !usernameRegex.test(username)) {
      return NextResponse.json({
        error: 'Username must be 5-25 characters, alphanumeric with optional single dot'
      }, { status: 400 });
    }

    // Check if email is already registered
    try {
      const existingEmailUser = await pb.collection('users').getFirstListItem(`email = "${cleanedEmail}"`);
      if (existingEmailUser) {
        return NextResponse.json({
          error: 'This email has already been used to register. Please try another email.'
        }, { status: 400 });
      }
    } catch (err) {
      // Email not found, which is good - continue
      if (!(err instanceof ClientResponseError) || err.status !== 404) {
        console.error('Error checking email:', err);
        return NextResponse.json({
          error: 'Unable to process request at this time.'
        }, { status: 500 });
      }
    }

    // Check if username is already taken
    try {
      const existingUsernameUser = await pb.collection('users').getFirstListItem(`username = "${username}"`);
      if (existingUsernameUser) {
        return NextResponse.json({
          error: 'Username is already taken'
        }, { status: 400 });
      }
    } catch (err) {
      // Username not found, which is good - continue
      if (!(err instanceof ClientResponseError) || err.status !== 404) {
        console.error('Error checking username:', err);
        return NextResponse.json({
          error: 'Unable to process request at this time.'
        }, { status: 500 });
      }
    }

    // Generate password and beta access code
    const generatePassword = () =>
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const password = generatePassword().slice(0, 16);
    const betaAccessCode = generateBetaAccessCode();

    let createdUserId: string | null = null;
    interface UserMeta {
      waitlist_number?: number;
      [key: string]: unknown;
    }

    interface UserRecord extends RecordModel {
      email: string;
      status: string;
      username?: string;
      betaAccessCode?: string;
      meta?: UserMeta;
    }

    try {
      // Create a new user marked as waitlist
      const created = await pb.collection('users').create({
        email: cleanedEmail,
        username,
        password,
        passwordConfirm: password,
        status: 'waitlist',
        betaAccessCode,
        emailVisibility: false,
      });
      createdUserId = created.id;
    } catch (err) {
      console.error('User create error:', err);
      if (err instanceof ClientResponseError) {
        if (err.data?.data?.email) {
          return NextResponse.json({
            error: 'This email has already been used to register. Please try another email.'
          }, { status: 400 });
        }
        if (err.data?.data?.username) {
          return NextResponse.json({
            error: 'Username is already taken'
          }, { status: 400 });
        }
      }
      return NextResponse.json({
        error: 'Unable to process waitlist request at this time.'
      }, { status: 500 });
    }

    // Assign permanent meta.waitlist_number = total users (admin-only operation)
    let waitlistNumber: number | null = null;
    try {
      const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
      const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
      if (adminEmail && adminPassword && createdUserId) {
        const adminPb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);
        await adminPb.admins.authWithPassword(adminEmail, adminPassword);

        const list = await adminPb.collection('users').getList(1, 1);
        const totalUsers = list.totalItems;
        waitlistNumber = totalUsers;

        const newMeta = { waitlist_number: totalUsers };
        await adminPb.collection('users').update(createdUserId, { meta: newMeta });
      }
    } catch (metaErr) {
      console.warn('Could not assign meta.waitlist_number:', metaErr);
    }

    return NextResponse.json({
      success: true,
      queuePosition: waitlistNumber,
      message: 'Successfully added to early access list',
    });
  } catch (error) {
    console.error('Early access signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
