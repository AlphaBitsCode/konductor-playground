import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Simulate queue position (random number between 50-500)
    const queuePosition = Math.floor(Math.random() * 450) + 50;

    // Here you would typically save to database
    // For now, just return a success response
    console.log(`Early access signup: ${email} - Queue position: ${queuePosition}`);

    return NextResponse.json({
      success: true,
      queuePosition,
      message: 'Successfully added to early access list'
    });

  } catch (error) {
    console.error('Early access signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
