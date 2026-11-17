/**
 * LawGlitch — Shared Installation Modal Component
 * Chromium-only download modal with interactive code instruction animation,
 * forced destination file picker, and migration guide.
 */

(function () {
  'use strict';

  let modalEl = null;
  let lastFocusedEl = null;

  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/products/') || path.includes('/terms/') || path.includes('/legal/') || path.includes('/custom-integrations/')) {
      return '../';
    }
    return './';
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
              <h3 id="modal-install-title" class="modal-title">Get Alfie for Chromium</h3>
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
          <p id="modal-install-desc" class="modal-desc">
            Download the official Alfie extension package for Chromium-based browsers (Chrome, Edge, Brave, Opera, Vivaldi, Arc). Follow the step-by-step walkthrough below to install unpacked in seconds.
          </p>

          <div id="modal-instruction-mount"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Render instruction and download component inside modal
    const mount = modal.querySelector('#modal-instruction-mount');
    if (window.AlfieInstruction && window.AlfieInstruction.renderSection) {
      window.AlfieInstruction.renderSection(mount);
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
