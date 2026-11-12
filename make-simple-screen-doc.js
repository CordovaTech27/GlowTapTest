const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('md-to-pdf');

const designRoot = path.join(__dirname, 'Design System');
const sourcePath = path.join(designRoot, 'Customer-App-Developer-Handoff.json');
const mdPath = path.join(designRoot, 'Customer-App-Developer-Handoff.md');
const pdfPath = path.join(designRoot, 'Customer-App-Developer-Handoff.pdf');
const cssPath = path.join(__dirname, 'design-guide-print.css');
const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

function rgbToHex(value) {
  const m = String(value).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!m) return value;
  const hex = [m[1], m[2], m[3]].map(n => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  if (m[4] !== undefined && Number(m[4]) === 0) return 'Transparent';
  const alpha = m[4] !== undefined && Number(m[4]) < 1 ? ` (${Math.round(Number(m[4]) * 100)}% opacity)` : '';
  return `#${hex}${alpha}`;
}
function paint(value) {
  if (!value || value === 'none') return 'None';
  if (value === 'rgba(0, 0, 0, 0)') return 'Transparent';
  return value.replace(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/gi, x => rgbToHex(x));
}
function titleCase(s) { return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function elementName(c) {
  const tag = c.tag.toLowerCase();
  const classes = c.selector.replace(/^.*?(?=\.)/, '').split('.').filter(Boolean).join(' ');
  let type = ({ button: 'Button', input: 'Input field', textarea: 'Text area', select: 'Dropdown', a: 'Link', img: 'Image', svg: 'Icon', nav: 'Navigation bar', header: 'Header', main: 'Main content', form: 'Form', section: 'Section', article: 'Card', footer: 'Footer' })[tag];
  if (!type && /^h[1-6]$/.test(tag)) type = 'Heading';
  if (!type && tag === 'label') type = 'Field label';
  if (!type && /badge|pill|status/.test(classes)) type = 'Badge';
  if (!type && /card|tile/.test(classes)) type = 'Card';
  if (!type && /hero/.test(classes)) type = 'Hero area';
  if (!type && /field|input/.test(classes)) type = 'Field';
  if (!type && /row|item/.test(classes)) type = 'Content row';
  if (!type && /icon/.test(classes)) type = 'Icon';
  if (!type && /title|heading/.test(classes)) type = 'Heading';
  if (!type && /label/.test(classes)) type = 'Label';
  if (!type && /button|btn|action/.test(classes)) type = 'Action';
  if (!type) type = c.text ? 'Text' : 'Layout container';
  let detail = c.text || c.placeholder || c.ariaLabel || c.alt || '';
  return `${type}${detail ? ` — “${detail.slice(0, 64)}${detail.length > 64 ? '…' : ''}”` : ''}`;
}
function fontDetails(c) {
  if (!c.text && !c.placeholder) return '—';
  const family = String(c.fontFamily || '').split(',')[0].replace(/['"]/g, '');
  const weights = { '300': 'Light', '400': 'Regular', '500': 'Medium', '600': 'Semi-bold', '700': 'Bold', '800': 'Extra-bold' };
  const weight = weights[c.fontWeight] || `Weight ${c.fontWeight}`;
  return `${family} · ${c.fontSize} · ${weight} (${c.fontWeight}) · line ${c.lineHeight} · spacing ${c.letterSpacing}`;
}
function borderDetails(c) {
  if (!c.border || c.border.startsWith('0px') || c.border.includes('none')) return `No border · radius ${c.borderRadius}`;
  if (/rgba\([^)]*,\s*0\s*\)/.test(c.border)) return `Transparent border · radius ${c.borderRadius}`;
  return `${paint(c.border)} · radius ${c.borderRadius}`;
}
function gradientText(value) {
  if (!value || value === 'none') return 'None';
  const m = value.match(/linear-gradient\(([^,]+),\s*([\s\S]*)\)/i);
  if (!m) return paint(value);
  const angle = m[1].trim();
  const stops = m[2].replace(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/gi, x => rgbToHex(x));
  return `Gradient (${angle}): ${stops}`;
}
function table(headers, rows) {
  const cell = value => String(value ?? '—').replace(/<br>/g, '\u0000').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/[\r\n]+/g, '<br>').replace(/\u0000/g, '<br>');
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(r => `| ${r.map(cell).join(' | ')} |`).join('\n')}\n`;
}
function pxPos(c) { return `Left ${c.x}px · Top ${c.y}px<br>Width ${c.width}px · Height ${c.height}px`; }
function colorsUsed(screen, c) {
  const entries = screen.colors.filter(x => x.selectors.includes(c.selector) && ['Text', 'SVG fill', 'SVG stroke'].includes(x.kind));
  const items = entries.map(x => `${x.kind}: ${paint(x.value)}`);
  if (c.backgroundImage && c.backgroundImage !== 'none') items.push(gradientText(c.backgroundImage));
  return [...new Set(items)].join('<br>') || 'No separate fill';
}

const lines = [
  '# GlowTap Customer App — Simple Screen Details for Developers', '',
  `**${data.screens.length} screens · Reference viewport: 390 × 844 px · Built from the current customer app HTML**`, '',
  'This document explains each screen in plain language. Find the screen name, then find the element you need, such as a button, heading, input field, card, icon, or image. The row shows what the element says, where it sits, how large it is, and how it looks.', '',
  '**Position guide:** Left and Top are measured in pixels from the top-left corner of the 390 × 844 screen. Width and Height are the rendered size. Keep responsive behavior when building the real app; these measurements show the reference layout.', '',
  '**Font guide:** Font size and line height are in pixels. Weight 400 is regular, 500 medium, 600 semi-bold, and 700 bold. Colours are shown as HEX values where possible. “Gradient” shows the direction and colour stops.', '',
  '## Screen list', '',
  table(['Screen name', 'HTML file'], data.screens.map(s => [s.screenName, s.sourceFile])),
  '', '## Screen details', '',
];

for (const screen of data.screens) {
  const slug = path.basename(screen.screenshot, '.png');
  const image = `03%20Brand%20Logo%20and%20Assets/Screen%20Captures/${slug}.png`;
  lines.push(`### ${screen.screenName}`, '');
  lines.push(`**HTML file:** ${screen.sourceFile} · **Screen size:** 390 × 844 px`, '');
  lines.push(`<img class="screen-capture" src="${image}" alt="${screen.screenName} screen">`, '');
  lines.push('#### Elements on this screen', '');
  const components = screen.components.slice().sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = components.map(c => {
    const content = [c.text, c.placeholder && `Placeholder: ${c.placeholder}`, c.ariaLabel && `Accessibility label: ${c.ariaLabel}`, c.alt && `Image description: ${c.alt}`, c.href && `Link: ${c.href}`, c.type && `Input type: ${c.type}`].filter(Boolean).join('<br>') || 'No text';
    const hasGradient = c.backgroundImage && c.backgroundImage !== 'none';
    const fill = [hasGradient ? `Background underneath: ${paint(c.background)}` : `Background: ${paint(c.background)}`, hasGradient ? gradientText(c.backgroundImage) : ''].filter(Boolean).join('<br>');
    const spacing = [`Padding: ${c.padding}`, `Outside spacing: ${c.margin}`, `Layout: ${c.display}${c.position !== 'static' ? ` · ${c.position}` : ''}`, c.gap !== 'normal' ? `Gap: ${c.gap}` : ''].filter(Boolean).join('<br>');
    return [
      `${elementName(c)}<br>HTML match: ${c.selector}`, content,
      pxPos(c), fontDetails(c), colorsUsed(screen, c), `${fill}<br>${borderDetails(c)}`, spacing,
    ];
  });
  lines.push(table(['Element', 'Text or content', 'Position and size', 'Text style', 'Text/icon colour', 'Background and shape', 'Spacing'], rows));
  if (screen.images.length) {
    lines.push('#### Image files used', '');
    lines.push(table(['Image file', 'Description', 'On-screen size', 'Crop style'], screen.images.map(i => [i.src, i.alt || 'No description provided', `${i.width} × ${i.height}px`, i.fit || 'Default'])));
  }
  lines.push('#### Screen colour details', '');
  lines.push(table(['Colour / gradient', 'Type', 'Appears on'], screen.colors.map(c => [paint(c.value), c.kind, c.selectors.join(', ')])));
  if (screen.gradients.length) {
    lines.push('#### Gradient details', '');
    lines.push(table(['Gradient', 'Element'], screen.gradients.map(g => [gradientText(g.value), g.selectors.join(', ')])));
  }
  lines.push('', '---', '');
}

(async () => {
  fs.writeFileSync(mdPath, lines.join('\n'), 'utf8');
  const result = await mdToPdf({ path: mdPath }, {
    dest: pdfPath, stylesheet: cssPath,
    pdf_options: { format: 'A4', landscape: true, margin: '12mm' },
  });
  if (result.error) throw result.error;
  console.log(`Wrote the plain-language element reference for ${data.screens.length} screens.`);
})();
