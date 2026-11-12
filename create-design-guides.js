const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer');
const { mdToPdf } = require('md-to-pdf');

const customer = __dirname;
const designRoot = path.join(customer, 'Design System');
const captureDir = path.join(designRoot, '03 Brand Logo and Assets', 'Screen Captures');
const mdPath = path.join(designRoot, 'Customer-App-Developer-Handoff.md');
const pdfPath = path.join(designRoot, 'Customer-App-Developer-Handoff.pdf');
const jsonPath = path.join(designRoot, 'Customer-App-Developer-Handoff.json');
const cssPath = path.join(customer, 'design-guide-print.css');
fs.mkdirSync(captureDir, { recursive: true });

const printCss = `
@page { size: A4; margin: 15mm 14mm; }
body { font-family: Arial, sans-serif; color: #241828; font-size: 8.5pt; line-height: 1.4; }
h1 { color: #6b16a8; font-size: 25pt; }
h2 { color: #6b16a8; font-size: 17pt; border-bottom: 1px solid #e7d9ef; padding-bottom: 5px; page-break-after: avoid; }
h3 { color: #4a1769; font-size: 11pt; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; font-size: 7.8pt; page-break-inside: auto; table-layout: fixed; }
tr { page-break-inside: avoid; }
th { background: #6b16a8; color: white; }
td, th { border: 1px solid #d8ccdf; padding: 5px; vertical-align: top; overflow-wrap: anywhere; }
tbody tr:nth-child(even) { background: #faf7fc; }
img.screen-capture { display: block; height: 215px; width: auto; margin: 8px auto 12px; border: 1px solid #ddd2e4; }
blockquote { color: #62566a; border-left: 3px solid #c026d3; margin-left: 0; padding-left: 10px; }
hr { page-break-after: always; border: 0; }
`;
fs.writeFileSync(cssPath, printCss);

