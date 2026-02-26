/**
 * LawGlitch Static App — Core JavaScript
 * ========================================
 * Handles: header scroll, mobile menu, modals, forms, FAQ, admin, rate limiting, theme toggle
 */

// ===== Supabase Client =====
let supabaseClient = null;
function initSupabase() {
  if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(
      LAWGLITCH_CONFIG.SUPABASE_URL,
      LAWGLITCH_CONFIG.SUPABASE_ANON_KEY
    );
  }
}

// ===== Rate Limiter =====
const RateLimiter = {
  _key: "lg_rate_limit",
  _getStore() {
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return [];
      const entries = JSON.parse(raw);
      const now = Date.now();
      return entries.filter((t) => now - t < LAWGLITCH_CONFIG.RATE_LIMIT.WINDOW_MS);
    } catch {
      return [];
    }
  },
  canSubmit() {
    return this._getStore().length < LAWGLITCH_CONFIG.RATE_LIMIT.MAX_SUBMISSIONS;
  },
  record() {
    const entries = this._getStore();
    entries.push(Date.now());
    localStorage.setItem(this._key, JSON.stringify(entries));
  },
  remaining() {
    return LAWGLITCH_CONFIG.RATE_LIMIT.MAX_SUBMISSIONS - this._getStore().length;
  },
};

// ===== Theme Toggle =====
function initTheme() {
  const savedTheme = localStorage.getItem("lg_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  updateThemeIcon();

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("lg_theme")) {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      updateThemeIcon();
    }
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  let newTheme;
  if (!currentTheme) {
    // No explicit theme set, using system preference
    newTheme = prefersDark ? "light" : "dark";
  } else if (currentTheme === "dark") {
    newTheme = "light";
  } else {
    newTheme = "dark";
  }

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("lg_theme", newTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute("data-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (!theme && prefersDark);

  const icon = document.getElementById("theme-icon");
  const iconMobile = document.getElementById("theme-icon-mobile");

  if (icon) {
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
  if (iconMobile) {
    iconMobile.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
}

// ===== Header Scroll =====
function initHeader() {
  const header = document.querySelector(".header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("mobile-menu-icon");
  if (!menu || !icon) return;

  menu.classList.toggle("open");
  const isOpen = menu.classList.contains("open");
  icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
}

function initMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      const icon = document.getElementById("mobile-menu-icon");
      if (icon) icon.className = "fas fa-bars";
    });
  });
}

// ===== Modals =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    // Load iframe src for demo modal
    const iframe = modal.querySelector("iframe[data-src]");
    if (iframe && !iframe.src) {
      iframe.src = iframe.dataset.src;
    }
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function initModals() {
  // Close on overlay click
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });
  // Close buttons
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = btn.closest(".modal-overlay");
      if (overlay) {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });
  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach((m) => {
        m.classList.remove("open");
      });
      document.body.style.overflow = "";
    }
  });
}

// ===== FAQ Accordion =====
function initFAQ() {
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      // Close all
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
      // Toggle current
      if (!wasOpen) item.classList.add("open");
    });
  });
}

// ===== Book Trial Form =====
function initBookTrialForm() {
  const form = document.getElementById("book-trial-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Clear errors
    form.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));

    // Rate limit check
    if (!RateLimiter.canSubmit()) {
      showToast("Too many submissions. Please try again later.", "error");
      return;
    }

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const company = form.querySelector('[name="company"]').value.trim();
    const role = form.querySelector('[name="role"]').value.trim();
    const useCase = form.querySelector('[name="useCase"]').value.trim();
    const gdpr = form.querySelector('[name="gdpr"]').checked;

    // Validate
    let hasError = false;
    if (!name) { setError(form, "name", "Name is required"); hasError = true; }
    if (!email || !email.includes("@")) { setError(form, "email", "Valid email required"); hasError = true; }
    if (!company) { setError(form, "company", "Company is required"); hasError = true; }
    if (!gdpr) { setError(form, "gdpr", "Consent is required"); hasError = true; }
    if (hasError) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Submitting…";

    if (!supabaseClient) {
      showToast("Backend not configured. Check config.js", "error");
      btn.disabled = false;
      btn.textContent = "Submit";
      return;
    }

    const { error } = await supabaseClient.from("demo_bookings").insert({
      full_name: name,
      email,
      company,
      role: role || null,
      use_case: useCase || null,
    });

    btn.disabled = false;
    btn.textContent = "Submit";

    if (error) {
      showToast("Something went wrong. Please try again.", "error");
      return;
    }

    RateLimiter.record();
    // Show success
    closeModal("book-trial-modal");
    showToast("Thank you! Check your email for confirmation.");
    form.reset();
  });
}

