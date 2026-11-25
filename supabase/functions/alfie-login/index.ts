// LawGlitch — Dashboard & Gateway Credential Management Edge Function
// Single-file Edge Function. Copy this entire file into the Supabase Function editor
// for the "alfie-login" function and click Deploy.
// Compatible with Supabase Edge Functions (Deno runtime).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// ── Version constant — bump this string when legal documents change ──────────
const CURRENT_TERMS_VERSION = "2026-11-25";

// ── Valid plan values (kept in sync with the DB enum/check constraint) ───────
// Plans: free | beta | pro | suspended
const DEFAULT_PLAN = "free";

// ── Single source of truth for selected profile fields ──────────────────────
// IMPORTANT: user_verified has been dropped from the table. Do NOT add it here.
const PROFILE_SELECT_FIELDS =
  "id, email, display_name, " +
  "terms_accepted, terms_accepted_at, terms_version, " +
  "marketing_consent, marketing_consent_at, " +
  "account_active, plan, " +
  "credits_remaining, credits_used, " +
  "gateway_key_active, created_at, last_used_at";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256Hex(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSecureToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `alg_${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey =
      Deno.env.get("SUPABASE_ANON_KEY") ||
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const supabaseServiceKey =
      Deno.env.get("SUPABASE_SECRET_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return jsonResponse(
        { error: "Server configuration missing: SUPABASE_URL or SUPABASE_SECRET_KEY" },
        500
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Validate the user's JWT with the anon key
    const supabaseUser = createClient(
      supabaseUrl,
      supabaseAnonKey || supabaseServiceKey,
      { auth: { persistSession: false } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser(token);
    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired session token" }, 401);
    }

    // Service-role client for all DB writes
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    let action = "get_profile";
    let body: any = {};

    if (req.method === "POST") {
      try {
        body = await req.json();
        if (body.action) action = body.action;
      } catch (_) { /* empty body → get_profile */ }
    }

    const userEmail = (user.email || "").toLowerCase();
    const isAdmin = userEmail === "lawglitch@gmail.com";

    // ── Fetch or auto-create profile ─────────────────────────────────────────
    let { data: profile, error: fetchErr } = await supabaseAdmin
      .from("profiles")
      .select(PROFILE_SELECT_FIELDS)
      .eq("id", user.id)
      .maybeSingle();

    if (fetchErr) {
      console.error("Fetch profile error:", JSON.stringify(fetchErr));
      return jsonResponse({ error: "Database error fetching profile" }, 500);
    }

    if (!profile) {
      // New user defaults:
      //   - plan        = 'free'       (must match plan_check constraint)
      //   - account_active = false      (admin manually activates users)
      //   - credits_remaining = 0       (n8n adds credits on activation)
      // Admin override: pro plan, active, 1000 credits
      const displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        userEmail.split("@")[0];

      const { data: newProfile, error: insertErr } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: user.id,
          email: userEmail,
          display_name: displayName,
          terms_accepted: false,
          account_active: isAdmin ? true : false,
          plan: isAdmin ? "pro" : DEFAULT_PLAN,
          credits_remaining: isAdmin ? 1000 : 0,
          credits_used: 0,
          gateway_key_active: false,
        })
        .select(PROFILE_SELECT_FIELDS)
        .single();

      if (insertErr) {
        console.error("Profile creation error:", JSON.stringify(insertErr));
        return jsonResponse({ error: "Failed to initialize profile" }, 500);
      }

      profile = newProfile;
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    switch (action) {

      case "get_profile": {
        return jsonResponse({ success: true, profile });
      }

      case "generate_key": {
        if (!profile.account_active) {
          return jsonResponse(
            { error: "Account is not active. Please contact lawglitch@outlook.com for activation." },
            403
          );
        }
        if (!profile.terms_accepted || profile.terms_version !== CURRENT_TERMS_VERSION) {
          return jsonResponse(
            { error: "Please accept the current Terms & Conditions in your dashboard before generating a gateway credential." },
            403
          );
        }

        const rawToken = generateSecureToken();
        const keyHash = await sha256Hex(rawToken);

        const { error: updateErr } = await supabaseAdmin
          .from("profiles")
          .update({ gateway_key_hash: keyHash, gateway_key_active: true, last_used_at: new Date().toISOString() })
          .eq("id", user.id);

        if (updateErr) {
          console.error("Update gateway key error:", JSON.stringify(updateErr));
          return jsonResponse({ error: "Failed to save gateway credential" }, 500);
        }

        return jsonResponse({
          success: true,
          key: rawToken,
          message: "Gateway key generated. Save it now — it will not be shown again.",
        });
      }

      case "revoke_key": {
        const { error: revokeErr } = await supabaseAdmin
          .from("profiles")
          .update({ gateway_key_hash: null, gateway_key_active: false })
          .eq("id", user.id);

        if (revokeErr) {
          console.error("Revoke key error:", JSON.stringify(revokeErr));
          return jsonResponse({ error: "Failed to revoke gateway credential" }, 500);
        }

        return jsonResponse({ success: true, message: "Gateway credential revoked." });
      }

      case "accept_terms": {
        const marketingConsent = body.marketing_consent === true;
        const now = new Date().toISOString();

        const updatePayload: Record<string, unknown> = {
          terms_accepted: true,
          terms_accepted_at: now,
          terms_version: CURRENT_TERMS_VERSION,
          marketing_consent: marketingConsent,
        };
        if (marketingConsent) {
          updatePayload.marketing_consent_at = now;
        }

        const { data: updatedProfile, error: termsErr } = await supabaseAdmin
          .from("profiles")
          .update(updatePayload)
          .eq("id", user.id)
          .select(PROFILE_SELECT_FIELDS)
          .single();

        if (termsErr) {
          console.error("Terms accept error:", JSON.stringify(termsErr));
          return jsonResponse({ error: "Failed to update terms acceptance" }, 500);
        }

        return jsonResponse({ success: true, profile: updatedProfile });
      }

      default:
        return jsonResponse({ error: `Unknown action: ${action}` }, 400);
    }

  } catch (err: any) {
    console.error("Unhandled exception:", err);
    return jsonResponse({ error: err.message || "Internal server error" }, 500);
  }
});
