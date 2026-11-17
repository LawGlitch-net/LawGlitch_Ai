// contact.js — LawGlitch Contact Form → Supabase
// Set your Supabase publishable key in contact/supabase-config.js:
//   window.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_...';

(function () {
  'use strict';

  const SUPABASE_URL = 'https://pxwbumtpnzbbqzqhnsow.supabase.co';
  const TABLE = 'contact_submissions';

  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-success');
  const errorEl = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  // ---- Validation helpers ----
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone) {
    // Allows +, digits, spaces, hyphens, parentheses, dots; 7‑20 characters total
    return /^\+?[0-9\s\-().]{7,20}$/.test(phone);
  }

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorEl.style.display = 'none';

    const anonKey = window.SUPABASE_PUBLISHABLE_KEY; if (!anonKey || anonKey === 'PASTE_YOUR_PUBLISHABLE_KEY_HERE') {
      showError('Configuration error: Supabase publishable key is not set. Please contact us at lawglitch@outlook.com.');
      return;
    }

    const name = form.querySelector('#f-name').value.trim();
    const email = form.querySelector('#f-email').value.trim();
    const phone = form.querySelector('#f-phone').value.trim() || null;
    const company = form.querySelector('#f-company').value.trim();
    const role = form.querySelector('#f-role').value.trim();
    const use_case = form.querySelector('#f-usecase').value.trim();
    const consent = form.querySelector('#f-consent').checked;

    if (!name || !email || !company || !role || !use_case) {
      showError('Please fill in all required fields.');
      return;
    }
    if (!consent) {
      showError('You must accept the consent statement to submit this form.');
      return;
    }
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }
    if (phone && !isValidPhone(phone)) {
      showError('Please enter a valid phone number.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          role,
          use_case,
          consented_at: new Date().toISOString()
        })
      });

      if (res.ok || res.status === 201) {
        form.style.display = 'none';
        successEl.style.display = 'block';
      } else {
        const errData = await res.json().catch(() => ({}));
        showError(errData.message || 'Something went wrong. Please try again or email us at lawglitch@outlook.com.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    } catch (err) {
      showError('Network error. Please check your connection and try again, or email us at lawglitch@outlook.com.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