// ===== Newsletter Form =====
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!RateLimiter.canSubmit()) {
      showToast("Too many submissions. Please try again later.", "error");
      return;
    }

    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email.includes("@")) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "…";

    if (!supabaseClient) {
      showToast("Backend not configured.", "error");
      btn.disabled = false;
      btn.textContent = "Subscribe";
      return;
    }

    const { error } = await supabaseClient.from("waitlist").insert({
      email,
      source: "footer_newsletter",
    });

    btn.disabled = false;
    btn.textContent = "Subscribe";

    if (error) {
      if (error.code === "23505") {
        showToast("Already subscribed!");
      } else {
        showToast("Something went wrong.", "error");
      }
      return;
    }

    RateLimiter.record();
    showToast("Subscribed! You'll hear from us soon.");
    form.reset();
  });
}

// ===== Admin =====
// Store the password temporarily for Edge Function calls
let adminPassword = null;

function initAdmin() {
  const loginForm = document.getElementById("admin-login-form");
  const dashboard = document.getElementById("admin-dashboard");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pw = loginForm.querySelector('input[type="password"]').value;
    const err = loginForm.querySelector(".form-error");
    const btn = loginForm.querySelector('button[type="submit"]');

    // Clear previous error
    if (err) err.textContent = "";

    // Disable button during authentication
    btn.disabled = true;
    btn.textContent = "Authenticating…";

    // Store password for subsequent Edge Function calls
    adminPassword = pw;

    // Verify credentials with Edge Function and fetch data
    const result = await verifyAdminPassword(pw);

    btn.disabled = false;
    btn.textContent = "Enter";

    if (result.success) {
      loginForm.closest(".admin-login").style.display = "none";
      if (dashboard) {
        dashboard.style.display = "block";
        // Use the data returned from verification
        adminBookings = result.bookings || [];
        adminWaitlist = result.waitlist || [];
        updateAdminStats();
        renderBookings("all");
        renderWaitlist(); // ← NEW
      }
    } else {
      if (err) err.textContent = result.error || "Incorrect password";
      adminPassword = null;
    }
  });

  // Refresh button
  const refreshBtn = document.getElementById("admin-refresh");
  if (refreshBtn) refreshBtn.addEventListener("click", fetchAdminData);

  // Export CSV
  const exportBtn = document.getElementById("admin-export");
  if (exportBtn) exportBtn.addEventListener("click", exportCSV);

  // Filters
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderBookings(btn.dataset.filter);
    });
  });
}

let adminBookings = [];
let adminWaitlist = [];

// Verify admin password with Edge Function and return data
async function verifyAdminPassword(password) {
  const edgeUrl = LAWGLITCH_CONFIG.EDGE_FUNCTION_URL;
  console.log("Verifying admin password, calling:", edgeUrl);

  try {
    if (!supabaseClient) initSupabase();

    const { data, error } = await (supabaseClient?.functions || supabaseClient).invoke(
      "admin-data",
      {
        body: {
          password: password,
          action: "get",
        },
        headers: {
          "Content-Type": "application/json",
          apikey: LAWGLITCH_CONFIG.SUPABASE_ANON_KEY,
          Authorization: "Bearer " + LAWGLITCH_CONFIG.SUPABASE_ANON_KEY,
        },
      }
    );

    if (error) {
      console.error("Invoke error:", error);
      return { success: false, error: error.message || "Server error" };
    }

    console.log("Response data:", data);

    if (data?.error) {
      return { success: false, error: data.error };
    }

    return {
      success: true,
      bookings: data?.bookings || [],
      waitlist: data?.waitlist || [],
    };
  } catch (err) {
    console.error("Auth error:", err);
    return { success: false, error: "Connection error: " + err.message };
  }
}

async function fetchAdminData() {
  if (!adminPassword) {
    showToast("Please log in first.", "error");
    return;
  }

  const edgeUrl = LAWGLITCH_CONFIG.EDGE_FUNCTION_URL;
  console.log("Fetching admin data from:", edgeUrl);

  try {
    if (!supabaseClient) initSupabase();

    const { data, error } = await (supabaseClient?.functions || supabaseClient).invoke(
      "admin-data",
      {
        body: {
          password: adminPassword,
          action: "get",
        },
        headers: {
          "Content-Type": "application/json",
          apikey: LAWGLITCH_CONFIG.SUPABASE_ANON_KEY,
          Authorization: "Bearer " + LAWGLITCH_CONFIG.SUPABASE_ANON_KEY,
        },
      }
    );

    if (error) throw new Error(error.message || "Server error");

    adminBookings = data?.bookings || [];
    adminWaitlist = data?.waitlist || [];
    updateAdminStats();
    renderBookings("all");
    renderWaitlist(); // ← NEW
    showToast("Data refreshed successfully");
  } catch (err) {
    console.error("Fetch error:", err);
    showToast("Failed to fetch data: " + err.message, "error");
  }
}

