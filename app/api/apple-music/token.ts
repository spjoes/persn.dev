import { SignJWT, importPKCS8 } from "jose";

const TOKEN_DURATION = 15777000; // ~6 months in seconds

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Mints (and caches) an Apple Music developer token signed with the
 * MusicKit private key. Valid up to 6 months; we refresh a minute early.
 */
export async function getDeveloperToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && tokenExpiry && now < tokenExpiry - 60) {
    return cachedToken;
  }

  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;

  if (!privateKey || !keyId || !teamId) {
    throw new Error(
      "Missing Apple Music developer credentials (APPLE_MUSIC_PRIVATE_KEY, APPLE_MUSIC_KEY_ID, APPLE_MUSIC_TEAM_ID)"
    );
  }

  // Hosting providers often store multi-line secrets with literal \n.
  const normalizedKey = privateKey.replace(/\\n/g, "\n");
  const privateKeyImported = await importPKCS8(normalizedKey, "ES256");

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_DURATION)
    .sign(privateKeyImported);

  cachedToken = jwt;
  tokenExpiry = now + TOKEN_DURATION;

  return jwt;
}
