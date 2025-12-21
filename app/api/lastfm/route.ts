import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return NextResponse.json(
      { error: 'Last.fm credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=6`,
        { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Last.fm');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music data' },
      { status: 500 }
    );
  }
}
