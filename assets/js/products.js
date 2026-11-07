/**
 * LawGlitch — Central Product Registry
 * Single authoritative source of truth for all LawGlitch products, browser availability,
 * store listings, and agent roadmap states across all website surfaces.
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
      install: {
        edge: {
          key: 'edge',
          label: 'Microsoft Edge',
          storeName: 'Microsoft Edge Add-ons',
          badge: 'Available Now',
          status: 'available',
          url: 'https://microsoftedge.microsoft.com/addons/detail/alifie/ghcjkpeimdeacochedajjlijbinmmege',
          icon: 'assets/images/browser-edge.svg',
          note: 'Supports Edge 121+ with native sidebar and local execution.'
        },
        firefox: {
          key: 'firefox',
          label: 'Mozilla Firefox',
          storeName: 'Firefox Add-ons (AMO)',
          badge: 'Available Now',
          status: 'available',
          url: 'https://addons.mozilla.org/en-US/firefox/addon/alfie/',
          icon: 'assets/images/browser-firefox.svg',
          note: 'Official release on Firefox Add-ons (AMO).'
        },
        chrome: {
          key: 'chrome',
          label: 'Google Chrome',
          storeName: 'Chrome Web Store',
          badge: 'Coming Soon',
          status: 'coming-soon',
          url: '',
          icon: 'assets/images/browser-chrome.svg',
          note: 'Store listing is currently in review. Coming soon to Chrome Web Store.'
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

  // Freeze registry to prevent runtime tampering
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
    }
  };

})(typeof window !== 'undefined' ? window : this);