function updateAdminStats() {
  const els = document.querySelectorAll(".admin-stat .value");
  if (els.length >= 4) {
    els[0].textContent = adminBookings.length;
    els[1].textContent = adminBookings.filter((b) => b.status === "pending").length;
    els[2].textContent = adminBookings.filter((b) => b.status === "confirmed").length;
    els[3].textContent = adminWaitlist.length;
  }
}

function renderBookings(filter) {
  const tbody = document.getElementById("bookings-tbody");
  if (!tbody) return;
  const list = filter === "all" ? adminBookings : adminBookings.filter((b) => b.status === filter);
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--muted-foreground)">No bookings found</td></tr>';
    return;
  }
  tbody.innerHTML = list
    .map(
      (b) => `
    <tr>
      <td style="font-weight:500">${esc(b.full_name)}</td>
      <td class="text-muted">${esc(b.email)}</td>
      <td class="text-muted">${esc(b.company)}</td>
      <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      <td class="text-muted text-xs">${new Date(b.created_at).toLocaleDateString()}</td>
      <td>
        ${b.status !== "confirmed" ? `<button class="btn btn-ghost btn-sm" onclick="updateBookingStatus('${b.id}','confirmed')">Confirm</button>` : ""}
        ${b.status !== "cancelled" ? `<button class="btn btn-ghost btn-sm btn-destructive-text" onclick="updateBookingStatus('${b.id}','cancelled')">Cancel</button>` : ""}
      </td>
    </tr>
  `
    )
    .join("");
}

// ← NEW: Render newsletter subscribers table
function renderWaitlist() {
  const tbody = document.getElementById("waitlist-tbody");
  if (!tbody) return;
  if (adminWaitlist.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:2rem;color:var(--muted-foreground)">No subscribers yet</td></tr>';
    return;
  }
  tbody.innerHTML = adminWaitlist
    .map(
      (w) => `
    <tr>
      <td style="font-weight:500">${esc(w.email)}</td>
      <td class="text-muted">${esc(w.source)}</td>
      <td class="text-muted text-xs">${new Date(w.created_at).toLocaleDateString()}</td>
    </tr>
  `
    )
    .join("");
}

async function updateBookingStatus(id, status) {
  if (!adminPassword) {
    showToast("Session expired. Please log in again.", "error");
    return;
  }

  const edgeUrl = LAWGLITCH_CONFIG.EDGE_FUNCTION_URL;
  console.log("Updating booking status:", { id, status });

  try {
    if (!supabaseClient) initSupabase();

    const { data, error } = await (supabaseClient?.functions || supabaseClient).invoke(
      "admin-data",
      {
        body: {
          password: adminPassword,
          action: "update_status",
          bookingId: id,
          status: status,
        },
        headers: {
          "Content-Type": "application/json",
          apikey: LAWGLITCH_CONFIG.SUPABASE_ANON_KEY,
          Authorization: "Bearer " + LAWGLITCH_CONFIG.SUPABASE_ANON_KEY,
        },
      }
    );

    console.log("Update response:", data);

    if (error) {
      throw new Error(error.message || (data && data.error) || "Server error");
    }

    if (data && data.error) {
      throw new Error(data.error);
    }

    showToast("Booking " + status + " successfully");
    fetchAdminData();
  } catch (err) {
    console.error("Update error:", err);
    showToast("Failed to update: " + err.message, "error");
  }
}

function exportCSV() {
  const headers = ["Name", "Email", "Company", "Role", "Use Case", "Status", "Date"];
  const rows = adminBookings.map((b) => [
    b.full_name, b.email, b.company, b.role || "", b.use_case || "", b.status, b.created_at,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lawglitch-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== Toast =====
function showToast(msg, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; z-index: 200;
    padding: 0.875rem 1.25rem; border-radius: 0.625rem;
    font-size: 14px; font-weight: 500; max-width: 24rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    background: ${type === "error" ? "var(--destructive)" : "var(--foreground)"};
    color: ${type === "error" ? "var(--destructive-foreground)" : "var(--background)"};
    animation: toastIn 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ===== Helpers =====
function setError(form, name, msg) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) {
    let err = input.parentElement.querySelector(".form-error");
    if (!err) {
      err = document.createElement("p");
      err.className = "form-error";
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// ===== Toast animation =====
const style = document.createElement("style");
style.textContent = `@keyframes toastIn { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
document.head.appendChild(style);

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSupabase();
  initHeader();
  initMobileMenu();
  initModals();
  initFAQ();
  initBookTrialForm();
  initNewsletterForm();
  initAdmin();
});

// Make functions globally accessible for onclick handlers
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.openModal = openModal;
window.closeModal = closeModal;
window.updateBookingStatus = updateBookingStatus;
