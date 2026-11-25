/**
 * LawGlitch — Alfie Dashboard Controller
 * Handles Supabase OAuth authentication, profile synchronization,
 * gateway password generation/revocation, real-time usage metrics,
 * mandatory Terms & Conditions onboarding, and profile caching.
 */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://pxwbumtpnzbbqzqhnsow.supabase.co';
  const EDGE_FUNCTION_ENDPOINT = `${SUPABASE_URL}/functions/v1/alfie-login`;

  // Must match the value in the Edge Function and Cloudflare Worker
  const CURRENT_TERMS_VERSION = '2026-11-25';

  // Profile cache TTL: 5 minutes. Tab focus / minor blips will NOT re-fetch.
  const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;
  const PROFILE_CACHE_KEY_PREFIX = 'alfie_profile_';

  let supabase = null;
  let currentSession = null;
  let currentProfile = null;

  // ── DOM References ─────────────────────────────────────────────────────────
  const elLoading    = document.getElementById('dash-loading');
  const elAuthView   = document.getElementById('dash-auth-view');
  const elTermsView  = document.getElementById('dash-terms-view');
  const elMainView   = document.getElementById('dash-main-view');

  const btnLoginGoogle = document.getElementById('btn-login-google');
  const btnLoginGithub = document.getElementById('btn-login-github');
  const btnRefreshProfile = document.getElementById('btn-refresh-profile');
  const btnSignOut     = document.getElementById('btn-sign-out');
  const authErrorMsg   = document.getElementById('auth-error-msg');

  // Account overview elements
  const elDisplayEmail  = document.getElementById('user-display-email');
  const elJoinedDate    = document.getElementById('val-joined-date');
  const elUserId        = document.getElementById('val-user-id');
  const elBadgeStatus   = document.getElementById('badge-account-status');
  const elBadgePlan     = document.getElementById('badge-account-plan');
  const elAlertInactive = document.getElementById('alert-account-inactive');

  // Gateway elements
  const elGatewayCard    = document.getElementById('gateway-card');
  const elCredUsername   = document.getElementById('cred-username');
  const elCredPassword   = document.getElementById('cred-password');
  const elTableUsername  = document.getElementById('table-username');
  const btnGenerateKey   = document.getElementById('btn-generate-key');
  const btnRevokeKey     = document.getElementById('btn-revoke-key');
  const elGatewayFeedback = document.getElementById('gateway-feedback');

  // Usage elements
  const elValCreditsTotal     = document.getElementById('val-credits-total');
  const elValCreditsUsed      = document.getElementById('val-credits-used');
  const elValCreditsRemaining = document.getElementById('val-credits-remaining');
  const elCreditsProgressFill = document.getElementById('credits-progress-fill');
  const elAlertCreditsZero    = document.getElementById('alert-credits-zero');

  // Terms onboarding elements
  const chkTermsMandatory  = document.getElementById('chk-terms-mandatory');
  const chkTermsMarketing  = document.getElementById('chk-terms-marketing');
  const btnAcceptTerms     = document.getElementById('btn-accept-terms');
  const btnTermsSignOut    = document.getElementById('btn-terms-sign-out');
  const elTermsError       = document.getElementById('terms-error-msg');

  // ── Profile Cache Helpers ──────────────────────────────────────────────────

  function getCachedProfile(userId) {
    try {
      const raw = sessionStorage.getItem(PROFILE_CACHE_KEY_PREFIX + userId);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() > entry.expiresAt) {
        sessionStorage.removeItem(PROFILE_CACHE_KEY_PREFIX + userId);
        return null;
      }
      return entry.profile;
    } catch (_) {
      return null;
    }
  }

  function setCachedProfile(userId, profile) {
    // Only cache active profiles with accepted terms so pending-activation users
    // see manual admin activation immediately on reload.
    if (!profile || !profile.account_active) {
      clearCachedProfile(userId);
      return;
    }
    try {
      sessionStorage.setItem(
        PROFILE_CACHE_KEY_PREFIX + userId,
        JSON.stringify({ profile, expiresAt: Date.now() + PROFILE_CACHE_TTL_MS })
      );
    } catch (_) { /* storage full or private mode — silent */ }
  }

  function clearCachedProfile(userId) {
    if (!userId) return;
    try {
      sessionStorage.removeItem(PROFILE_CACHE_KEY_PREFIX + userId);
    } catch (_) { /* ignore */ }
  }

  // ── Supabase Init ──────────────────────────────────────────────────────────

  function initSupabase() {
    const key = window.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ygJmP8Ua8zjVOS2Sb6oFcg_0U0YzA7L';
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      showError('Supabase client library failed to load. Please refresh the page.');
      return null;
    }
    return window.supabase.createClient(SUPABASE_URL, key);
  }

  // ── UI Helpers ─────────────────────────────────────────────────────────────

  function showView(view) {
    [elLoading, elAuthView, elTermsView, elMainView].forEach(el => {
      if (el) el.style.display = 'none';
    });
    if (view) view.style.display = 'block';
  }

  function showError(msg) {
    if (authErrorMsg) {
      authErrorMsg.textContent = msg;
      authErrorMsg.style.display = 'block';
    }
  }

  function showGatewayFeedback(msg, isError = false) {
    if (!elGatewayFeedback) return;
    elGatewayFeedback.className = isError ? 'alert-box alert-danger' : 'alert-box alert-success';
    elGatewayFeedback.textContent = msg;
    elGatewayFeedback.style.display = 'block';
    setTimeout(() => { elGatewayFeedback.style.display = 'none'; }, 6000);
  }

  // ── Edge Function Caller ───────────────────────────────────────────────────

  async function callDashboardApi(action, payload = {}) {
    if (!currentSession || !currentSession.access_token) {
      throw new Error('User not authenticated.');
    }

    const res = await fetch(EDGE_FUNCTION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentSession.access_token}`,
      },
      body: JSON.stringify({ action, ...payload }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Server responded with ${res.status}`);
    }
    return data;
  }

  // ── Profile Rendering ──────────────────────────────────────────────────────

  function renderProfile(profile, user) {
    currentProfile = profile;
    const email = profile.email || user.email || '';

    if (elDisplayEmail) elDisplayEmail.textContent = email;
    if (elCredUsername) elCredUsername.value = email;
    if (elTableUsername) elTableUsername.textContent = email;
    if (elUserId) elUserId.textContent = user.id ? user.id.slice(0, 8) + '...' : '-';

    const createdAt = profile.created_at || user.created_at;
    if (createdAt && elJoinedDate) {
      elJoinedDate.textContent = new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    }

    // Plan & Status Badges
    const plan = (profile.plan || 'free').toUpperCase();
    if (elBadgePlan) elBadgePlan.textContent = `${plan} PLAN`;

    if (profile.account_active) {
      if (elBadgeStatus) { elBadgeStatus.textContent = 'ACTIVE'; elBadgeStatus.className = 'badge-pill badge-active'; }
      if (elAlertInactive) elAlertInactive.style.display = 'none';
      if (elGatewayCard) elGatewayCard.style.opacity = '1';
      if (btnGenerateKey) btnGenerateKey.disabled = false;
    } else {
      if (elBadgeStatus) { elBadgeStatus.textContent = 'PENDING ACTIVATION'; elBadgeStatus.className = 'badge-pill badge-inactive'; }
      if (elAlertInactive) elAlertInactive.style.display = 'flex';
      if (elGatewayCard) elGatewayCard.style.opacity = '0.65';
      if (btnGenerateKey) btnGenerateKey.disabled = true;
    }

    // Gateway Key State
    if (!profile.gateway_key_active) {
      if (elCredPassword) elCredPassword.value = 'No active password generated';
      if (btnRevokeKey) btnRevokeKey.disabled = true;
    } else {
      if (elCredPassword) elCredPassword.value = '••••••••••••••••••••••••';
      if (btnRevokeKey) btnRevokeKey.disabled = false;
    }

    // Credits & Usage
    const remaining = Number(profile.credits_remaining) || 0;
    const used      = Number(profile.credits_used)      || 0;
    const total     = remaining + used;

    if (elValCreditsRemaining) elValCreditsRemaining.textContent = remaining.toLocaleString();
    if (elValCreditsUsed)      elValCreditsUsed.textContent      = used.toLocaleString();
    if (elValCreditsTotal)     elValCreditsTotal.textContent     = total.toLocaleString();

    let pct = 0;
    if (total > 0) pct = Math.min(100, Math.round((used / total) * 100));
    if (elCreditsProgressFill) elCreditsProgressFill.style.width = `${pct}%`;

    if (elAlertCreditsZero) {
      elAlertCreditsZero.style.display = remaining <= 0 ? 'flex' : 'none';
    }
  }

  // ── Terms Acceptance Check ─────────────────────────────────────────────────

  function termsAreCurrentlySatisfied(profile) {
    return (
      profile &&
      profile.terms_accepted === true &&
      profile.terms_version === CURRENT_TERMS_VERSION
    );
  }

  // ── Load User Profile (with cache) ─────────────────────────────────────────

  async function loadUserProfile(session, forceRefresh = false) {
    showView(elLoading);

    const userId = session.user.id;

    // Try cache first — avoids Edge Function call on tab focus / reconnect
    if (!forceRefresh) {
      const cached = getCachedProfile(userId);
      if (cached) {
        currentProfile = cached;
        if (termsAreCurrentlySatisfied(cached)) {
          renderProfile(cached, session.user);
          showView(elMainView);
        } else {
          showView(elTermsView);
        }
        return;
      }
    }

    // No valid cache — call Edge Function
    try {
      const res = await callDashboardApi('get_profile');
      if (res && res.profile) {
        setCachedProfile(userId, res.profile);
        if (termsAreCurrentlySatisfied(res.profile)) {
          renderProfile(res.profile, session.user);
          showView(elMainView);
        } else {
          showView(elTermsView);
        }
      } else {
        throw new Error('Unable to retrieve account profile.');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // On fetch failure show a minimal fallback only for the admin
      const isAdmin = session.user.email === 'lawglitch@gmail.com';
      const fallbackProfile = {
        email: session.user.email,
        account_active: isAdmin,
        plan: isAdmin ? 'pro' : 'free',
        credits_remaining: isAdmin ? 1000 : 0,
        credits_used: 0,
        gateway_key_active: false,
        terms_accepted: false, // force terms screen on fallback
        terms_version: null,
      };
      currentProfile = fallbackProfile;
      // Don't bypass terms on error — show terms view
      showView(elTermsView);
      if (elTermsError) {
        elTermsError.textContent = 'Could not connect to account service. Please accept the terms to continue.';
        elTermsError.style.display = 'block';
      }
    }
  }

  // ── Terms Onboarding Handlers ──────────────────────────────────────────────

  function initTermsView() {
    // Keep Accept button disabled until mandatory checkbox is checked
    if (chkTermsMandatory && btnAcceptTerms) {
      chkTermsMandatory.addEventListener('change', () => {
        btnAcceptTerms.disabled = !chkTermsMandatory.checked;
      });
      btnAcceptTerms.disabled = true; // ensure disabled on init
    }

    if (btnAcceptTerms) {
      btnAcceptTerms.addEventListener('click', handleAcceptTerms);
    }

    if (btnTermsSignOut) {
      btnTermsSignOut.addEventListener('click', async () => {
        if (currentSession) clearCachedProfile(currentSession.user.id);
        await supabase.auth.signOut();
      });
    }
  }

  async function handleAcceptTerms() {
    if (!chkTermsMandatory || !chkTermsMandatory.checked) return;

    const marketingConsent = chkTermsMarketing ? chkTermsMarketing.checked : false;

    // Loading state
    btnAcceptTerms.disabled = true;
    btnAcceptTerms.textContent = 'Saving…';
    if (elTermsError) elTermsError.style.display = 'none';

    try {
      const res = await callDashboardApi('accept_terms', { marketing_consent: marketingConsent });

      if (!res || !res.success || !res.profile) {
        throw new Error('Acceptance was not confirmed by the server.');
      }

      // Update cache with the confirmed profile
      const userId = currentSession.user.id;
      setCachedProfile(userId, res.profile);

      // Only navigate after DB confirms the write
      renderProfile(res.profile, currentSession.user);
      showView(elMainView);

    } catch (err) {
      console.error('accept_terms error:', err);
      if (elTermsError) {
        elTermsError.textContent = err.message || 'Failed to save your acceptance. Please try again.';
        elTermsError.style.display = 'block';
      }
      // Re-enable button so user can retry
      btnAcceptTerms.disabled = !chkTermsMandatory.checked;
      btnAcceptTerms.textContent = 'Accept & Continue';
    }
  }

  // ── Gateway Key Handlers ───────────────────────────────────────────────────

  async function handleGenerateKey() {
    if (!currentProfile || !currentProfile.account_active) {
      showGatewayFeedback('Your account must be active before generating a gateway credential.', true);
      return;
    }

    if (!termsAreCurrentlySatisfied(currentProfile)) {
      showGatewayFeedback('Please accept the current Terms & Conditions before generating a credential.', true);
      return;
    }

    if (currentProfile.gateway_key_active) {
      const confirmed = window.confirm(
        'Generating a new password will immediately replace and revoke your existing one. Any active Alfie sessions using the old password will stop working. Continue?'
      );
      if (!confirmed) return;
    }

    btnGenerateKey.disabled = true;
    btnGenerateKey.textContent = 'Generating…';

    try {
      const res = await callDashboardApi('generate_key');
      if (res && res.key) {
        if (elCredPassword) elCredPassword.value = res.key;
        currentProfile.gateway_key_active = true;
        // Update cache
        if (currentSession) setCachedProfile(currentSession.user.id, currentProfile);
        if (btnRevokeKey) btnRevokeKey.disabled = false;
        showGatewayFeedback('New gateway password generated successfully! Please copy it now.', false);
        const warning = document.getElementById('password-security-warning');
        if (warning) warning.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(res.error || 'Failed to generate key');
      }
    } catch (err) {
      showGatewayFeedback(err.message || 'Error generating gateway key.', true);
    } finally {
      btnGenerateKey.disabled = false;
      btnGenerateKey.innerHTML = '<span style="font-size:1.1rem; line-height:1;">+</span> Generate Password';
    }
  }

  async function handleRevokeKey() {
    if (!currentProfile || !currentProfile.gateway_key_active) return;

    const confirmed = window.confirm(
      'Are you sure you want to revoke your Alfie gateway password? Alfie will no longer be able to route agent requests until a new password is generated.'
    );
    if (!confirmed) return;

    btnRevokeKey.disabled = true;
    btnRevokeKey.textContent = 'Revoking…';

    try {
      const res = await callDashboardApi('revoke_key');
      if (res && res.success) {
        if (elCredPassword) elCredPassword.value = 'No active password generated';
        currentProfile.gateway_key_active = false;
        // Update cache
        if (currentSession) setCachedProfile(currentSession.user.id, currentProfile);
        if (btnRevokeKey) btnRevokeKey.disabled = true;
        showGatewayFeedback('Gateway credential revoked successfully.', false);
      } else {
        throw new Error(res.error || 'Failed to revoke key');
      }
    } catch (err) {
      showGatewayFeedback(err.message || 'Error revoking key.', true);
      if (btnRevokeKey) btnRevokeKey.disabled = false;
    } finally {
      if (btnRevokeKey) btnRevokeKey.textContent = 'Revoke';
    }
  }

  // ── Copy Buttons ───────────────────────────────────────────────────────────

  function setupCopyButtons() {
    document.querySelectorAll('[data-copy-target]').forEach(btn => {
      btn.addEventListener('click', function () {
        const input = document.getElementById(btn.getAttribute('data-copy-target'));
        if (!input || !input.value) return;
        navigator.clipboard.writeText(input.value).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.borderColor = 'var(--accent)';
          btn.style.color = 'var(--accent)';
          setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2000);
        }).catch(console.error);
      });
    });

    document.querySelectorAll('[data-copy-text]').forEach(btn => {
      btn.addEventListener('click', function () {
        const text = btn.getAttribute('data-copy-text');
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.borderColor = 'var(--accent)';
          btn.style.color = 'var(--accent)';
          setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2000);
        });
      });
    });

    const btnCopyTableUser = document.getElementById('btn-copy-table-username');
    if (btnCopyTableUser) {
      btnCopyTableUser.addEventListener('click', function () {
        if (!elCredUsername || !elCredUsername.value) return;
        navigator.clipboard.writeText(elCredUsername.value).then(() => {
          btnCopyTableUser.textContent = 'Copied!';
          setTimeout(() => { btnCopyTableUser.textContent = 'Copy'; }, 2000);
        });
      });
    }
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', async function () {
    supabase = initSupabase();
    setupCopyButtons();
    initTermsView();

    if (!supabase) return;
    if (!supabase) {
      showView(elAuthView);
      return;
    }

    // Check existing session on page load
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      currentSession = session;
      await loadUserProfile(session);
    } else {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (session) {
        currentSession = session;
        await loadUserProfile(session);
      } else {
        showView(elAuthView);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      showView(elAuthView);
      showError(err.message || 'Unable to verify authentication session. Please try signing in again.');
    }

    // Listen for auth state changes (login / logout / token refresh)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const isNewSession = !currentSession || currentSession.user.id !== session.user.id;
        currentSession = session;
        // Only reload profile on a genuinely new session / sign-in
        // TOKEN_REFRESHED fires frequently — the cache handles it
        if (isNewSession || event === 'SIGNED_IN') {
          await loadUserProfile(session);
        }
      } else {
        if (currentSession) clearCachedProfile(currentSession.user.id);
        currentSession = null;
        currentProfile = null;
        showView(elAuthView);
      }
    });

    // Google Login
    if (btnLoginGoogle) {
      btnLoginGoogle.addEventListener('click', async () => {
        const redirectUrl = window.location.href.split('#')[0].split('?')[0];
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: redirectUrl },
        });
        if (error) showError(error.message);
      });
    }

    // GitHub Login
    if (btnLoginGithub) {
      btnLoginGithub.addEventListener('click', async () => {
        const redirectUrl = window.location.href.split('#')[0].split('?')[0];
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: { redirectTo: redirectUrl },
        });
        if (error) showError(error.message);
      });
    }

    // Refresh Profile (bypasses browser cache)
    if (btnRefreshProfile) {
      btnRefreshProfile.addEventListener('click', async () => {
        if (!currentSession) return;
        btnRefreshProfile.disabled = true;
        btnRefreshProfile.textContent = 'Syncing…';
        try {
          await loadUserProfile(currentSession, true);
        } finally {
          btnRefreshProfile.disabled = false;
          btnRefreshProfile.textContent = 'Refresh';
        }
      });
    }

    // Sign Out (main dashboard)
    if (btnSignOut) {
      btnSignOut.addEventListener('click', async () => {
        if (currentSession) clearCachedProfile(currentSession.user.id);
        await supabase.auth.signOut();
      });
    }

    // Key Management
    if (btnGenerateKey) btnGenerateKey.addEventListener('click', handleGenerateKey);
    if (btnRevokeKey)   btnRevokeKey.addEventListener('click', handleRevokeKey);
  });
})();
