/**
 * LawGlitch — Alfie Agent Gateway (Cloudflare Worker)
 * 
 * Single-file Worker ready to copy and deploy via the Cloudflare web dashboard.
 * Acts as a secure, authenticated HTTP reverse gateway between the Alfie browser
 * extension and your private n8n agent workflow.
 * 
 * Required Cloudflare Worker Environment Variables / Secrets:
 *  - SUPABASE_URL: e.g. "https://pxwbumtpnzbbqzqhnsow.supabase.co"
 *  - SUPABASE_SECRET_KEY: your Supabase secret key ("sb_secret_..." or legacy "SUPABASE_SERVICE_ROLE_KEY")
 *  - N8N_WEBHOOK_URL: your n8n agent webhook endpoint URL
 * 
 * Default Gateway Endpoint: https://alfie.lawglitch.workers.dev
 */

// In-memory cache for authenticated credentials (TTL: 60 seconds)
// Ensures rapid response while respecting revocation within 1 minute
const authCache = new Map();
const CACHE_TTL_MS = 60 * 1000;
const CURRENT_TERMS_VERSION = '2026-11-25';

/**
 * SHA-256 helper using standard Web Crypto API
 */
async function sha256Hex(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Standard CORS and JSON response helper
 */
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      ...extraHeaders,
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Health check / info on GET
    if (request.method === 'GET') {
      const url = new URL(request.url);
      if (url.pathname === '/' || url.pathname === '/health') {
        return jsonResponse({
          service: 'Alfie Agent Gateway',
          status: 'online',
          provider: 'LawGlitch',
          docs: 'https://lawglitch.pages.dev/dashboard/'
        });
      }
    }

    // Only allow POST for gateway proxying
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method Not Allowed. Use POST.' }, 405);
    }

    // 2. Parse HTTP Basic Authorization header
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('basic ')) {
      return jsonResponse(
        { error: 'Missing or invalid Basic Authentication credentials.' },
        401,
        { 'WWW-Authenticate': 'Basic realm="Alfie Agent Gateway"' }
      );
    }

    let username = '';
    let rawPassword = '';

    try {
      const base64Credentials = authHeader.slice(6).trim();
      const decoded = atob(base64Credentials);
      const colonIndex = decoded.indexOf(':');
      if (colonIndex === -1) {
        throw new Error('Malformed credentials string');
      }
      username = decoded.slice(0, colonIndex).trim().toLowerCase();
      rawPassword = decoded.slice(colonIndex + 1);
    } catch (e) {
      return jsonResponse({ error: 'Malformed Basic Authentication header.' }, 400);
    }

    if (!username || !rawPassword) {
      return jsonResponse(
        { error: 'Username (email) and password are required.' },
        401,
        { 'WWW-Authenticate': 'Basic realm="Alfie Agent Gateway"' }
      );
    }

    // 3. Compute SHA-256 hash of submitted password
    const passwordHash = await sha256Hex(rawPassword);

    // 4. Verify against Cache or Supabase
    const cacheKey = `${username}:${passwordHash}`;
    const now = Date.now();
    let authRecord = authCache.get(cacheKey);

    if (!authRecord || now > authRecord.expiresAt) {
      // Fetch user profile from Supabase using newer Secret Key (or legacy service_role fallback)
      const supabaseUrl = env.SUPABASE_URL || 'https://pxwbumtpnzbbqzqhnsow.supabase.co';
      const supabaseKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseKey) {
        console.error('SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) is not configured in worker environment.');
        return jsonResponse({ error: 'Gateway configuration error: missing database credentials.' }, 500);
      }

      const queryUrl = `${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(username)}&select=id,email,account_active,terms_accepted,terms_version,gateway_key_active,gateway_key_hash,credits_remaining`;

      let sbRes;
      try {
        sbRes = await fetch(queryUrl, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Accept': 'application/json',
          },
        });
      } catch (err) {
        console.error('Supabase fetch failed:', err);
        return jsonResponse({ error: 'Internal gateway error: database unavailable.' }, 500);
      }

      if (!sbRes.ok) {
        console.error('Supabase error:', await sbRes.text());
        return jsonResponse({ error: 'Failed to verify account credentials.' }, 500);
      }

      const profiles = await sbRes.json();
      if (!profiles || profiles.length === 0) {
        return jsonResponse({ error: 'Account not found or invalid credentials.' }, 401);
      }

      const profile = profiles[0];

      // Check account status
      if (!profile.account_active) {
        return jsonResponse(
          { error: 'Your account is currently inactive. Please contact lawglitch@outlook.com for activation.' },
          403
        );
      }

      // Check mandatory terms acceptance and version
      if (!profile.terms_accepted || profile.terms_version !== CURRENT_TERMS_VERSION) {
        return jsonResponse(
          { error: 'Please accept the current Terms & Conditions in your LawGlitch dashboard before using the gateway.' },
          403
        );
      }

      // Check gateway key status
      if (!profile.gateway_key_active || !profile.gateway_key_hash) {
        return jsonResponse(
          { error: 'No active gateway password found. Please generate one in your LawGlitch dashboard.' },
          401
        );
      }

      // Verify SHA-256 hash match
      if (profile.gateway_key_hash.toLowerCase() !== passwordHash.toLowerCase()) {
        return jsonResponse({ error: 'Invalid gateway password.' }, 401);
      }

      // Populate Cache for 60 seconds
      authRecord = {
        userId: profile.id,
        email: profile.email,
        expiresAt: now + CACHE_TTL_MS,
      };
      authCache.set(cacheKey, authRecord);
    }

    // 5. Forward request to n8n Webhook
    const n8nUrl = env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      console.error('N8N_WEBHOOK_URL is not configured in worker environment.');
      return jsonResponse({ error: 'Gateway configuration error: missing upstream agent URL.' }, 500);
    }

    // Preserve headers while stripping raw Basic Auth credentials
    const forwardHeaders = new Headers();
    for (const [key, value] of request.headers.entries()) {
      const lower = key.toLowerCase();
      if (lower !== 'authorization' && lower !== 'host' && lower !== 'cf-ray' && lower !== 'cf-connecting-ip') {
        forwardHeaders.set(key, value);
      }
    }

    // Add user identification headers for n8n workflow tracking and credit auditing
    forwardHeaders.set('X-Alfie-User-Id', authRecord.userId);
    forwardHeaders.set('X-Alfie-User-Email', authRecord.email);
    forwardHeaders.set('X-Forwarded-By', 'LawGlitch-Alfie-Worker');

    let requestBody = null;
    try {
      requestBody = await request.arrayBuffer();
    } catch (e) {
      requestBody = null;
    }

    try {
      const n8nResponse = await fetch(n8nUrl, {
        method: 'POST',
        headers: forwardHeaders,
        body: requestBody,
      });

      // Forward n8n response back to Alfie caller
      const responseHeaders = new Headers(n8nResponse.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('X-Gateway-Processed-By', 'Alfie-Cloudflare-Worker');

      return new Response(n8nResponse.body, {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        headers: responseHeaders,
      });
    } catch (n8nErr) {
      console.error('Upstream n8n error:', n8nErr);
      return jsonResponse(
        { error: 'Upstream agent service temporarily unreachable. Please retry shortly.' },
        502
      );
    }
  },
};
