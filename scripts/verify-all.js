const fs = require('fs');
const path = require('path');

const pages = [
  '404.html',
  'index.html',
  'products/index.html',
  'custom-integrations/index.html',
  'terms/index.html',
  'contact/index.html'
];

let totalErrors = 0;

pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');
  const hasMenuToggle = content.includes('class="menu-toggle"');
  const hasNavLinks = content.includes('class="nav-links');
  const dir = path.dirname(p);

  let broken = 0;

  // Check img src and script src
  const srcRegex = /src=["']([^"']+)["']/g;
  let m;
  while ((m = srcRegex.exec(content)) !== null) {
    const src = m[1];
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    const resolved = path.resolve(dir, src);
    if (!fs.existsSync(resolved)) {
      console.error(`[${p}] BROKEN SRC: ${src} -> ${resolved}`);
      broken++;
    }
  }

  // Check href
  const hrefRegex = /href=["']([^"']+)["']/g;
  while ((m = hrefRegex.exec(content)) !== null) {
    const href = m[1];
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) continue;
    const cleanHref = href.split('#')[0].split('?')[0];
    if (!cleanHref) continue;
    const resolved = path.resolve(dir, cleanHref);
    if (!fs.existsSync(resolved)) {
      console.error(`[${p}] BROKEN HREF: ${href} -> ${resolved}`);
      broken++;
    }
  }

  console.log(`[${p}]: menuToggle=${hasMenuToggle}, navLinks=${hasNavLinks}, brokenCount=${broken}`);
  totalErrors += broken;
  if (!hasMenuToggle) {
    console.error(`[${p}] MISSING menu-toggle button!`);
    totalErrors++;
  }
});

// Check latest.json
if (!fs.existsSync('latest.json')) {
  console.error('ERROR: latest.json file missing!');
  totalErrors++;
} else {
  try {
    const parsed = JSON.parse(fs.readFileSync('latest.json', 'utf8'));
    const latestData = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!latestData || !latestData.version || !latestData.url) {
      console.error('ERROR: latest.json missing required version or url property!');
      totalErrors++;
    } else {
      console.log(`✓ latest.json verified (v${latestData.version})`);
    }
  } catch (err) {
    console.error('ERROR: latest.json is invalid JSON!', err);
    totalErrors++;
  }
}

// Check custom-integrations/integrations.json
if (!fs.existsSync('custom-integrations/integrations.json')) {
  console.error('ERROR: custom-integrations/integrations.json missing!');
  totalErrors++;
} else {
  try {
    const integrations = JSON.parse(fs.readFileSync('custom-integrations/integrations.json', 'utf8'));
    if (!Array.isArray(integrations) || integrations.length === 0) {
      console.error('ERROR: integrations.json must be a non-empty array!');
      totalErrors++;
    } else {
      console.log(`✓ integrations.json verified (${integrations.length} custom integrations found)`);
    }
  } catch (err) {
    console.error('ERROR: integrations.json is invalid JSON!', err);
    totalErrors++;
  }
}

// Check Chromium SVG exists
if (!fs.existsSync('assets/images/chromium.svg')) {
  console.error('ERROR: assets/images/chromium.svg is missing!');
  totalErrors++;
} else {
  console.log('✓ Chromium SVG icon verified');
}

// Check CSS brace balance
const css = fs.readFileSync('assets/css/styles.css', 'utf8');
let openBraces = 0;
let closeBraces = 0;
for (const ch of css) {
  if (ch === '{') openBraces++;
  if (ch === '}') closeBraces++;
}
if (openBraces !== closeBraces) {
  console.error(`ERROR: CSS brace mismatch! Open: ${openBraces}, Close: ${closeBraces}`);
  totalErrors++;
} else {
  console.log(`✓ CSS braces balanced (${openBraces} / ${closeBraces})`);
}

// Check JavaScript Syntax of all JS files
const { execSync } = require('child_process');
const jsFiles = [
  'assets/js/main.js',
  'assets/js/products.js',
  'assets/js/instruction-anim.js',
  'assets/js/install-modal.js',
  'assets/js/integrations.js'
];
jsFiles.forEach(f => {
  try {
    execSync(`node -c "${f}"`);
    console.log(`✓ JavaScript syntax valid for ${f}`);
  } catch (err) {
    console.error(`ERROR: Syntax error in ${f}!`);
    totalErrors++;
  }
});

// Verify no "GlitchLabs" in public HTML/JS user-facing copy
const forbiddenBrand = 'GlitchLabs';
pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');
  const occurrences = (content.match(new RegExp(forbiddenBrand, 'gi')) || []).length;
  if (occurrences > 0) {
    console.warn(`[${p}] WARNING: ${occurrences} occurrence(s) of "${forbiddenBrand}" found`);
  } else {
    console.log(`[${p}] ✓ Zero occurrences of "${forbiddenBrand}"`);
  }
});

if (totalErrors === 0) {
  console.log('\n🎉 ALL VERIFICATION CHECKS PASSED WITH ZERO ERRORS!');
  process.exit(0);
} else {
  console.error(`\n❌ Total errors found: ${totalErrors}`);
  process.exit(1);
}
