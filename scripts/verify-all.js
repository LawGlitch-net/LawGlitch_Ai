const fs = require('fs');
const path = require('path');

const pages = [
  '404.html',
  'index.html',
  'products/index.html',
  'dashboard/index.html',
  'terms/index.html'
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

// Check Microsoft Edge and Firefox in products.js and products/index.html
const productsJs = fs.readFileSync('assets/js/products.js', 'utf8');
const productsHtml = fs.readFileSync('products/index.html', 'utf8');
const edgeUrl = 'https://microsoftedge.microsoft.com/addons/detail/alifie/ghcjkpeimdeacochedajjlijbinmmege';
const firefoxUrl = 'https://addons.mozilla.org/en-US/firefox/addon/alfie/';

if (!productsJs.includes(edgeUrl)) {
  console.error('ERROR: Microsoft Edge addon store link missing in assets/js/products.js!');
  totalErrors++;
} else {
  console.log('✓ Edge addon store link verified in products.js registry');
}

if (!productsJs.includes(firefoxUrl)) {
  console.error('ERROR: Firefox addon store link missing in assets/js/products.js!');
  totalErrors++;
} else {
  console.log('✓ Firefox addon store link verified in products.js registry');
}

if (!productsHtml.includes(edgeUrl) || !productsHtml.includes(firefoxUrl)) {
  console.error('ERROR: Direct store links missing in products/index.html!');
  totalErrors++;
} else {
  console.log('✓ Direct store links verified in products/index.html browser matrix');
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
const jsFiles = ['assets/js/main.js', 'assets/js/products.js', 'assets/js/install-modal.js'];
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
