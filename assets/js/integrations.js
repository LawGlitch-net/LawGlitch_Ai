/**
 * LawGlitch — Custom Integrations Interactive Directory
 * Features:
 * - Dynamic 3x3 Instagram Explore style grid (desktop & mobile)
 * - Autoplaying muted video previews continuously looping without sound (just like Instagram Explore)
 * - Robust YouTube and Instagram embedding
 * - Real-time keyword search
 * - Modal popup with looping video player, sound toggle, Get-Integration button & scrollable description
 * - Fully mobile-optimized touch scrolling & responsive layout
 * - Cache-busted instant JSON loading
 */

(function () {
  'use strict';

  let allIntegrations = [];
  let modalEl = null;
  let currentModalVideo = null;
  let isSoundEnabled = false;

  // Helper to detect YouTube links
  function getYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
    return match ? match[1] : null;
  }

  // Helper to detect Instagram links
  function getInstagramCode(url) {
    if (!url) return null;
    const match = url.match(/(?:instagram\.com\/(?:reel|p|tv)\/)([\w-]+)/i);
    return match ? match[1] : null;
  }

  function isImageUrl(url) {
    if (!url) return false;
    return /\.(gif|png|jpe?g|webp)(\?.*)?$/i.test(url);
  }

  // Fetch integrations with cache-busting
  async function loadIntegrations() {
    const gridEl = document.getElementById('integrations-grid');
    if (!gridEl) return;

    try {
      const res = await fetch('./integrations.json?t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      allIntegrations = await res.json();
      renderGrid(allIntegrations);
      updateCount(allIntegrations.length, allIntegrations.length);
    } catch (err) {
      console.error('Failed to load integrations.json:', err);
      gridEl.innerHTML = `
        <div class="integrations-empty-state">
          <p>Unable to load integrations at this moment. Please refresh the page or contact <a href="mailto:lawglitch@outlook.com">lawglitch@outlook.com</a>.</p>
        </div>
      `;
    }
  }

  function updateCount(showing, total) {
    const countEl = document.getElementById('integrations-count');
    if (!countEl) return;
    if (showing === total) {
      countEl.textContent = `Showing all ${total} custom integrations`;
    } else {
      countEl.textContent = `Found ${showing} of ${total} integrations`;
    }
  }

  // Render 3x3 Instagram Explore style grid
  function renderGrid(items) {
    const gridEl = document.getElementById('integrations-grid');
    if (!gridEl) return;

    if (!items || items.length === 0) {
      gridEl.innerHTML = `
        <div class="integrations-empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No integrations found</h3>
          <p>We couldn't find any custom integrations matching your search query.</p>
          <a href="mailto:lawglitch@outlook.com?subject=Custom%20Integration%20Request" class="btn btn-secondary btn-sm" style="margin-top:12px;">
            Request a Custom Integration &rarr;
          </a>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = items.map((item) => {
      const ytId = getYouTubeId(item.video_url);
      const igCode = getInstagramCode(item.video_url);
      const isImg = isImageUrl(item.video_url);

      let mediaHtml = '';
      const fallbackThumb = item.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');

      if (ytId) {
        // Autoplaying muted looping preview just like Instagram Explore
        mediaHtml = `
          <div class="explore-media-wrap yt-wrap" style="background-image:url('${fallbackThumb}'); background-size:cover; background-position:center;">
            <iframe
              src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&enablejsapi=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1"
              title="${item.title}"
              frameborder="0"
              allow="autoplay; encrypted-media"
              tabindex="-1"
              aria-hidden="true"
              class="explore-grid-video">
            </iframe>
            <div class="explore-media-overlay" aria-hidden="true"></div>
            <div class="explore-corner-badge" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        `;
      } else if (igCode) {
        mediaHtml = `
          <div class="explore-media-wrap ig-wrap">
            <iframe
              src="https://www.instagram.com/reel/${igCode}/embed/"
              title="${item.title}"
              frameborder="0"
              tabindex="-1"
              class="explore-grid-video">
            </iframe>
            <div class="explore-media-overlay" aria-hidden="true"></div>
            <div class="explore-corner-badge" aria-hidden="true">
              <span>Reel</span>
            </div>
          </div>
        `;
      } else if (isImg) {
        mediaHtml = `
          <div class="explore-media-wrap img-wrap">
            <img src="${item.video_url}" alt="${item.title}" class="explore-grid-video" loading="lazy">
            <div class="explore-media-overlay" aria-hidden="true"></div>
          </div>
        `;
      } else {
        // Direct HTML5 video: Autoplaying muted in loop
        const posterAttr = fallbackThumb ? `poster="${fallbackThumb}"` : '';
        mediaHtml = `
          <div class="explore-media-wrap video-wrap">
            <video
              src="${item.video_url}"
              ${posterAttr}
              autoplay
              muted
              loop
              playsinline
              webkit-playsinline
              preload="auto"
              aria-hidden="true"
              class="explore-grid-video">
            </video>
            <div class="explore-media-overlay" aria-hidden="true"></div>
            <div class="explore-corner-badge" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        `;
      }

      return `
        <article class="explore-card" data-integration-id="${item.id}" tabindex="0" role="button" aria-label="View integration: ${item.title}">
          <div class="explore-card-media-box">
            ${mediaHtml}
          </div>
          <div class="explore-card-info">
            <h4 class="explore-card-title">${item.title}</h4>
            <span class="explore-card-cue">Explore details &rarr;</span>
          </div>
        </article>
      `;
    }).join('');

    // Attach click & enter key handlers to cards
    gridEl.querySelectorAll('.explore-card').forEach(card => {
      const id = card.dataset.integrationId;
      const item = items.find(i => i.id === id);

      card.addEventListener('click', () => {
        openIntegrationModal(item);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openIntegrationModal(item);
        }
      });
    });

    // Ensure all grid HTML5 videos play muted
    gridEl.querySelectorAll('video').forEach(v => {
      v.muted = true;
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    });
  }

  // Setup Search functionality
  function setupSearch() {
    const searchInput = document.getElementById('integrations-search-input');
    const clearBtn = document.getElementById('integrations-search-clear');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = query ? 'block' : 'none';
      }

      if (!query) {
        renderGrid(allIntegrations);
        updateCount(allIntegrations.length, allIntegrations.length);
        return;
      }

      const filtered = allIntegrations.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(query);
        const descMatch = (item.description || '').toLowerCase().includes(query);
        const idMatch = (item.id || '').toLowerCase().includes(query);
        return titleMatch || descMatch || idMatch;
      });

      renderGrid(filtered);
      updateCount(filtered.length, allIntegrations.length);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        renderGrid(allIntegrations);
        updateCount(allIntegrations.length, allIntegrations.length);
        searchInput.focus();
      });
    }
  }

  // Modal Popup for Selected Integration
  function createModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement('div');
    modalEl.id = 'integration-detail-modal';
    modalEl.className = 'modal-backdrop modal-backdrop-strict';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.style.display = 'none';

    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-integration" role="document">
        <!-- Close Button (Large touch target) -->
        <button type="button" class="modal-close-btn" id="integration-modal-close" aria-label="Close dialog">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Top Video Player Section -->
        <div class="integration-modal-video-stage">
          <div id="modal-video-container" class="modal-video-mount"></div>

          <!-- Video Playback & Sound Floating Controls (For direct video) -->
          <div class="modal-video-controls-overlay" id="modal-video-controls">
            <button type="button" class="video-ctrl-btn" id="modal-video-toggle-play" aria-label="Play or Pause video">
              <svg class="ctrl-icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              <svg class="ctrl-icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:none;">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>

            <!-- Sound Icon to enable/disable sound -->
            <button type="button" class="video-ctrl-btn" id="modal-video-toggle-sound" aria-label="Toggle Sound">
              <!-- Muted icon (default) -->
              <svg class="ctrl-icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
              <!-- Unmuted icon -->
              <svg class="ctrl-icon-unmuted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Integration Content -->
        <div class="integration-modal-body">
          <div class="integration-modal-header-row">
            <h3 id="modal-integration-title" class="integration-modal-title"></h3>
            <a href="#" id="modal-get-integration-btn" class="btn btn-primary btn-get-integration" target="_blank" rel="noopener noreferrer">
              Get Integration &rarr;
            </a>
          </div>

          <!-- Full Description Scrollable (Custom dark scrollbar, no white bar, touch optimized) -->
          <div class="integration-modal-desc-scroll-wrap" id="modal-desc-scroll-wrap">
            <h5 class="desc-heading">Overview &amp; Capabilities</h5>
            <p id="modal-integration-desc" class="integration-modal-desc-text"></p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    // Prevent background wheel scrolling on PC, while allowing normal mobile touch gestures
    modalEl.addEventListener('wheel', function (e) {
      const scrollWrap = modalEl.querySelector('#modal-desc-scroll-wrap');
      if (scrollWrap && scrollWrap.contains(e.target)) {
        const isAtTop = scrollWrap.scrollTop <= 0 && e.deltaY < 0;
        const isAtBottom = (scrollWrap.scrollHeight - scrollWrap.scrollTop <= scrollWrap.clientHeight + 2) && e.deltaY > 0;
        if (isAtTop || isAtBottom) {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    }, { passive: false });

    // Close handlers
    modalEl.querySelector('#integration-modal-close').addEventListener('click', closeIntegrationModal);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeIntegrationModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl.style.display !== 'none') {
        closeIntegrationModal();
      }
    });

    return modalEl;
  }

  function openIntegrationModal(item) {
    if (!item) return;
    const modal = createModal();

    modal.querySelector('#modal-integration-title').textContent = item.title;
    modal.querySelector('#modal-integration-desc').textContent = item.description;

    const getBtn = modal.querySelector('#modal-get-integration-btn');
    getBtn.href = item.get_integration_url || '#';
    getBtn.setAttribute('aria-label', `Get ${item.title} integration`);

    const descWrap = modal.querySelector('#modal-desc-scroll-wrap');
    if (descWrap) descWrap.scrollTop = 0;

    const container = modal.querySelector('#modal-video-container');
    const controlsWrap = modal.querySelector('#modal-video-controls');
    const playBtn = modal.querySelector('#modal-video-toggle-play');
    const soundBtn = modal.querySelector('#modal-video-toggle-sound');
    const pauseIcon = modal.querySelector('.ctrl-icon-pause');
    const playIcon = modal.querySelector('.ctrl-icon-play');
    const mutedIcon = modal.querySelector('.ctrl-icon-muted');
    const unmutedIcon = modal.querySelector('.ctrl-icon-unmuted');

    const ytId = getYouTubeId(item.video_url);
    const igCode = getInstagramCode(item.video_url);
    const isImg = isImageUrl(item.video_url);

    container.innerHTML = '';
    currentModalVideo = null;
    isSoundEnabled = false;

    pauseIcon.style.display = 'block';
    playIcon.style.display = 'none';
    mutedIcon.style.display = 'block';
    unmutedIcon.style.display = 'none';

    if (ytId) {
      controlsWrap.style.display = 'none';
      const iframe = document.createElement('iframe');
      // Playsinline & mobile-unrestricted configuration
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=1&loop=1&playlist=${ytId}&playsinline=1&enablejsapi=1`;
      iframe.title = item.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.className = 'modal-full-video';
      container.appendChild(iframe);
    } else if (igCode) {
      controlsWrap.style.display = 'none';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.instagram.com/reel/${igCode}/embed/`;
      iframe.title = item.title;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowFullscreen = true;
      iframe.className = 'modal-full-video';
      container.appendChild(iframe);
    } else if (isImg) {
      controlsWrap.style.display = 'none';
      const img = document.createElement('img');
      img.src = item.video_url;
      img.alt = item.title;
      img.className = 'modal-full-video';
      container.appendChild(img);
    } else {
      controlsWrap.style.display = 'flex';
      const video = document.createElement('video');
      video.src = item.video_url;
      if (item.thumbnail) video.poster = item.thumbnail;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('webkit-playsinline', 'true');
      video.className = 'modal-full-video';
      container.appendChild(video);
      currentModalVideo = video;

      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {});
      }

      playBtn.onclick = function () {
        if (!currentModalVideo) return;
        if (currentModalVideo.paused) {
          currentModalVideo.play();
          pauseIcon.style.display = 'block';
          playIcon.style.display = 'none';
        } else {
          currentModalVideo.pause();
          pauseIcon.style.display = 'none';
          playIcon.style.display = 'block';
        }
      };

      soundBtn.onclick = function () {
        if (!currentModalVideo) return;
        isSoundEnabled = !isSoundEnabled;
        currentModalVideo.muted = !isSoundEnabled;
        if (isSoundEnabled) {
          mutedIcon.style.display = 'none';
          unmutedIcon.style.display = 'block';
        } else {
          mutedIcon.style.display = 'block';
          unmutedIcon.style.display = 'none';
        }
      };
    }

    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
    getBtn.focus();
  }

  function closeIntegrationModal() {
    if (!modalEl) return;
    if (currentModalVideo) {
      currentModalVideo.pause();
      currentModalVideo = null;
    }
    const container = modalEl.querySelector('#modal-video-container');
    if (container) container.innerHTML = '';

    modalEl.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadIntegrations();
    setupSearch();
  });

})();
