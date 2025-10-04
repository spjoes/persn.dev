import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const phoneNumber = process.env.PHONE_NUMBER || null;
    
    return NextResponse.json({
      phone: phoneNumber,
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

