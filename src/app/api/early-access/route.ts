import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import PocketBase, { ClientResponseError } from 'pocketbase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Create or update user as waitlist
    const generatePassword = () =>
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    const password = generatePassword().slice(0, 16);

    let createdUserId: string | null = null;
    let existingRecord: any | null = null;

    try {
      // Try to create a new user marked as waitlist
      const created = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        status: 'waitlist',
        emailVisibility: false,
      });
      createdUserId = created.id;
    } catch (err) {
      // If user already exists, update their status to waitlist
      if (err instanceof ClientResponseError && err.status === 400) {
        try {
          const existing = await pb
            .collection('users')
            .getFirstListItem(`email = "${email}"`);
          await pb.collection('users').update(existing.id, { status: 'waitlist' });
          existingRecord = existing;
          createdUserId = existing.id;
        } catch (findOrUpdateErr) {
          // If we cannot find or update the existing user, return the underlying error
          console.error('Waitlist update error:', findOrUpdateErr);
          return NextResponse.json(
            { error: 'Unable to process waitlist request at this time.' },
            { status: 500 }
          );
        }
      } else {
        console.error('User create error:', err);
        return NextResponse.json(
          { error: 'Unable to process waitlist request at this time.' },
          { status: 500 }
        );
      }
    }

    // Assign permanent meta.waitlist_number = total users (admin-only operation)
    try {
      const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
      const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
      if (adminEmail && adminPassword && createdUserId) {
        const adminPb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);
        await adminPb.admins.authWithPassword(adminEmail, adminPassword);

        const list = await adminPb.collection('users').getList(1, 1);
        const totalUsers = list.totalItems;

        // Only set waitlist_number if it doesn't already exist
        let currentMeta: Record<string, unknown> | undefined;
        if (existingRecord) {
          // ensure we have the latest meta for existing users
          const fresh = await adminPb.collection('users').getOne(createdUserId);
          currentMeta = (fresh as any).meta as Record<string, unknown> | undefined;
        }

        const alreadyAssigned =
          typeof (currentMeta as any)?.waitlist_number === 'number';

        if (!alreadyAssigned) {
          const newMeta = { ...(currentMeta || {}), waitlist_number: totalUsers };
          await adminPb.collection('users').update(createdUserId, { meta: newMeta });
        }
      }
    } catch (metaErr) {
      console.warn('Could not assign meta.waitlist_number:', metaErr);
    }

    return NextResponse.json({
      success: true,
      queuePosition: null,
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