function esc(v) {
  return String(v ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/[\r\n]+/g, '<br>');
}
function table(headers, rows) {
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n` +
    rows.map(row => `| ${row.map(esc).join(' | ')} |`).join('\n') + '\n';
}
function placement(y, fixed) {
  if (fixed && y > 600) return 'Fixed bottom controls';
  if (y < 90) return 'Top / status area';
  if (y < 240) return 'Header / hero';
  if (y > 680) return 'Bottom action area';
  return 'Main scroll content';
}

(async () => {
  const files = fs.readdirSync(customer).filter(f => f.toLowerCase().endsWith('.html')).sort((a, b) => {
    const order = ['splash.html', 'login.html', 'signup.html', 'verify-otp.html'];
    const ai = order.indexOf(a), bi = order.indexOf(b);
    if (ai >= 0 || bi >= 0) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    return a.localeCompare(b);
  });
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
const sections = [
    '# GlowTap Customer App — Element-by-Element Developer Handoff',
    '',
    `**Screens documented:** ${files.length} · **Viewport:** 390 × 844 CSS px · **Generated:** ${new Date().toLocaleDateString('en-GB')}`,
    '',
    'Implementation reference for developers working without Figma Dev Mode. The main table gives one row per visible UI element, including its exact text, selector, size, position, typography, text colour, fill, border, radius, and spacing. Screen captures and CSS-ready values are taken from the rendered HTML. A companion JSON file contains the same screen data in machine-readable form.',
    '',
    '> Source of truth: the current Customer/*.html prototype and its computed browser styles. Coordinates are CSS pixels from the screen’s top-left at 390 × 844. Font size, weight, line height, letter spacing, text colour, background, border, radius, padding, and margin are listed per element. Use responsive constraints when porting to native layouts; coordinates document the reference composition.',
    '',
  ];
  const screenRecords = [];

  for (const file of files) {
    const filePath = path.join(customer, file);
    await page.goto(pathToFileURL(filePath).href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => document.fonts?.ready || Promise.resolve());
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
    await new Promise(resolve => setTimeout(resolve, 180));
    const data = await page.evaluate(() => {
      const visible = el => {
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0 && r.width > 0 && r.height > 0;
      };
      const selector = el => {
        if (el.id) return `#${el.id}`;
        const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).map(x => '.' + x).join('') : '';
        return el.tagName.toLowerCase() + cls;
      };
      const texts = [];
      const typography = new Map();
      const colors = new Map();
      const gradients = new Map();
      const components = [];
      const nodes = [...document.querySelectorAll('body *')].filter(visible);
      for (const el of nodes) {
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        const directText = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent.trim()).filter(Boolean).join(' ');
        const controlText = ['INPUT', 'TEXTAREA'].includes(el.tagName) ? (el.getAttribute('placeholder') || el.getAttribute('aria-label') || '') : '';
        const text = (directText || controlText).replace(/\s+/g, ' ').trim();
        const componentTags = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A', 'IMG', 'SVG', 'MAIN', 'HEADER', 'NAV', 'FORM', 'SECTION', 'ARTICLE', 'FOOTER'];
        const classText = typeof el.className === 'string' ? el.className : '';
        const namedUiContainer = el.tagName === 'DIV' && /(card|btn|button|field|form|header|nav|tab|dock|hero|row|item|tile|chip|badge|price|title|label|action|search|avatar|icon|sheet|footer|grid|panel|banner|section)/i.test(classText);
        if (text || componentTags.includes(el.tagName) || namedUiContainer) {
          components.push({
            selector: selector(el), tag: el.tagName.toLowerCase(), text: text.slice(0, 140),
            x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height),
            href: el.getAttribute('href') || '', type: el.getAttribute('type') || '',
            role: el.getAttribute('role') || '', ariaLabel: el.getAttribute('aria-label') || '',
            placeholder: el.getAttribute('placeholder') || '', alt: el.getAttribute('alt') || '',
            display: s.display, position: s.position, flexDirection: s.flexDirection,
            alignItems: s.alignItems, justifyContent: s.justifyContent, gap: s.gap,
            flex: s.flex, flexGrow: s.flexGrow, flexShrink: s.flexShrink,
            flexBasis: s.flexBasis, flexWrap: s.flexWrap, alignSelf: s.alignSelf,
            padding: s.padding, margin: s.margin, widthCss: s.width, heightCss: s.height,
            fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
            lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textAlign: s.textAlign, color: s.color,
            background: s.backgroundColor, backgroundImage: s.backgroundImage,
            border: s.border, borderRadius: s.borderRadius, boxShadow: s.boxShadow,
            opacity: s.opacity, overflow: s.overflow, zIndex: s.zIndex,
            src: el.getAttribute('src') || '', objectFit: s.objectFit,
          });
        }
        if (text) {
          const style = [s.fontFamily, s.fontSize, s.fontWeight, s.lineHeight, s.letterSpacing].join('|');
          if (!typography.has(style)) typography.set(style, { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, line: s.lineHeight, spacing: s.letterSpacing, samples: [], selector: selector(el) });
          const rec = typography.get(style);
          if (rec.samples.length < 3 && !rec.samples.includes(text)) rec.samples.push(text.slice(0, 72));
          texts.push({ text: text.slice(0, 140), selector: selector(el), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), fixed: s.position === 'fixed' || s.position === 'absolute' });
        }
        const candidates = [];
        if (text) candidates.push(['Text', s.color]);
        if (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') candidates.push(['Background', s.backgroundColor]);
        for (const [side, color, width, style] of [
          ['top', s.borderTopColor, s.borderTopWidth, s.borderTopStyle],
          ['right', s.borderRightColor, s.borderRightWidth, s.borderRightStyle],
          ['bottom', s.borderBottomColor, s.borderBottomWidth, s.borderBottomStyle],
          ['left', s.borderLeftColor, s.borderLeftWidth, s.borderLeftStyle],
        ]) if (style !== 'none' && parseFloat(width) > 0 && color !== 'transparent') candidates.push([`Border ${side}`, color]);
        if (el.namespaceURI === 'http://www.w3.org/2000/svg') {
          if (s.fill !== 'none' && (el.hasAttribute('fill') || el.tagName.toLowerCase() === 'path' || el.tagName.toLowerCase() === 'circle')) candidates.push(['SVG fill', s.fill]);
          if (s.stroke !== 'none' && s.stroke !== 'rgba(0, 0, 0, 0)') candidates.push(['SVG stroke', s.stroke]);
        }
        for (const [kind, value] of candidates) {
          if (!value || value === 'transparent' || /rgba\([^)]*,\s*0\s*\)$/.test(value)) continue;
          const key = kind + '|' + value;
          if (!colors.has(key)) colors.set(key, { kind, value, selectors: [] });
          const item = colors.get(key);
          if (!item.selectors.includes(selector(el))) item.selectors.push(selector(el));
        }
        if (s.backgroundImage && s.backgroundImage !== 'none') {
          const key = s.backgroundImage;
          if (!gradients.has(key)) gradients.set(key, { value: key, selectors: [] });
          if (!gradients.get(key).selectors.includes(selector(el))) gradients.get(key).selectors.push(selector(el));
        }
      }
      return {
        title: document.querySelector('title')?.textContent || location.pathname.split('/').pop(),
        colors: [...colors.values()], gradients: [...gradients.values()],
        typography: [...typography.values()], texts,
        images: [...document.querySelectorAll('img')].filter(visible).map(img => ({
          src: img.getAttribute('src') || '', alt: img.getAttribute('alt') || '',
          fit: getComputedStyle(img).objectFit, width: Math.round(img.getBoundingClientRect().width),
          height: Math.round(img.getBoundingClientRect().height),
        })), components,
      };
    });

    const slug = path.basename(file, '.html');
    const capture = path.join(captureDir, `${slug}.png`);
    await page.screenshot({ path: capture, fullPage: false });
    const relativeCapture = `03%20Brand%20Logo%20and%20Assets/Screen%20Captures/${slug}.png`;
    const screenRecord = {
      screenName: data.title.replace(/^GlowTap Customer\s*[—-]\s*/i, ''),
      sourceFile: `Customer/${file}`, viewportCssPx: { width: 390, height: 844 },
      screenshot: `03 Brand Logo and Assets/Screen Captures/${slug}.png`,
      colors: data.colors, gradients: data.gradients, typography: data.typography,
      visibleText: data.texts, images: data.images, components: data.components,
    };
    screenRecords.push(screenRecord);
    sections.push(`## ${data.title.replace(/^GlowTap Customer\s*[—-]\s*/i, '')}`);
    sections.push('');
    sections.push(`**Source screen:** Customer/${file} · **Viewport:** 390 × 844 px`);
    sections.push('');
    sections.push(`<img class="screen-capture" src="${relativeCapture}" alt="${esc(data.title)} screen capture">`);
    sections.push('');
    sections.push('### Colours');
    sections.push('');
    sections.push(table(['Property', 'Rendered value', 'Selectors that use it'], data.colors.map(c => [c.kind, c.value, c.selectors.join(', ')])));
    if (data.gradients.length) {
      sections.push('**Gradients and image fills**');
      sections.push('');
      sections.push(table(['Rendered gradient / image', 'Example placement'], data.gradients.map(g => [g.value, g.selectors.join(', ')])));
    }
    if (data.images.length) {
      sections.push('**Screen image assets**');
      sections.push('');
      sections.push(table(['Asset path', 'Alt text', 'Rendered size', 'Fit'], data.images.map(i => [i.src, i.alt, `${i.width} × ${i.height} px`, i.fit])));
    }
    sections.push('### Element-by-element specifications');
    sections.push('');
    sections.push(table(['Element / selector and exact content', 'Position · size (CSS px)', 'Typography · text colour', 'Fill / gradient', 'Border / radius', 'Spacing / layout'], data.components.map(c => [
      `${c.tag} ${c.selector}\n${[c.text, c.placeholder && `placeholder: ${c.placeholder}`, c.ariaLabel && `aria-label: ${c.ariaLabel}`, c.alt && `alt: ${c.alt}`, c.href && `href: ${c.href}`, c.type && `type: ${c.type}`].filter(Boolean).join('\n') || '—'}`,
      `x ${c.x}, y ${c.y}\n${c.width} × ${c.height}\nCSS: ${c.widthCss} × ${c.heightCss}`,
      `${c.fontFamily}\n${c.fontSize} / ${c.fontWeight}\nline ${c.lineHeight} · tracking ${c.letterSpacing}\n${c.color}`,
      `${c.background}\n${c.backgroundImage}`,
      `${c.border}\nradius ${c.borderRadius}`,
      `padding ${c.padding}\nmargin ${c.margin}\n${c.display} · ${c.position}\nflex ${c.flexDirection} · gap ${c.gap}\nalign ${c.alignItems} / ${c.justifyContent}`,
    ])));
    sections.push('');
    sections.push('---');
    sections.push('');
  }
  await browser.close();
  const globalColors = new Map();
  const globalTypography = new Map();
  for (const screen of screenRecords) {
    for (const color of screen.colors) {
      const key = `${color.kind}|${color.value}`;
      if (!globalColors.has(key)) globalColors.set(key, { kind: color.kind, value: color.value, screens: new Set(), selectors: new Set() });
      const token = globalColors.get(key);
      token.screens.add(screen.screenName);
      color.selectors.forEach(s => token.selectors.add(`${screen.screenName}: ${s}`));
    }
    for (const type of screen.typography) {
      const key = [type.font, type.size, type.weight, type.line, type.spacing].join('|');
      if (!globalTypography.has(key)) globalTypography.set(key, { ...type, screens: new Set() });
      globalTypography.get(key).screens.add(screen.screenName);
    }
  }
  const screenIndex = [
    '## Screen index', '',
    table(['Screen', 'HTML file', 'Screen capture'], screenRecords.map(s => [s.screenName, s.sourceFile, s.screenshot])),
    '', '## Screen-by-screen element specifications', '',
  ];
  sections.splice(8, 0, ...screenIndex);
  const jsonTempPath = `${jsonPath}.tmp`;
  fs.writeFileSync(jsonTempPath, JSON.stringify({
    product: 'GlowTap Customer App',
    generatedAt: new Date().toISOString(),
    viewportCssPx: { width: 390, height: 844 },
    source: 'Rendered Customer HTML screens and computed browser styles',
    globalColors: [...globalColors.values()].map(c => ({ ...c, screens: [...c.screens], selectors: [...c.selectors] })),
    globalTypography: [...globalTypography.values()].map(t => ({ ...t, screens: [...t.screens] })),
    screens: screenRecords,
  }, null, 2), 'utf8');
  fs.rmSync(jsonPath, { force: true });
  fs.renameSync(jsonTempPath, jsonPath);
  fs.writeFileSync(mdPath, sections.join('\n'), 'utf8');
  const result = await mdToPdf({ path: mdPath }, { dest: pdfPath, stylesheet: cssPath, pdf_options: { format: 'A4', landscape: true, margin: '12mm' } });
  if (result.error) throw result.error;
  console.log(`Created ${files.length} screen sections: ${pdfPath}`);
})();
