import { NextResponse } from "next/server";
import { getDeveloperToken } from "./token";

export const dynamic = "force-dynamic";

interface AppleMusicSong {
  id: string;
  type: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    url: string;
    artwork?: {
      url: string;
      width: number;
      height: number;
    };
  };
}

const RECENT_TRACKS_URL =
  "https://api.music.apple.com/v1/me/recent/played/tracks?limit=5";
const DEV_TOKEN_CHECK_URL =
  "https://api.music.apple.com/v1/catalog/us/charts?types=songs&limit=1";

async function getAppleErrorMessage(response: Response) {
  let errorDetail = "";
  try {
    const body = await response.json();
    const detail =
      body?.errors?.[0]?.detail ?? body?.errors?.[0]?.title ?? body?.error;
    if (typeof detail === "string") errorDetail = detail;
  } catch {
    // fall back to status text
  }
  return errorDetail || response.statusText || "Unknown Apple Music API error";
}

export async function GET() {
  const userToken = process.env.APPLE_MUSIC_USER_TOKEN;

  if (!userToken) {
    return NextResponse.json(
      { error: "Apple Music user token not configured" },
      { status: 500 }
    );
  }

  try {
    const developerToken = await getDeveloperToken();

    const response = await fetch(RECENT_TRACKS_URL, {
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Music-User-Token": userToken,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const appleError = await getAppleErrorMessage(response);

      if (response.status === 401 || response.status === 403) {
        const devTokenCheck = await fetch(DEV_TOKEN_CHECK_URL, {
          headers: { Authorization: `Bearer ${developerToken}` },
          cache: "no-store",
        });

        if (devTokenCheck.ok) {
          return NextResponse.json(
            {
              error:
                "Apple Music sync needs to be reauthorized. The stored APPLE_MUSIC_USER_TOKEN is no longer valid.",
            },
            { status: 502 }
          );
        }
      }

      console.error("Apple Music API request failed", {
        status: response.status,
        detail: appleError,
      });

      return NextResponse.json(
        { error: `Apple Music API request failed: ${appleError}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const songs: AppleMusicSong[] = data.data ?? [];

    const tracks = songs.map((song) => ({
      name: song.attributes.name,
      artist: song.attributes.artistName,
      album: song.attributes.albumName,
      artworkUrl: song.attributes.artwork?.url
        ? song.attributes.artwork.url.replace("{w}", "600").replace("{h}", "600")
        : "",
      trackUrl: song.attributes.url,
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Failed to fetch Apple Music data", error);
    return NextResponse.json(
      { error: "Failed to fetch music data" },
      { status: 500 }
    );
  }
}
