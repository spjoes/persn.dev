import { SignJWT, importPKCS8 } from 'jose';

const TOKEN_DURATION = 15777000; // 6 months in seconds

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getDeveloperToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && tokenExpiry && now < tokenExpiry - 60) {
    return cachedToken;
  }

  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;

  if (!privateKey || !keyId || !teamId) {
    throw new Error('Missing Apple Music developer credentials (APPLE_MUSIC_PRIVATE_KEY, APPLE_MUSIC_KEY_ID, APPLE_MUSIC_TEAM_ID)');
  }

  // Vercel stores multi-line env vars with literal \n — normalize them
  const normalizedKey = privateKey.replace(/\\n/g, '\n');

  const privateKeyImported = await importPKCS8(normalizedKey, 'ES256');

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_DURATION)
    .sign(privateKeyImported);

  cachedToken = jwt;
  tokenExpiry = now + TOKEN_DURATION;

  return jwt;
}
