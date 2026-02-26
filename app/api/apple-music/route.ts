import { NextResponse } from 'next/server';
import { getDeveloperToken } from './token';

interface AppleMusicSong {
  id: string;
  type: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    url: string;
    artwork: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export async function GET() {
  const userToken = process.env.APPLE_MUSIC_USER_TOKEN;

  if (!userToken) {
    return NextResponse.json(
      { error: 'Apple Music user token not configured' },
      { status: 500 }
    );
  }

  try {
    const developerToken = await getDeveloperToken();

    const response = await fetch(
      'https://api.music.apple.com/v1/me/recent/played/tracks?limit=5',
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          'Music-User-Token': userToken,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Apple Music API error: ${response.status}`);
    }

    const data = await response.json();
    const songs: AppleMusicSong[] = data.data ?? [];

    const tracks = songs.map((song) => ({
      name: song.attributes.name,
      artist: song.attributes.artistName,
      album: song.attributes.albumName,
      artworkUrl: song.attributes.artwork?.url
        ? song.attributes.artwork.url
            .replace('{w}', '600')
            .replace('{h}', '600')
        : '',
      trackUrl: song.attributes.url,
    }));

    return NextResponse.json(tracks);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch music data' },
      { status: 500 }
    );
  }
}
