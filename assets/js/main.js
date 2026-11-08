/**
 * Alfie Web Extension — Main Interactive Script
 * Navigation, sticky header, legal scroll-spy, and interactive showcase demo.
 */

(function () {
  'use strict';

  // 1. Dynamic Copyright Year
  const copyrightYearEl = document.getElementById('current-year');
  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Elevation
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = function () {
      if (window.scrollY > 16) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Mobile Navigation Menu Toggle with Backdrop & Scroll Lock
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (menuToggle && navMenu) {
    // Create backdrop element if it doesn't exist
    let navBackdrop = document.querySelector('.mobile-nav-backdrop');
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.className = 'mobile-nav-backdrop';
      navBackdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(navBackdrop);
    }

    const closeMenu = function () {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('nav-open');
      document.body.classList.remove('mobile-nav-open');
      navBackdrop.classList.remove('is-active');
    };

    const openMenu = function () {
      menuToggle.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('nav-open');
      document.body.classList.add('mobile-nav-open');
      navBackdrop.classList.add('is-active');
      const firstLink = navMenu.querySelector('a, button');
      if (firstLink) firstLink.focus();
    };

    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navBackdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('nav-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    navMenu.querySelectorAll('a, button').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navMenu.classList.contains('nav-open')) {
          closeMenu();
        }
      });
    });

    // Close mobile menu on resize past mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && navMenu.classList.contains('nav-open')) {
        closeMenu();
      }
    }, { passive: true });
  }

  // 4. Smooth Anchor Scrolling with Header Offset & Reduced Motion Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        if (!targetEl.hasAttribute('tabindex')) {
          targetEl.setAttribute('tabindex', '-1');
        }
        targetEl.focus({ preventScroll: true });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // 5. Legal Table of Contents (ScrollSpy & Mobile Toggle)
  const tocContainer = document.querySelector('.legal-toc');
  const tocWrapper = document.querySelector('.legal-toc-wrapper');
  const tocToggleBtn = document.querySelector('.toc-mobile-toggle');

  if (tocToggleBtn && tocWrapper) {
    tocToggleBtn.addEventListener('click', function () {
      const isExpanded = tocToggleBtn.getAttribute('aria-expanded') === 'true';
      tocToggleBtn.setAttribute('aria-expanded', !isExpanded);
      tocWrapper.classList.toggle('toc-expanded');
    });
  }

  if (tocContainer) {
    const tocLinks = tocContainer.querySelectorAll('a[href^="#"]');
    const legalSections = [];

    tocLinks.forEach(function (link) {
      const secId = link.getAttribute('href').slice(1);
      const section = document.getElementById(secId);
      if (section) {
        legalSections.push({ link: link, section: section });
      }

      // If mobile TOC is open, close it when a link is tapped
      link.addEventListener('click', function () {
        if (tocWrapper && tocWrapper.classList.contains('toc-expanded')) {
          tocWrapper.classList.remove('toc-expanded');
          if (tocToggleBtn) tocToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    if ('IntersectionObserver' in window && legalSections.length > 0) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach(function (link) {
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active-toc');
                link.setAttribute('aria-current', 'true');
              } else {
                link.classList.remove('active-toc');
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      }, {
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0
      });

      legalSections.forEach(function (item) {
        observer.observe(item.section);
      });
    }
  }

  // 6. Interactive Showcase Demo Controls (Matching Alfie Extension behavior)
  const modeBtn = document.getElementById('demo-mode-toggle');
  const modeTag = document.getElementById('demo-mode-tag');
  const approvalBox = document.getElementById('demo-approval-box');
  const stepStateTag = document.getElementById('demo-step3-state');
  const pageMapChips = document.querySelectorAll('.map-chip');
  const toggleMapBtn = document.getElementById('demo-toggle-map');

  if (modeBtn && modeTag) {
    modeBtn.addEventListener('click', function () {
      const isAskFirst = modeTag.textContent.includes('Ask first');
      if (isAskFirst) {
        modeTag.textContent = 'Full auto';
        modeTag.style.background = 'rgba(16, 185, 129, 0.2)';
        modeTag.style.color = '#34d399';
        if (approvalBox) approvalBox.style.display = 'none';
        if (stepStateTag) {
          stepStateTag.textContent = 'Auto-executed';
          stepStateTag.className = 'step-state-tag done';
        }
      } else {
        modeTag.textContent = 'Ask first';
        modeTag.style.background = 'rgba(245, 158, 11, 0.2)';
        modeTag.style.color = '#fbbf24';
        if (approvalBox) approvalBox.style.display = 'flex';
        if (stepStateTag) {
          stepStateTag.textContent = 'Waiting approval';
          stepStateTag.className = 'step-state-tag wait';
        }
      }
    });
  }

  // Approve button click (Simulated execution)
  const approveBtn = document.getElementById('demo-approve-btn');
  if (approveBtn && approvalBox && stepStateTag) {
    approveBtn.addEventListener('click', function () {
      approvalBox.innerHTML = '<span style="color:#10b981;font-size:0.75rem;font-weight:700;">✓ Action Approved &amp; Executed (Illustrative Preview)</span>';
      stepStateTag.textContent = 'Completed';
      stepStateTag.className = 'step-state-tag done';
    });
  }

  // Toggle Page Map Markers
  if (toggleMapBtn) {
    toggleMapBtn.addEventListener('click', function () {
      pageMapChips.forEach(function (chip) {
        chip.style.display = chip.style.display === 'none' ? 'inline-flex' : 'none';
      });
    });
  }

  // Skill pills in demo
  const skillPills = document.querySelectorAll('.demo-skill-pill');
  const composerInput = document.getElementById('demo-composer-text');
  if (composerInput) {
    skillPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        const text = this.getAttribute('data-cmd');
        if (text) {
          composerInput.textContent = text;
        }
      });
    });
  }

})();
