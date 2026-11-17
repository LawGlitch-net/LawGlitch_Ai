/**
 * LawGlitch — Code-Crafted Installation Instruction Animation, Version Picker & Chromium Downloader
 * 100% vector, HTML/CSS/JS simulation of:
 * 1. Download file via download button (alfie-chromium.zip)
 * 2. Native File System Manager (Windows File Explorer)
 * 3. Extract ZIP file (alfie)
 * 4. Chromium browser //extensions + enable Developer mode
 * 5. Load unpacked extracted folder (alfie)
 *
 * Plus:
 * - Dynamic target-bounding-rect cursor tracking (flawless on both desktop and mobile)
 * - Multi-version popup modal from latest.json
 * - Forced-destination download handler via File System Access API
 */

(function (root) {
  'use strict';

  let latestVersionData = {
    version: '1.0.1',
    url: 'https://github.com/LawGlitch-net/Alfie-download/releases/download/v1.0.1/alfie-chromium-v1.0.1.zip',
    versions: [
      {
        version: '1.0.1',
        release_tag: 'v1.0.1 (Latest)',
        badge: 'Latest Release',
        released_at: '2026-11-02',
        url: 'https://github.com/LawGlitch-net/Alfie-download/releases/download/v1.0.1/alfie-chromium-v1.0.1.zip',
        release_notes: 'experiment'
      },
      {
        version: '1.0.0',
        release_tag: 'v1.0.0',
        badge: 'Stable',
        released_at: '2026-11-02',
        url: 'https://github.com/LawGlitch-net/Alfie-download/releases/download/v1.0.0/alfie-chromium-v1.0.0.zip',
        release_notes: 'Initial public release of Alfie. Introduces local semantic element resolution, natural-language browser interaction, lightweight HTTP-based agent integrations, and efficient browser automation. Tested across major social media platforms, contact forms, and regular websites.'
      }
    ]
  };

  function getBasePath() {
    const p = window.location.pathname;
    if (p.includes('/products/') || p.includes('/terms/') || p.includes('/legal/') || p.includes('/custom-integrations/')) {
      return '../';
    }
    return './';
  }

  // Fetch latest version from latest.json with cache busting and resilient multi-format parsing
  async function initVersion() {
    try {
      const basePath = getBasePath();
      const res = await fetch(basePath + 'latest.json?t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        let text = await res.text();
        text = text.trim();
        let data = null;

        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          // If user wrote comma-separated objects like `{...}, {...}`:
          try {
            data = JSON.parse(`[${text}]`);
          } catch (e2) {
            console.error('Could not parse latest.json:', parseErr);
          }
        }

        if (data) {
          if (Array.isArray(data)) {
            let allVers = [];
            data.forEach(item => {
              if (item.versions && Array.isArray(item.versions)) {
                allVers = allVers.concat(item.versions);
              } else if (item.version) {
                allVers.push(item);
              }
            });
            const top = data[0] || {};
            latestVersionData = {
              version: top.version || (allVers[0] ? allVers[0].version : '1.0.1'),
              url: top.url || (allVers[0] ? allVers[0].url : ''),
              released_at: top.released_at || (allVers[0] ? allVers[0].released_at : ''),
              release_notes: top.release_notes || (allVers[0] ? allVers[0].release_notes : ''),
              versions: allVers.length > 0 ? allVers : data
            };
          } else {
            latestVersionData = data;
          }

          const displayVer = latestVersionData.version || (latestVersionData.versions && latestVersionData.versions[0] ? latestVersionData.versions[0].version : '1.0.1');
          document.querySelectorAll('.js-latest-version, .js-alfie-version').forEach(el => {
            el.textContent = displayVer;
          });
        }
      }
    } catch (e) {
      console.warn('Could not load latest.json, using fallback version', e);
    }
  }

  // Forces browser to prompt the user to choose download destination folder
  async function forceDownloadChromium(urlOrEvent, customFilename) {
    let targetUrl = typeof urlOrEvent === 'string' ? urlOrEvent : latestVersionData.url;
    let filename = customFilename || 'alfie-chromium.zip';

    if (urlOrEvent && urlOrEvent.preventDefault) {
      urlOrEvent.preventDefault();
    }

    if (!targetUrl || targetUrl.startsWith('<')) {
      targetUrl = 'https://github.com/LawGlitch/Alfie/releases/download/v1.0.0/alfie-chromium.zip';
    }

    // Attempt: File System Access API (Standard on Chromium: Chrome, Edge, Brave, Opera, Arc)
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'ZIP Archive (*.zip)',
            accept: { 'application/zip': ['.zip'] }
          }]
        });

        try {
          const response = await fetch(targetUrl, { mode: 'cors' });
          if (response.ok) {
            const writable = await handle.createWritable();
            await response.body.pipeTo(writable);
            showDownloadToast('✓ Saved ' + filename + ' to your selected destination!');
            return;
          }
        } catch (corsErr) {
          console.warn('Direct stream CORS check; falling back to direct anchor download', corsErr);
        }
      } catch (pickerErr) {
        if (pickerErr.name === 'AbortError') {
          // User clicked Cancel in native dialog
          return;
        }
        console.warn('Save file picker exception:', pickerErr);
      }
    }

    // Fallback: Trigger standard browser anchor download
    const a = document.createElement('a');
    a.href = targetUrl;
    a.setAttribute('download', filename);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showDownloadToast('Download started for ' + filename);
  }

  function showDownloadToast(msg) {
    let toast = document.getElementById('alfie-download-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'alfie-download-toast';
      toast.className = 'download-toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4500);
  }

  // Version Picker Modal (shown when clicking download)
  let versionModalEl = null;

  function openVersionPickerModal() {
    if (!versionModalEl) {
      versionModalEl = document.createElement('div');
      versionModalEl.id = 'alfie-version-modal';
      versionModalEl.className = 'modal-backdrop modal-backdrop-strict';
      versionModalEl.setAttribute('role', 'dialog');
      versionModalEl.setAttribute('aria-modal', 'true');
      versionModalEl.setAttribute('aria-labelledby', 'version-modal-title');
      document.body.appendChild(versionModalEl);

      versionModalEl.addEventListener('click', (e) => {
        if (e.target === versionModalEl) closeVersionPickerModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && versionModalEl.style.display !== 'none') {
          closeVersionPickerModal();
        }
      });
    }

    const versions = latestVersionData.versions || [
      {
        version: latestVersionData.version || '1.0.0',
        release_tag: 'v' + (latestVersionData.version || '1.0.0'),
        badge: 'Latest',
        released_at: latestVersionData.released_at || '2026-11-02',
        url: latestVersionData.url || 'https://github.com/LawGlitch/Alfie/releases/download/v1.0.0/alfie-chromium.zip',
        release_notes: 'Official release with local browser automation.'
      }
    ];

    const basePath = getBasePath();

    versionModalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-versions" role="document">
        <div class="modal-header">
          <div class="modal-brand-badge">
            <img src="${basePath}assets/images/chromium.svg" alt="Chromium" width="28" height="28">
            <div class="modal-brand-text">
              <span class="modal-eyebrow">Available Releases</span>
              <h3 id="version-modal-title" class="modal-title">Select Alfie Version</h3>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="version-modal-close" aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body modal-body-versions">
          <p class="modal-desc" style="margin-bottom:var(--space-md);">
            Choose the build of Alfie you would like to download. All builds run 100% locally on-device.
          </p>

          <div class="version-cards-list">
            ${versions.map((ver, idx) => `
              <div class="version-choice-card ${idx === 0 ? 'is-latest' : ''}">
                <div class="version-card-top">
                  <div class="version-tag-group">
                    <strong class="ver-tag">${ver.release_tag || 'v' + ver.version}</strong>
                    <span class="status-pill ${idx === 0 ? 'status-pill-success' : 'status-pill-neutral'}">${ver.badge || 'Release'}</span>
                  </div>
                  <span class="ver-date">Released ${ver.released_at}</span>
                </div>
                <p class="ver-notes">${ver.release_notes}</p>
                <div class="version-card-action">
                  <button type="button" class="btn ${idx === 0 ? 'btn-primary' : 'btn-secondary'} btn-sm js-download-ver"
                    data-url="${ver.url}" data-filename="alfie-chromium-v${ver.version}.zip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download .ZIP (${ver.version})
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    versionModalEl.querySelector('#version-modal-close').addEventListener('click', closeVersionPickerModal);

    versionModalEl.querySelectorAll('.js-download-ver').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        const filename = btn.dataset.filename;
        forceDownloadChromium(url, filename);
        closeVersionPickerModal();
      });
    });

    versionModalEl.style.display = 'flex';
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
  }

  function closeVersionPickerModal() {
    if (!versionModalEl) return;
    versionModalEl.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
  }

  // Component Builder for the Step-by-Step Code Animation
  function createInstructionAnimation(mountEl) {
    if (!mountEl) return;

    const basePath = getBasePath();

    mountEl.innerHTML = `
      <div class="code-anim-container" role="region" aria-label="Alfie Chromium Installation Instructions Animation">
        <!-- Top Step Pills (Compact & Mobile-Responsive) -->
        <div class="code-anim-steps-nav">
          <button type="button" class="anim-step-btn active" data-step="1">
            <span class="step-num">1</span>
            <span class="step-label">Download</span>
          </button>
          <button type="button" class="anim-step-btn" data-step="2">
            <span class="step-num">2</span>
            <span class="step-label">Explorer</span>
          </button>
          <button type="button" class="anim-step-btn" data-step="3">
            <span class="step-num">3</span>
            <span class="step-label">Extract</span>
          </button>
          <button type="button" class="anim-step-btn" data-step="4">
            <span class="step-num">4</span>
            <span class="step-label">Dev Mode</span>
          </button>
          <button type="button" class="anim-step-btn" data-step="5">
            <span class="step-num">5</span>
            <span class="step-label">Load</span>
          </button>
        </div>

        <!-- Animation Screen / Stage -->
        <div class="code-anim-stage" id="anim-stage">
          <!-- Window Title Bar -->
          <div class="anim-window-header">
            <div class="anim-window-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <div class="anim-window-title" id="anim-title-text">Step 1: Download alfie-chromium.zip</div>
            <div class="anim-window-actions">
              <button type="button" class="anim-play-pause-btn" id="anim-toggle-play" aria-label="Pause animation">
                <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:none;">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
          </div>

          <!-- Animated Virtual Mouse Cursor (Stage coordinates) -->
          <div class="anim-cursor" id="anim-cursor" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 3 L20 12 L12.5 13.5 L9 21 L6 19.5 L9 13.5 L4 3 Z" fill="#ffffff" stroke="#090d16" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <span class="cursor-ripple"></span>
          </div>

          <!-- Scene 1: Website Download Button -->
          <div class="anim-scene anim-scene-1 active" id="scene-1">
            <div class="scene-web-mock">
              <div class="mock-browser-bar">
                <span class="mock-browser-url">https://lawglitch.com</span>
              </div>
              <div class="mock-web-content">
                <div class="mock-badge">Chromium Extension</div>
                <h4>Download Alfie for Chromium</h4>
                <p>One-click install package with local on-device inference.</p>
                <div class="mock-btn-target" id="mock-dl-btn">
                  <img src="${basePath}assets/images/chromium.svg" width="22" height="22" alt="Chromium">
                  <span>Download alfie-chromium.zip</span>
                </div>
              </div>
              <div class="mock-dl-tray" id="mock-dl-tray">
                <div class="mock-dl-tray-icon">⬇</div>
                <div class="mock-dl-tray-info">
                  <strong>alfie-chromium.zip</strong>
                  <span>Download complete &middot; 3.2 MB</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Scene 2: Windows File Explorer View -->
          <div class="anim-scene anim-scene-2" id="scene-2">
            <div class="scene-explorer-mock">
              <div class="explorer-address-bar">
                <span class="explorer-path">📁 This PC &gt; Downloads</span>
              </div>
              <div class="explorer-body">
                <div class="explorer-sidebar">
                  <div class="sidebar-item">📌 Quick access</div>
                  <div class="sidebar-item">📁 Desktop</div>
                  <div class="sidebar-item active">📥 Downloads</div>
                  <div class="sidebar-item">📄 Documents</div>
                  <div class="sidebar-item">🖼️ Pictures</div>
                </div>
                <div class="explorer-files-grid">
                  <div class="file-item">
                    <span class="file-icon">📁</span>
                    <span class="file-name">Screenshots</span>
                  </div>
                  <div class="file-item">
                    <span class="file-icon">📁</span>
                    <span class="file-name">Work_Projects</span>
                  </div>
                  <div class="file-item">
                    <span class="file-icon">📄</span>
                    <span class="file-name">Brief_2026.pdf</span>
                  </div>
                  <div class="file-item is-target" id="mock-zip-file">
                    <span class="file-icon zip-icon">📦</span>
                    <span class="file-name">alfie-chromium.zip</span>
                    <span class="file-badge">New</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scene 3: Extract ZIP File -->
          <div class="anim-scene anim-scene-3" id="scene-3">
            <div class="scene-explorer-mock">
              <div class="explorer-address-bar">
                <span class="explorer-path">📁 This PC &gt; Downloads</span>
              </div>
              <div class="explorer-body">
                <div class="explorer-sidebar">
                  <div class="sidebar-item">📌 Quick access</div>
                  <div class="sidebar-item active">📥 Downloads</div>
                  <div class="sidebar-item">📄 Documents</div>
                </div>
                <div class="explorer-files-grid relative-grid">
                  <div class="file-item is-target highlighted" id="mock-zip-extract-target">
                    <span class="file-icon zip-icon">📦</span>
                    <span class="file-name">alfie-chromium.zip</span>
                  </div>

                  <!-- Windows Context Menu -->
                  <div class="mock-context-menu" id="mock-context-menu">
                    <div class="menu-row">Open</div>
                    <div class="menu-row highlight-menu" id="mock-extract-row">⚡ Extract All...</div>
                    <div class="menu-row">Pin to Quick access</div>
                    <div class="menu-row">Delete</div>
                  </div>

                  <!-- Extracted folder revealed -->
                  <div class="file-item folder-extracted" id="mock-extracted-folder">
                    <span class="file-icon folder-icon">📁</span>
                    <span class="file-name">alfie</span>
                    <span class="file-tag">Extracted Folder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scene 4: Chromium //extensions & Developer Mode -->
          <div class="anim-scene anim-scene-4" id="scene-4">
            <div class="scene-browser-mock">
              <div class="chrome-tab-bar">
                <div class="chrome-tab active">Extensions</div>
              </div>
              <div class="chrome-nav-bar">
                <div class="chrome-url-box">
                  <span class="chrome-lock">🔒</span>
                  <span class="chrome-url">chrome://extensions</span>
                </div>
                <div class="chrome-devmode-toggle-wrap">
                  <span class="devmode-label">Dev mode</span>
                  <div class="devmode-switch" id="mock-devmode-switch">
                    <span class="switch-knob"></span>
                  </div>
                </div>
              </div>
              <div class="chrome-page-content">
                <div class="chrome-empty-msg">Turn on Developer mode to install unpacked extensions.</div>
              </div>
            </div>
          </div>

          <!-- Scene 5: Load Unpacked & Extension Active -->
          <div class="anim-scene anim-scene-5" id="scene-5">
            <div class="scene-browser-mock">
              <div class="chrome-tab-bar">
                <div class="chrome-tab active">Extensions</div>
              </div>
              <div class="chrome-nav-bar">
                <div class="chrome-url-box">
                  <span class="chrome-lock">🔒</span>
                  <span class="chrome-url">chrome://extensions</span>
                </div>
                <div class="chrome-devmode-toggle-wrap">
                  <span class="devmode-label">Dev mode</span>
                  <div class="devmode-switch is-on">
                    <span class="switch-knob"></span>
                  </div>
                </div>
              </div>
              <!-- Action bar revealed by developer mode -->
              <div class="chrome-action-bar">
                <button type="button" class="chrome-btn is-target" id="mock-load-unpacked-btn">
                  📂 Load unpacked
                </button>
                <button type="button" class="chrome-btn" disabled>Pack</button>
                <button type="button" class="chrome-btn" disabled>Update</button>
              </div>
              <div class="chrome-page-content">
                <!-- Loaded Extension Card -->
                <div class="mock-ext-card" id="mock-ext-card">
                  <div class="ext-card-header">
                    <img src="${basePath}assets/images/alfie-logo/icon-48.png" width="36" height="36" alt="Alfie">
                    <div class="ext-card-info">
                      <div class="ext-card-title-row">
                        <strong class="ext-name">Alfie</strong>
                        <span class="ext-ver">1.0.0</span>
                      </div>
                      <p class="ext-desc">A more natural way to work with your browser.</p>
                      <div class="ext-meta">ID: ghcjkpeimdeacochedajjlijbinmmege &middot; Loaded unpacked</div>
                    </div>
                    <div class="ext-toggle is-on">
                      <span class="ext-toggle-knob"></span>
                    </div>
                  </div>
                  <div class="ext-card-status">
                    <span class="status-dot"></span> Active &bull; Shortcut: <kbd>Alt+Shift+A</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step Progress Track -->
          <div class="anim-progress-track">
            <div class="anim-progress-bar" id="anim-progress-bar"></div>
          </div>
        </div>
      </div>
    `;

    // Animation Controller Logic
    let currentStep = 1;
    let isPlaying = true;
    let timer = null;
    const totalSteps = 5;
    const stepDuration = 3800; // ms per step

    const titleEl = mountEl.querySelector('#anim-title-text');
    const cursor = mountEl.querySelector('#anim-cursor');
    const progressBar = mountEl.querySelector('#anim-progress-bar');
    const playPauseBtn = mountEl.querySelector('#anim-toggle-play');
    const playIcon = mountEl.querySelector('.icon-play');
    const pauseIcon = mountEl.querySelector('.icon-pause');
    const stage = mountEl.querySelector('#anim-stage');

    const stepTitles = [
      'Step 1: Download alfie-chromium.zip using download button',
      'Step 2: Go to native file manager (File Explorer)',
      'Step 3: Extract the zip archive (alfie)',
      'Step 4: Go to chromium://extensions and enable Developer mode',
      'Step 5: Click Load Unpacked & select extracted alfie folder'
    ];

    // Absolute stage percentage cursor positioning
    function setCursorPos(stagePercentX, stagePercentY, isClick = false) {
      if (!cursor) return;
      cursor.style.left = stagePercentX + '%';
      cursor.style.top = stagePercentY + '%';
      if (isClick) {
        cursor.classList.add('clicking');
        setTimeout(() => cursor.classList.remove('clicking'), 400);
      }
    }

    // Dynamic bounding-rect target tracking: tracks actual DOM position on any screen width
    function moveCursorToTarget(targetSelector, isClick = false, fallbackX = 50, fallbackY = 50) {
      if (!stage || !cursor) return;
      const target = mountEl.querySelector(targetSelector);
      if (target && target.offsetParent !== null) {
        const sRect = stage.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        if (sRect.width > 0 && sRect.height > 0) {
          const xPercent = ((tRect.left + (tRect.width / 2) - sRect.left) / sRect.width) * 100;
          const yPercent = ((tRect.top + (tRect.height / 2) - sRect.top) / sRect.height) * 100;
          setCursorPos(Math.max(5, Math.min(95, xPercent)), Math.max(5, Math.min(95, yPercent)), isClick);
          return;
        }
      }
      setCursorPos(fallbackX, fallbackY, isClick);
    }

    function runStepScene(step) {
      mountEl.querySelectorAll('.anim-step-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.step, 10) === step);
      });

      mountEl.querySelectorAll('.anim-scene').forEach(scene => scene.classList.remove('active'));
      const activeScene = mountEl.querySelector(`#scene-${step}`);
      if (activeScene) activeScene.classList.add('active');

      if (titleEl) {
        titleEl.textContent = stepTitles[step - 1];
      }

      // Step specific cursor movements & visual events (responsive dynamically)
      if (step === 1) {
        const tray = mountEl.querySelector('#mock-dl-tray');
        if (tray) tray.classList.remove('is-active');
        setCursorPos(15, 80);
        setTimeout(() => {
          moveCursorToTarget('#mock-dl-btn', false, 50, 68);
          setTimeout(() => {
            moveCursorToTarget('#mock-dl-btn', true, 50, 68);
            if (tray) tray.classList.add('is-active');
          }, 700);
        }, 400);
      } else if (step === 2) {
        setCursorPos(20, 30);
        setTimeout(() => {
          moveCursorToTarget('#mock-zip-file', false, 65, 55);
        }, 500);
      } else if (step === 3) {
        const ctxMenu = mountEl.querySelector('#mock-context-menu');
        const extractedFolder = mountEl.querySelector('#mock-extracted-folder');
        if (ctxMenu) ctxMenu.classList.remove('is-visible');
        if (extractedFolder) extractedFolder.classList.remove('is-visible');

        moveCursorToTarget('#mock-zip-extract-target', false, 42, 45);
        setTimeout(() => {
          moveCursorToTarget('#mock-zip-extract-target', true, 42, 45);
          if (ctxMenu) ctxMenu.classList.add('is-visible');
          setTimeout(() => {
            moveCursorToTarget('#mock-extract-row', false, 55, 52);
            setTimeout(() => {
              moveCursorToTarget('#mock-extract-row', true, 55, 52);
              if (ctxMenu) ctxMenu.classList.remove('is-visible');
              if (extractedFolder) extractedFolder.classList.add('is-visible');
            }, 600);
          }, 600);
        }, 500);
      } else if (step === 4) {
        const sw = mountEl.querySelector('#mock-devmode-switch');
        if (sw) sw.classList.remove('is-on');
        setCursorPos(25, 65);
        setTimeout(() => {
          moveCursorToTarget('#mock-devmode-switch', false, 86, 18);
          setTimeout(() => {
            moveCursorToTarget('#mock-devmode-switch', true, 86, 18);
            if (sw) sw.classList.add('is-on');
          }, 700);
        }, 500);
      } else if (step === 5) {
        const extCard = mountEl.querySelector('#mock-ext-card');
        if (extCard) extCard.classList.remove('is-visible');
        setCursorPos(75, 65);
        setTimeout(() => {
          moveCursorToTarget('#mock-load-unpacked-btn', false, 18, 30);
          setTimeout(() => {
            moveCursorToTarget('#mock-load-unpacked-btn', true, 18, 30);
            setTimeout(() => {
              if (extCard) extCard.classList.add('is-visible');
            }, 300);
          }, 700);
        }, 500);
      }

      // Animate progress track
      if (progressBar) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        void progressBar.offsetWidth;
        progressBar.style.transition = `width ${stepDuration}ms linear`;
        progressBar.style.width = '100%';
      }
    }

    function scheduleNext() {
      if (timer) clearTimeout(timer);
      if (!isPlaying) return;
      timer = setTimeout(() => {
        currentStep = currentStep >= totalSteps ? 1 : currentStep + 1;
        runStepScene(currentStep);
        scheduleNext();
      }, stepDuration);
    }

    // Nav button clicks
    mountEl.querySelectorAll('.anim-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentStep = parseInt(btn.dataset.step, 10);
        runStepScene(currentStep);
        if (isPlaying) {
          scheduleNext();
        }
      });
    });

    // Play/Pause button
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          scheduleNext();
        } else {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
          if (timer) clearTimeout(timer);
          if (progressBar) progressBar.style.transition = 'none';
        }
      });
    }

    // Start running
    runStepScene(currentStep);
    scheduleNext();
  }

  // Generate the Chromium Download Box with the Chromium SVG icon, forced download trigger,
  // and the migration/update instructions
  function renderChromiumDownloadSection(containerEl) {
    if (!containerEl) return;
    const basePath = getBasePath();

    containerEl.innerHTML = `
      <div class="alfie-chromium-download-wrapper">
        <!-- Interactive Instruction Animation Component -->
        <div class="alfie-instruction-mount" id="alfie-instruction-mount"></div>

        <!-- Chromium Download Action Container -->
        <div class="alfie-dl-center-box">
          <button type="button" class="btn btn-chromium-download js-open-versions-modal" id="alfie-chromium-dl-btn">
            <span class="cr-icon-spin-wrapper">
              <img src="${basePath}assets/images/chromium.svg" alt="Chromium" class="cr-icon-svg" width="36" height="36">
            </span>
            <div class="cr-btn-text">
              <span class="cr-btn-title">Download Alfie for Chromium</span>
              <span class="cr-btn-subtitle">Direct .ZIP Archive &middot; v.<span class="js-alfie-version">1.0.0</span> &middot; Free on-device</span>
            </div>
            <svg class="cr-dl-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>

          <p class="cr-dl-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Works on Google Chrome, Microsoft Edge, Brave, Opera, Vivaldi, Arc &amp; all Chromium-based browsers.
          </p>

          <!-- Migration & Update Instructions -->
          <div class="alfie-migration-box">
            <div class="migration-header">
              <span class="migration-badge">Update Instructions</span>
              <h4 class="migration-title">
                If you already have an existing installation of Alfie &amp; want to update to the new version: v.<span class="js-latest-version">1.0.0</span>
              </h4>
            </div>
            <ol class="migration-steps-list">
              <li>
                Go to Alfie settings page <code class="key-pill">gear icon on chat pop up when you click <kbd>Alt+Shift+A</kbd></code>
              </li>
              <li>
                In general settings click on <strong>download migration file</strong> to preserve all your saved data including skills, conversation history, integrations, mcp etc.
              </li>
              <li>
                Download and extract the new zip file in the same location as your current installation.
              </li>
              <li>
                Your file manager will ask permission: <em>'replace all files and folders in this destination?'</em> Select <strong>yes to all</strong>.
              </li>
              <li>
                Open Alfie settings page &amp; check if the existing data are preserved there or not. If not then go to general settings. Click on <strong>upload migration file</strong>, upload the json file you downloaded earlier named <code class="file-pill">Alfie-migration.json</code> this recovers your existing data.
              </li>
            </ol>
          </div>
        </div>
      </div>
    `;

    // Mount instruction animation
    const mount = containerEl.querySelector('#alfie-instruction-mount');
    if (mount) {
      createInstructionAnimation(mount);
    }

    // Attach version modal popup handler
    const dlBtn = containerEl.querySelector('#alfie-chromium-dl-btn');
    if (dlBtn) {
      dlBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openVersionPickerModal();
      });
    }
  }

  // Expose API
  root.AlfieInstruction = {
    initVersion: initVersion,
    createAnimation: createInstructionAnimation,
    renderSection: renderChromiumDownloadSection,
    forceDownload: forceDownloadChromium,
    openVersionsModal: openVersionPickerModal,
    closeVersionsModal: closeVersionPickerModal
  };

  document.addEventListener('DOMContentLoaded', function () {
    initVersion();

    // Auto-mount on elements with [data-alfie-instruction-mount]
    document.querySelectorAll('[data-alfie-instruction-mount]').forEach(el => {
      renderChromiumDownloadSection(el);
    });

    // Wire up any buttons asking to open versions modal
    document.querySelectorAll('.js-open-versions-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openVersionPickerModal();
      });
    });
  });

})(typeof window !== 'undefined' ? window : this);
