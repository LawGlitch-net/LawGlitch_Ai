/**
 * LawGlitch — Shared Installation Modal Component
 * JSON-driven browser installation options, "Coming Soon" states,
 * and Developer Mode manual installation walkthrough.
 */

(function () {
  'use strict';

  let modalEl = null;
  let lastFocusedEl = null;

  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/products/') || path.includes('/terms/') || path.includes('/legal/') || path.includes('/custom-integrations/') || path.includes('/dashboard/') || path.includes('/blog/')) {
      return '../';
    }
    return './';
  }

  const defaultBrowsers = [
    {
      name: "Google Chrome",
      icon: "assets/images/browser-chrome.svg",
      url: "",
      available: false
    },
    {
      name: "Microsoft Edge",
      icon: "assets/images/browser-edge.svg",
      url: "",
      available: false
    },
    {
      name: "Brave",
      icon: "assets/images/browser-brave.svg",
      url: "",
      available: false
    },
    {
      name: "Other Chromium",
      icon: "assets/images/chromium.svg",
      url: "",
      available: false
    }
  ];

  async function loadBrowsersConfig() {
    const basePath = getBasePath();
    try {
      const res = await fetch(basePath + 'assets/data/browsers.json');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.browsers) && data.browsers.length > 0) {
          return data.browsers;
        }
      }
    } catch (e) {
      // fallback to defaultBrowsers
    }
    return defaultBrowsers;
  }

  function renderBrowserList(browsers, container) {
    const basePath = getBasePath();
    container.innerHTML = '';

    browsers.forEach(b => {
      const item = document.createElement('div');
      item.className = 'browser-install-card';
      item.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        margin-bottom: 10px;
        transition: border-color 0.2s ease;
      `;

      const left = document.createElement('div');
      left.style.cssText = 'display:flex; align-items:center; gap:12px;';

      const iconPath = b.icon ? (b.icon.startsWith('http') ? b.icon : basePath + b.icon) : (basePath + 'assets/images/chromium.svg');
      left.innerHTML = `
        <img src="${iconPath}" alt="${b.name}" width="26" height="26" style="flex-shrink:0;">
        <span style="font-weight:600; color:var(--text-main); font-size:0.95rem;">${b.name}</span>
      `;

      const right = document.createElement('div');
      if (b.available && b.url && b.url.trim() !== '') {
        right.innerHTML = `
          <a href="${b.url}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
            Install
          </a>
        `;
      } else {
        right.innerHTML = `
          <button type="button" class="btn btn-sm" disabled style="opacity:0.55; cursor:not-allowed; background:rgba(255,255,255,0.06); color:var(--text-muted); border:1px solid rgba(255,255,255,0.1);">
            Coming Soon
          </button>
        `;
      }

      item.appendChild(left);
      item.appendChild(right);
      container.appendChild(item);
    });
  }

  function createModal() {
    if (document.getElementById('lawglitch-install-modal')) {
      return document.getElementById('lawglitch-install-modal');
    }

    const basePath = getBasePath();
    const modal = document.createElement('div');
    modal.id = 'lawglitch-install-modal';
    modal.className = 'modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-install-title');
    modal.setAttribute('aria-describedby', 'modal-install-desc');
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-lg" role="document">
        <div class="modal-header">
          <div class="modal-brand-badge">
            <img src="${basePath}assets/images/alfie-logo/icon-128.png" alt="Alfie" width="28" height="28">
            <div class="modal-brand-text">
              <span class="modal-eyebrow">A LawGlitch Product</span>
              <h3 id="modal-install-title" class="modal-title">Install Alfie for Browser</h3>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-trigger" aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body modal-body-scrollable">
          <p id="modal-install-desc" class="modal-desc" style="margin-bottom:18px;">
            Select your preferred Chromium-based browser to install the official extension, or install directly via Developer Mode below.
          </p>

          <!-- JSON-driven Browser list container -->
          <div id="modal-browser-list" style="margin-bottom:20px;">
            <div style="text-align:center; padding:15px; color:var(--text-muted); font-size:0.9rem;">
              Loading browser configuration...
            </div>
          </div>

          <!-- Developer Installation Alternative Notice -->
          <div style="background:rgba(2, 132, 199, 0.08); border:1px solid rgba(2, 132, 199, 0.25); border-radius:8px; padding:14px 16px; font-size:0.9rem; color:var(--text-secondary); margin-bottom:18px;">
            Using another Chromium-based browser? You can also install Alfie manually through Developer Mode.
            <button type="button" id="btn-toggle-dev-instructions" style="background:none; border:none; color:var(--accent); font-weight:600; text-decoration:underline; cursor:pointer; padding:0; margin-left:4px; font-size:inherit;">
              Click here
            </button>
          </div>

          <!-- Manual / Developer Unpacked Walkthrough (mounted conditionally or initially open) -->
          <div id="modal-instruction-mount"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Populate browser list
    const browserListContainer = modal.querySelector('#modal-browser-list');
    loadBrowsersConfig().then(browsers => {
      renderBrowserList(browsers, browserListContainer);
    });

    // Render instruction and download component inside modal
    const mount = modal.querySelector('#modal-instruction-mount');
    if (window.AlfieInstruction && window.AlfieInstruction.renderSection) {
      window.AlfieInstruction.renderSection(mount);
    }

    // Developer mode toggle
    const toggleDevBtn = modal.querySelector('#btn-toggle-dev-instructions');
    if (toggleDevBtn && mount) {
      toggleDevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Close Button
    const closeBtn = modal.querySelector('#modal-close-trigger');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') {
        closeModal();
      }
    });

    return modal;
  }

  function openModal(triggerEl) {
    if (triggerEl) {
      lastFocusedEl = triggerEl;
    } else {
      lastFocusedEl = document.activeElement;
    }

    if (!modalEl) {
      modalEl = createModal();
    }

    // Refresh version text if available
    if (window.AlfieInstruction && window.AlfieInstruction.initVersion) {
      window.AlfieInstruction.initVersion();
    }

    modalEl.style.display = 'flex';
    document.body.classList.add('modal-open');

    const firstActive = modalEl.querySelector('button.js-force-download, #modal-close-trigger');
    if (firstActive) {
      firstActive.focus();
    }
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.style.display = 'none';
    document.body.classList.remove('modal-open');

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  // Expose global controller
  window.LawGlitchInstaller = {
    open: openModal,
    close: closeModal
  };

  document.addEventListener('DOMContentLoaded', function () {
    modalEl = createModal();

    document.querySelectorAll('[data-open-install], .js-open-install').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn);
      });
    });
  });

})();
