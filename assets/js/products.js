/**
 * LawGlitch — Central Product Registry
 * Authoritative source of truth for LawGlitch products, download releases,
 * and agent roadmap states across all website surfaces.
 */

(function (root) {
  'use strict';

  const PRODUCTS = [
    {
      id: 'alfie',
      name: 'Alfie',
      tagline: 'A more natural way to work with your browser.',
      description: 'Alfie turns simple instructions into clear browser actions. Use your keyboard, type what you need, or speak a command — and stay in control as you work.',
      category: 'Browser Automation & Assistance',
      status: 'available',
      badge: 'Available Now',
      icon: 'assets/images/alfie-logo/icon-128.png',
      detailUrl: 'products/',
      defaultVersion: '1.0.0',
      install: {
        chromium: {
          key: 'chromium',
          label: 'Chromium Browser',
          storeName: 'Direct ZIP Archive (GitHub Releases)',
          badge: 'Available Now',
          status: 'available',
          filename: 'alfie-chromium.zip',
          url: 'https://github.com/LawGlitch/Alfie/releases/latest/download/alfie-chromium.zip',
          icon: 'assets/images/chromium.svg',
          note: 'Compatible with Chrome, Edge, Brave, Opera, Vivaldi, Arc & all Chromium browsers.'
        }
      },
      features: [
        'Local on-device inference without cloud telemetry',
        'Keyboard-first shortcuts & dynamic DOM index chips',
        'Ask First safety confirmation before sensitive actions',
        'On-device speech recognition via Moonshine Tiny'
      ],
      licensing: {
        personal: 'Free for non-commercial personal use',
        trial: '14-day evaluation trial for commercial environments',
        commercialEmail: 'lawglitch@outlook.com',
        mailtoUrl: 'mailto:lawglitch@outlook.com?subject=Commercial%20Licensing%20Inquiry%20%E2%80%94%20Alfie&body=Hello%2C%0A%0AI%20am%20interested%20in%20obtaining%20a%20commercial%20licence%20for%20Alfie.%0A%0APlease%20share%20the%20applicable%20licensing%20terms%2C%20pricing%2C%20and%20requirements.%0A%0AThank%20you.'
      },
      agentStatus: 'Native AI agents for this product are coming soon. Stay tuned.'
    }
  ];

  // Freeze registry
  root.LAWGLITCH_PRODUCTS = Object.freeze(PRODUCTS);

  // Helper methods
  root.LawGlitchProducts = {
    getAll: function () {
      return root.LAWGLITCH_PRODUCTS;
    },
    getById: function (id) {
      return root.LAWGLITCH_PRODUCTS.find(function (p) {
        return p.id === id;
      }) || null;
    },
    getAvailableBrowsers: function (productId) {
      const product = this.getById(productId);
      if (!product || !product.install) return [];
      return Object.values(product.install);
    },
    fetchLatestVersion: async function (basePath = '') {
      try {
        const res = await fetch(basePath + 'latest.json?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (e) {
        console.warn('Unable to fetch latest.json, using fallback', e);
      }
      return {
        version: '1.0.0',
        url: 'https://github.com/LawGlitch/Alfie/releases/latest/download/alfie-chromium.zip'
      };
    }
  };

})(typeof window !== 'undefined' ? window : this);
