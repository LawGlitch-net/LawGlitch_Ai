/**
 * LawGlitch — Shared Installation Modal Component
 * Accessible, keyboard-navigable modal for choosing products and verified browser store links.
 * Backed by window.LAWGLITCH_PRODUCTS registry.
 */

(function () {
  'use strict';

  let modalEl = null;
  let lastFocusedEl = null;

  function getBasePath() {
    // Detect whether we are in a subfolder (e.g. /products/, /terms/, /dashboard/)
    const path = window.location.pathname;
    if (path.includes('/products/') || path.includes('/terms/') || path.includes('/legal/') || path.includes('/dashboard/')) {
      return '../';
    }
    return './';
  }

  function createModal() {
    if (document.getElementById('lawglitch-install-modal')) {
      return document.getElementById('lawglitch-install-modal');
    }

    const basePath = getBasePath();
    const products = window.LAWGLITCH_PRODUCTS || [];
    const alfie = products.find(p => p.id === 'alfie') || (products.length ? products[0] : null);

    const modal = document.createElement('div');
    modal.id = 'lawglitch-install-modal';
    modal.className = 'modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-install-title');
    modal.setAttribute('aria-describedby', 'modal-install-desc');
    modal.style.display = 'none';

    let browsersHtml = '';
    if (alfie && alfie.install) {
      const bList = [alfie.install.edge, alfie.install.firefox, alfie.install.chrome];
      browsersHtml = bList.map(b => {
        if (!b) return '';
        const isLive = b.status === 'available' && b.url && b.url.startsWith('https://');
        const iconPath = basePath + b.icon.replace(/^\.?\/?/, '');

        if (isLive) {
          return `
            <a href="${b.url}" class="browser-choice-card is-active" target="_blank" rel="noopener noreferrer" aria-label="Install Alfie for ${b.label} (${b.badge})">
              <div class="browser-choice-icon-wrap">
                <img src="${iconPath}" alt="${b.label} icon" width="40" height="40">
              </div>
              <div class="browser-choice-info">
                <div class="browser-choice-header">
                  <h4 class="browser-choice-name">${b.label}</h4>
                  <span class="status-pill status-pill-success">${b.badge}</span>
                </div>
                <p class="browser-choice-store">${b.storeName}</p>
                <p class="browser-choice-note">${b.note}</p>
              </div>
              <div class="browser-choice-action">
                <span class="btn btn-primary btn-sm">
                  Get Extension
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </span>
              </div>
            </a>
          `;
        } else {
          const pillClass = b.status === 'beta' ? 'status-pill-warning' : 'status-pill-neutral';
          return `
            <div class="browser-choice-card is-disabled" role="region" aria-label="${b.label} (${b.badge})">
              <div class="browser-choice-icon-wrap">
                <img src="${iconPath}" alt="${b.label} icon" width="40" height="40">
              </div>
              <div class="browser-choice-info">
                <div class="browser-choice-header">
                  <h4 class="browser-choice-name">${b.label}</h4>
                  <span class="status-pill ${pillClass}">${b.badge}</span>
                </div>
                <p class="browser-choice-store">${b.storeName}</p>
                <p class="browser-choice-note">${b.note}</p>
              </div>
              <div class="browser-choice-action">
                <span class="btn btn-disabled btn-sm" aria-disabled="true">
                  ${b.badge}
                </span>
              </div>
            </div>
          `;
        }
      }).join('');
    }

    const alfieIcon = basePath + (alfie ? alfie.icon.replace(/^\.?\/?/, '') : 'assets/images/alfie-logo/icon-128.png');

    modal.innerHTML = `
      <div class="modal-dialog" role="document">
        <div class="modal-header">
          <div class="modal-brand-badge">
            <img src="${alfieIcon}" alt="Alfie" width="28" height="28">
            <div class="modal-brand-text">
              <span class="modal-eyebrow">A LawGlitch Product</span>
              <h3 id="modal-install-title" class="modal-title">Get Alfie</h3>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-trigger" aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p id="modal-install-desc" class="modal-desc">
            Choose your browser to install Alfie directly from official extension stores. The base extension is free for personal use and runs entirely locally.
          </p>

          <div class="browser-choices-list">
            ${browsersHtml}
          </div>

          <div class="modal-footer-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Microsoft Edge and Mozilla Firefox are available now. Google Chrome is coming soon.</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
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

    // Trap focus
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      const focusables = modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
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

    modalEl.style.display = 'flex';
    document.body.classList.add('modal-open');

    // Focus the first interactive element or close button
    const firstActive = modalEl.querySelector('a.is-active, #modal-close-trigger');
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

  // Wire up all trigger buttons on DOMContentLoaded
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

