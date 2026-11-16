'use client';

import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

/* ---------- helpers ---------- */
const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const money = (n) => '$' + num(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let uid = 1;
const nid = () => 'r' + (uid++);

/* ---------- icons (lucide paths) ---------- */
const ICONS = {
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/>',
  list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
  loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  hammer: '<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  stop: '<rect width="14" height="14" x="5" y="5" rx="2"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
};
const Icon = ({ name, size = 18, className = '' }) => html`<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=${className} aria-hidden="true" dangerouslySetInnerHTML=${{ __html: ICONS[name] }}></svg>`;

/* ---------- smart estimate engine (simulated AI) ---------- */
const maxNum = (t, re, dflt) => {
  let best = 0;
  for (const m of t.matchAll(new RegExp(re.source, 'gi'))) best = Math.max(best, parseFloat(m[1].replace(/,/g, '')));
  return best || dflt;
};
const AREA_RE = /(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square\s*feet|sf)\b/;
const mk = (cat, desc, qty, unit, cost) => ({ id: nid(), cat, desc, qty, unit, cost });

function buildEstimate(jobType, notes, rate) {
  const t = notes.toLowerCase();
  const M = (d, q, u, c) => mk('material', d, q, u, c);
  const Lb = (d, h) => mk('labor', d, r2(Math.max(h, 0.5)), 'hrs', rate);
  const F = (d, q, c) => mk('fee', d, q, 'ea', c);
  let rows = [];

  if (jobType === 'Fencing') {
    const len = Math.round(maxNum(t, /(\d[\d,]*)\s*-?\s*(?:linear\s*)?(?:ft|feet|foot|lf)\b/, 150));
    const hm = t.match(/\b(\d{1,2})\s*-?\s*(?:ft|foot|')\s*(?:tall\s*)?(?:cedar|privacy|wood|picket|fence|vinyl|chain)/);
    const h = Math.min(10, Math.max(3, hm ? parseInt(hm[1], 10) : 6));
    const gm = t.match(/(\d+|one|two|three|four)\s*(?:walk\s*|drive\s*)?gates?/);
    const words = { one: 1, two: 2, three: 3, four: 4 };
    const gates = gm ? (words[gm[1]] || parseInt(gm[1], 10)) : (/gate/.test(t) ? 1 : 0);
    const tear = /tear|remove|demo|haul|old fence/.test(t);
    const material = /vinyl/.test(t) ? 'Vinyl' : /chain/.test(t) ? 'Chain-link' : /pine|treated/.test(t) ? 'Treated pine' : 'Cedar';
    const sections = Math.ceil(len / 8);
    const posts = sections + 1 + gates * 2;
    rows = [
      M(`4x4x10 treated posts (${h}ft fence, 8ft on center)`, posts, 'ea', 19.75),
      M('2x4x8 cedar rails (3 per section)', sections * 3, 'ea', 8.4),
      M(`1x6x${h} ${material} pickets`, Math.ceil(len * 2.2), 'ea', r2(0.82 * h)),
      M('2x6x8 cap rail and trim board', sections, 'ea', 14.5),
      M('50 lb fast-set concrete', posts * 2, 'bag', 5.95),
      M('Exterior screws, 5 lb box', Math.ceil(len / 40), 'box', 36),
    ];
    if (gates) rows.push(M('Gate frame kit with hinges and latch', gates, 'ea', 145));
    rows.push(Lb(`Layout, post setting and rail install (${len} ft)`, len * 0.16));
    rows.push(Lb('Picket install, cap rail and trim', len * 0.1));
    if (gates) rows.push(Lb('Build and hang gates', gates * 3.5));
    if (tear) {
      rows.push(Lb('Tear down and stack old fence', len * 0.05));
      rows.push(F('Dumpster / haul-off for old fence', 1, 325));
    }
    rows.push(F('City permit (if required)', 1, 75));
  } else if (jobType === 'Roofing') {
    const sqft = Math.round(maxNum(t, AREA_RE, 2000));
    const sq = sqft / 100;
    const squares = Math.ceil(sq * 1.1);
    const perim = Math.sqrt(sqft) * 4;
    const tear = !/new construction|new build/.test(t);
    rows = [
      M('Architectural shingles, 3 bundles per square', squares * 3, 'bndl', 36.5),
      M('Synthetic underlayment, 10 sq roll', Math.ceil(squares / 10), 'roll', 118),
      M('Ice and water shield (valleys and eaves)', Math.max(2, Math.ceil(sqft / 1200)), 'roll', 96),
      M('Hip and ridge cap shingles', Math.ceil(sq / 3.5), 'bndl', 58),
      M('Drip edge, 10 ft', Math.ceil(perim / 10), 'pc', 9.8),
      M('Ridge vent, 4 ft section', Math.ceil(sq / 6), 'pc', 24),
      M('Pipe boots and flashing kits', 4, 'ea', 18),
      M('Roofing nails, coil box', Math.ceil(squares / 8), 'box', 42),
    ];
    if (tear) rows.push(Lb(`Tear-off existing roof (${squares} squares)`, squares * 1.1));
    rows.push(Lb(`Install underlayment and shingles (${squares} squares)`, squares * 2.6));
    rows.push(Lb('Flashing, vents and site cleanup', 4));
    if (tear) rows.push(F('30-yard dumpster and landfill fees', 1, 465));
    rows.push(F('City roofing permit', 1, 185));
  } else if (jobType === 'Landscaping') {
    const patio = /paver|patio|hardscape|walkway/.test(t);
    const sod = /sod|lawn|grass|turf/.test(t);
    const doPatio = patio;
    const doSod = sod || !patio;
    const sqft = Math.round(maxNum(t, AREA_RE, 300));
    const sm = t.match(/(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft)\s*(?:of\s*)?(?:sod|lawn|grass)/);
    const sodSq = sm ? parseInt(sm[1].replace(/,/g, ''), 10) : (patio ? 600 : sqft);
    if (doPatio) {
      const pad = sqft;
      rows.push(M('Concrete pavers (8% cut waste)', Math.ceil(pad * 1.08), 'sq ft', 3.85));
      rows.push(M('Compactable base gravel, 4 in', Math.ceil(pad * 4 / 12 / 27 * 1.4 * 10) / 10, 'ton', 42));
      rows.push(M('Bedding sand, 1 in', Math.ceil(pad / 12 / 27 * 10) / 10, 'cu yd', 38));
      rows.push(M('Paver edge restraint', Math.ceil(Math.sqrt(pad) * 4), 'ft', 1.65));
      rows.push(M('Polymeric joint sand, 50 lb', Math.ceil(pad / 40), 'bag', 34));
      rows.push(Lb(`Excavate and grade patio base (${pad} sq ft)`, pad * 0.05));
      rows.push(Lb('Compact base and screed sand', pad * 0.03));
      rows.push(Lb('Lay, cut and sweep pavers', pad * 0.11));
    }
    if (doSod) {
      rows.push(M('Sod, Bermuda or St. Augustine (5% waste)', Math.ceil(sodSq * 1.05), 'sq ft', 0.45));
      rows.push(M('Topsoil / soil prep', Math.ceil(sodSq * 2 / 12 / 27 * 10) / 10, 'cu yd', 34));
      rows.push(M('Starter fertilizer, 40 lb', Math.max(1, Math.ceil(sodSq / 2500)), 'bag', 48));
      rows.push(Lb(`Grade, prep and lay sod (${sodSq} sq ft)`, sodSq * 0.014 + 2));
    }
    if (!doPatio && /mulch|bed/.test(t)) {
      rows.push(M('Hardwood mulch', 6, 'cu yd', 38));
      rows.push(Lb('Edge beds and spread mulch', 6));
    }
    rows.push(F('Skid steer rental and soil haul-off', 1, 295));
  } else {
    const sqft = Math.round(maxNum(t, AREA_RE, 120));
    const kitchen = /kitchen/.test(t);
    const bath = /bath/.test(t) || !kitchen;
    rows = [
      M('2x4 framing lumber and blocking', Math.ceil(sqft * 0.35), 'ea', 4.75),
      M('1/2 in drywall sheets, 4x8', Math.ceil(sqft * 0.09), 'sheet', 14.75),
      M('Joint compound, tape and screws', 1, 'kit', 48),
      M('Interior paint, primer plus 2 coats', Math.ceil(sqft * 0.04), 'gal', 42),
      M('Flooring / tile (10% waste)', Math.ceil(sqft * 1.1), 'sq ft', 4.8),
      M('Thinset, grout and sealer', Math.ceil(sqft / 40), 'bag', 36),
      M('Plumbing and electrical rough-in allowance', 1, 'lot', 1100),
    ];
    if (bath) rows.push(M('Vanity, toilet and fixtures allowance', 1, 'lot', 1350));
    if (kitchen) {
      rows.push(M('Cabinet allowance', 1, 'lot', 3800));
      rows.push(M('Countertop allowance', 1, 'lot', 2400));
    }
    rows.push(Lb(`Demolition and prep (${sqft} sq ft)`, sqft * 0.2));
    rows.push(Lb('Framing and drywall', sqft * 0.35));
    rows.push(Lb('Flooring / tile install', sqft * 0.3));
    rows.push(Lb('Paint, trim and finish', sqft * 0.15));
    rows.push(Lb('Plumbing and electrical coordination', 8));
    rows.push(F('10-yard dumpster and disposal', 1, 385));
    rows.push(F('Building permit', 1, 150));
  }
  return rows;
}

/* ---------- totals ---------- */
function calc(items, markupPct, taxPct) {
  let mat = 0, lab = 0, fee = 0, mkp = 0;
  const m = num(markupPct);
  items.forEach((it) => {
    const lt = r2(num(it.qty) * num(it.cost));
    if (it.cat === 'material') { mat += lt; mkp += r2(lt * m / 100); }
    else if (it.cat === 'labor') lab += lt;
    else fee += lt;
  });
  mat = r2(mat); lab = r2(lab); fee = r2(fee); mkp = r2(mkp);
  const subtotal = r2(mat + lab + fee);
  const taxable = r2(mat + mkp);
  const tax = r2(taxable * num(taxPct) / 100);
  const total = r2(subtotal + mkp + tax);
  return { mat, lab, fee, subtotal, markup: mkp, taxable, tax, total };
}

/* ---------- presets ---------- */
const PRESETS = [
  { label: '200-ft Cedar Fence', jobType: 'Fencing', customer: 'Maria Gonzalez', address: '4821 Seawall Blvd, Galveston, TX 77550',
    notes: '200-ft 6ft Cedar Privacy Fence with 2 gates and old fence tear-down. Remove and haul off the existing fence along the back and sides, set new posts in concrete, install cap rail and trim. One 4ft walk gate and one 10ft drive gate.' },
  { label: '2,400 sq ft Roof', jobType: 'Roofing', customer: 'James and Linda Carter', address: '1208 Ball Ave, Galveston, TX 77550',
    notes: '2,400 sq ft Architectural Shingle Roof Replacement. Tear off one layer of old shingles, replace with synthetic underlayment, ice and water shield in valleys, new drip edge, ridge vent and pipe flashings.' },
  { label: 'Paver Patio + Sod', jobType: 'Landscaping', customer: 'Danielle Brooks', address: '77 Palm Court, League City, TX 77573',
    notes: 'Backyard Paver Patio 400 sq ft with Sod. Excavate and grade, compacted gravel base, concrete pavers with edge restraint, then lay 600 sq ft of new sod around the patio.' },
];

const DEFAULT_TERMS = [
  '50% deposit due at signing to schedule the job. Balance due upon completion.',
  'We accept check, ACH, and major credit cards. Card payments may carry a 3% fee.',
  'This proposal is valid for 30 days. Material prices may change after that date.',
  'Changes to the scope of work will be priced in a written change order before work begins.',
  'Texas sales tax is applied to materials.',
].join('\n');

const TERMS_PRESETS = [
  { label: '50% Deposit / 50% Upon Completion', text: '50% deposit due at signing to schedule the job.\n50% balance due upon completion.' },
  { label: 'Due Upon Receipt', text: 'Full payment is due upon receipt of invoice.' },
  { label: 'Net 15', text: 'Payment is due within 15 days of the invoice date.' },
  { label: '1/3 Deposit, 1/3 Progress, 1/3 Final', text: '1/3 deposit due at signing to schedule the job.\n1/3 progress payment due at the project midpoint.\n1/3 final payment due upon completion.' },
];

const DEFAULTS = { name: 'Lone Star Fence & Roof Co.', phone: '(409) 555-0142', email: 'quotes@lonestarfence.com', rate: 85, markup: 20, tax: 8.25, logo: '', accent: 'amber', terms: DEFAULT_TERMS };
const STORE_KEY = 'quotesnap.settings.v1';

/* Read an image file, shrink it to 400px max, and return a PNG data URL (stays on this device). */
const fileToLogo = (file) => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onerror = () => reject(new Error('Could not read that file.'));
  fr.onload = () => {
    const img = new Image();
    img.onerror = () => reject(new Error('That file is not a usable image.'));
    img.onload = () => {
      const w0 = img.naturalWidth || 300;
      const h0 = img.naturalHeight || 150;
      const scale = Math.min(1, 400 / Math.max(w0, h0));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w0 * scale));
      c.height = Math.max(1, Math.round(h0 * scale));
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/png'));
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(file);
});
const STEPS = ['Reading job description...', 'Measuring quantities...', 'Pricing materials...', 'Estimating labor hours...', 'Adding disposal and permit fees...'];
/* ---------- brand colors for the proposal ---------- */
const BRANDS = {
  amber: { name: 'Amber', main: '#f59e0b', on: '#0f172a', text: '#b45309', soft: '#fef3c7' },
  navy: { name: 'Navy Blue', main: '#1e3a8a', on: '#ffffff', text: '#1e3a8a', soft: '#dbeafe' },
  green: { name: 'Forest Green', main: '#166534', on: '#ffffff', text: '#166534', soft: '#dcfce7' },
  crimson: { name: 'Crimson Red', main: '#b91c1c', on: '#ffffff', text: '#b91c1c', soft: '#fee2e2' },
  slate: { name: 'Slate Black', main: '#0f172a', on: '#ffffff', text: '#0f172a', soft: '#e2e8f0' },
};

const STATUSES = ['Draft', 'Sent', 'Approved'];
const STATUS_TONE = {
  Draft: 'bg-slate-100 text-slate-700 ring-slate-300',
  Sent: 'bg-blue-100 text-blue-800 ring-blue-300',
  Approved: 'bg-green-100 text-green-800 ring-green-300',
};
const CAT_TONE = {
  material: 'bg-slate-100 text-slate-800 ring-slate-300',
  labor: 'bg-amber-100 text-amber-900 ring-amber-300',
  fee: 'bg-sky-100 text-sky-900 ring-sky-300',
};
const CAT_OPTS = [['material', 'Material'], ['labor', 'Labor'], ['fee', 'Fee']];
const STATUS_OPTS = STATUSES.map((s) => [s, s]);
const QUOTES_KEY = 'quotesnap.quotes.v1';

const TABS = [
  { id: 'settings', label: 'Company Settings', icon: 'sliders' },
  { id: 'quote', label: 'New Quote', icon: 'filePlus' },
  { id: 'items', label: 'Line Items', icon: 'list' },
  { id: 'proposal', label: 'Proposal', icon: 'fileText' },
  { id: 'history', label: 'Saved Quotes', icon: 'folder' },
];

const EXTRA_CSS = `
@keyframes qs-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.qs-fade { animation: qs-fade 0.25s ease-out; }
@media print { .qs-fade { animation: none !important; } }
`;

const toDraft = (s) => ({ ...s, rate: String(s.rate), markup: String(s.markup), tax: String(s.tax) });
const fmtDate = (d) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const fmtShort = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ---------- small UI pieces ---------- */
const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-200';
const cellCls = 'w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200';
const ROWGRID = 'grid grid-cols-[132px_minmax(0,1fr)_88px_76px_112px_112px_36px] items-center gap-2';

const Field = ({ label, hint, children }) => html`
  <label className="block">
    <span className="mb-1 block text-sm font-bold text-slate-800">${label}</span>
    ${children}
    ${hint && html`<span className="mt-1 block text-xs text-slate-600">${hint}</span>`}
  </label>`;

const Affix = ({ pre, post, children }) => html`
  <div className="relative">
    ${pre && html`<span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">${pre}</span>`}
    ${children}
    ${post && html`<span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">${post}</span>`}
  </div>`;

const Btn = ({ onClick, icon, children, kind = 'primary', disabled, className = '' }) => {
  const kinds = {
    primary: 'bg-amber-500 text-slate-900 hover:bg-amber-400 border-amber-600',
    dark: 'bg-slate-900 text-white hover:bg-slate-700 border-slate-900',
    light: 'bg-white text-slate-900 hover:bg-slate-50 border-slate-300',
    danger: 'bg-white text-red-700 hover:bg-red-50 border-red-300',
    dangerSolid: 'bg-red-600 text-white hover:bg-red-500 border-red-700',
  };
  return html`<button type="button" onClick=${onClick} disabled=${disabled}
    className=${`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm transition duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${kinds[kind]} ${className}`}>
    ${icon && html`<${Icon} name=${icon} size=${18} />`}${children}
  </button>`;
};

const Card = ({ title, subtitle, right, children }) => html`
  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5 transition-shadow duration-200 hover:shadow-md">
    ${(title || right) && html`
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">${title}</h2>
          ${subtitle && html`<p className="text-sm text-slate-600">${subtitle}</p>`}
        </div>
        ${right}
      </div>`}
    <div className="p-4 sm:p-5">${children}</div>
  </section>`;

const Empty = ({ title, text, icon = 'fileText', children }) => html`
  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700"><${Icon} name=${icon} size=${24} /></div>
    <h2 className="text-lg font-extrabold">${title}</h2>
    <p className="mx-auto mt-1 max-w-md text-slate-600">${text}</p>
    <div className="mt-4 flex flex-wrap justify-center gap-2">${children}</div>
  </div>`;

const Badge = ({ tone, children }) => html`
  <span className=${`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ring-1 ring-inset ${tone}`}>${children}</span>`;

/* A select that looks like a badge. Used for item category and quote status. */
const PillSelect = ({ value, onChange, tone, options, label }) => html`
  <span className="relative inline-block">
    <select aria-label=${label} value=${value} onChange=${(e) => onChange(e.target.value)}
      className=${`cursor-pointer appearance-none rounded-full py-1 pl-3 pr-7 text-xs font-extrabold uppercase tracking-wide ring-1 ring-inset transition focus:outline-none focus:ring-2 ${tone}`}>
      ${options.map(([v, l]) => html`<option key=${v} value=${v}>${l}</option>`)}
    </select>
    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-70"><${Icon} name="chevron" size=${14} /></span>
  </span>`;

/* ---------- line item rows (table on desktop, cards on phones) ---------- */
const ItemRow = ({ it, onChange, onDelete }) => {
  const lt = r2(num(it.qty) * num(it.cost));
  return html`
    <div className=${`${ROWGRID} border-t border-slate-200 px-3 py-2 transition-colors hover:bg-slate-50`}>
      <div><${PillSelect} label="Item type" value=${it.cat} tone=${CAT_TONE[it.cat]} options=${CAT_OPTS} onChange=${(v) => onChange({ cat: v })} /></div>
      <input aria-label="Description" className=${cellCls} value=${it.desc} placeholder="Description" onInput=${(e) => onChange({ desc: e.target.value })} />
      <input aria-label="Quantity" type="number" inputMode="decimal" min="0" step="any" className=${cellCls} value=${it.qty} onInput=${(e) => onChange({ qty: e.target.value })} />
      <input aria-label="Unit" className=${cellCls} value=${it.unit} onInput=${(e) => onChange({ unit: e.target.value })} />
      <input aria-label="Unit cost" type="number" inputMode="decimal" min="0" step="any" className=${cellCls} value=${it.cost} onInput=${(e) => onChange({ cost: e.target.value })} />
      <div className="text-right text-sm font-extrabold tabular-nums">${money(lt)}</div>
      <button type="button" aria-label="Delete row" onClick=${onDelete} className="rounded-md p-2 text-red-700 transition hover:bg-red-50"><${Icon} name="trash" size=${18} /></button>
    </div>`;
};

const ItemCard = ({ it, onChange, onDelete }) => {
  const lt = r2(num(it.qty) * num(it.cost));
  return html`
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <${PillSelect} label="Item type" value=${it.cat} tone=${CAT_TONE[it.cat]} options=${CAT_OPTS} onChange=${(v) => onChange({ cat: v })} />
        <div className="flex items-center gap-1">
          <span className="text-base font-extrabold tabular-nums">${money(lt)}</span>
          <button type="button" aria-label="Delete row" onClick=${onDelete} className="rounded-md p-2 text-red-700 transition hover:bg-red-50"><${Icon} name="trash" size=${18} /></button>
        </div>
      </div>
      <input aria-label="Description" className=${`${cellCls} mt-2`} value=${it.desc} placeholder="Description" onInput=${(e) => onChange({ desc: e.target.value })} />
      <div className="mt-2 grid grid-cols-3 gap-2">
        <label className="block"><span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Qty</span>
          <input type="number" inputMode="decimal" min="0" step="any" className=${cellCls} value=${it.qty} onInput=${(e) => onChange({ qty: e.target.value })} /></label>
        <label className="block"><span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Unit</span>
          <input className=${cellCls} value=${it.unit} onInput=${(e) => onChange({ unit: e.target.value })} /></label>
        <label className="block"><span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Unit cost</span>
          <input type="number" inputMode="decimal" min="0" step="any" className=${cellCls} value=${it.cost} onInput=${(e) => onChange({ cost: e.target.value })} /></label>
      </div>
    </div>`;
};

/* ---------- on-screen signature pad (finger or mouse) ---------- */
const SignaturePad = ({ onApprove }) => {
  const ref = useRef(null);
  const drawing = useRef(false);
  const [has, setHas] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = Math.round(rect.width * ratio);
    c.height = Math.round(rect.height * ratio);
    const ctx = c.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
  }, []);

  const pos = (e) => {
    const r = ref.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e) => {
    e.preventDefault();
    try { ref.current.setPointerCapture(e.pointerId); } catch (err) {}
    drawing.current = true;
    const { x, y } = pos(e);
    const ctx = ref.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.01, y);
    ctx.stroke();
    setHas(true);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const { x, y } = pos(e);
    const ctx = ref.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const up = () => { drawing.current = false; };
  const clear = () => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
    setHas(false);
  };

  return html`
    <div>
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-400 bg-slate-50">
        <canvas ref=${ref} aria-label="Signature box" className="block h-40 w-full cursor-crosshair"
          style=${{ touchAction: 'none' }}
          onPointerDown=${down} onPointerMove=${move} onPointerUp=${up} onPointerCancel=${up} onPointerLeave=${up}></canvas>
        ${!has && html`<span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-sm font-bold text-slate-400"><${Icon} name="pen" size=${18} />Sign here with your finger or mouse</span>`}
        <span className="pointer-events-none absolute bottom-8 left-4 right-4 border-b border-slate-300"></span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <${Btn} kind="light" icon="eraser" onClick=${clear} disabled=${!has}>Clear<//>
        <${Btn} icon="check" onClick=${() => onApprove(ref.current.toDataURL('image/png'))} disabled=${!has}>Approve and Stamp Today's Date<//>
      </div>
    </div>`;
};

/* ---------- editable payment terms (presets + free text) ---------- */
const TermsEditor = ({ value, onChange, rows = 5 }) => html`
  <div>
    <div className="mb-2 flex flex-wrap gap-2">
      <span className="self-center text-xs font-bold uppercase tracking-wide text-slate-600">Quick fill:</span>
      ${TERMS_PRESETS.map((p) => html`<button key=${p.label} type="button" onClick=${() => onChange(p.text)}
        className="rounded-full border border-amber-500 bg-amber-100 px-3 py-1.5 text-sm font-bold text-slate-900 transition hover:bg-amber-200 active:scale-[0.97]">${p.label}</button>`)}
    </div>
    <textarea rows=${rows} className=${inputCls} value=${value} onInput=${(e) => onChange(e.target.value)}
      placeholder="Type your own payment plan. Example: $2,000 deposit at signing, $1,500 at framing, balance on completion. Zelle: 409-555-0142. Venmo: @yourcompany. Checks payable to Your Company."></textarea>
    <p className="mt-1 text-xs text-slate-600">Each new line prints as its own line on the proposal.</p>
  </div>`;

/* ---------- app ---------- */
export default function App() {
  const [view, setView] = useState('quote');
  const [saved, setSaved] = useState(DEFAULTS);
  const [draft, setDraft] = useState(toDraft(DEFAULTS));
  const [q, setQ] = useState({ customer: '', address: '', jobType: 'Fencing', notes: '' });
  const [items, setItems] = useState([]);
  const [markup, setMarkup] = useState(DEFAULTS.markup);
  const [tax, setTax] = useState(DEFAULTS.tax);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');
  const [qNo, setQNo] = useState(1041);
  const [qDate, setQDate] = useState(null);
  const [logoErr, setLogoErr] = useState('');
  const [notice, setNotice] = useState('');
  const [listening, setListening] = useState(false);
  const [speechOk, setSpeechOk] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [status, setStatus] = useState('Draft');
  const [signature, setSignature] = useState('');
  const [approvedOn, setApprovedOn] = useState('');
  const [terms, setTerms] = useState(DEFAULTS.terms);
  const [filter, setFilter] = useState('All');
  const [confirmId, setConfirmId] = useState(null);
  const recRef = useRef(null);
  const baseRef = useRef('');
  const toastT = useRef(null);

  /* Load saved settings and quotes once on the client (localStorage is not available on the server). */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = { ...DEFAULTS, ...JSON.parse(raw) };
        setSaved(s);
        setDraft(toDraft(s));
        setMarkup(s.markup); setTax(s.tax); setTerms(s.terms);
      }
    } catch (e) {}
    try {
      const rawQ = localStorage.getItem(QUOTES_KEY);
      if (rawQ) {
        const list = JSON.parse(rawQ);
        if (Array.isArray(list)) setQuotes(list);
      }
    } catch (e) {}
    setQDate(new Date());
    setSpeechOk(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    setHydrated(true);
    return () => { try { recRef.current && recRef.current.abort(); } catch (e) {} };
  }, []);

  /* Every change to the open quote is written back to its saved record. */
  useEffect(() => {
    if (!currentId) return;
    const total = calc(items, markup, tax).total;
    setQuotes((list) => list.map((x) => (x.id === currentId
      ? { ...x, customer: q.customer, address: q.address, jobType: q.jobType, notes: q.notes, items, markup, tax, total, status, signature, approvedOn, terms }
      : x)));
  }, [currentId, q, items, markup, tax, status, signature, approvedOn, terms]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes)); } catch (e) {}
  }, [quotes, hydrated]);

  const flash = (m) => {
    setToast(m);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(''), 2600);
  };

  /* settings */
  const draftSet = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const draftNums = { rate: num(draft.rate), markup: num(draft.markup), tax: num(draft.tax) };
  const dirty = draft.name !== saved.name || draft.phone !== saved.phone || draft.email !== saved.email ||
    draft.logo !== saved.logo || draft.accent !== saved.accent || draft.terms !== saved.terms ||
    draftNums.rate !== saved.rate || draftNums.markup !== saved.markup || draftNums.tax !== saved.tax;
  const saveSettings = () => {
    const s = { name: draft.name, phone: draft.phone, email: draft.email, logo: draft.logo, accent: draft.accent, terms: draft.terms, ...draftNums };
    setSaved(s);
    if (!generated) { setMarkup(s.markup); setTax(s.tax); setTerms(s.terms); }
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
    flash('Settings saved. New quotes will use them.');
  };
  const resetSettings = () => setDraft((d) => toDraft({ ...DEFAULTS, logo: d.logo }));
  const onLogoFile = async (file) => {
    if (!file) return;
    setLogoErr('');
    if (!file.type.startsWith('image/')) { setLogoErr('Please choose an image file (PNG, JPG, SVG).'); return; }
    if (file.size > 8 * 1024 * 1024) { setLogoErr('That image is over 8 MB. Try a smaller one.'); return; }
    try { draftSet('logo', await fileToLogo(file)); } catch (e) { setLogoErr(e.message); }
  };

  /* quote form */
  const loadPreset = (p) => {
    setQ((cur) => ({ customer: cur.customer.trim() ? cur.customer : p.customer, address: cur.address.trim() ? cur.address : p.address, jobType: p.jobType, notes: p.notes }));
    setErr('');
  };

  /* voice input */
  const stopMic = () => { try { recRef.current && recRef.current.stop(); } catch (e) {} };
  const toggleMic = () => {
    if (listening) { stopMic(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setErr('Voice input is not supported in this browser. Try Chrome or Safari.'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    baseRef.current = q.notes.trim() ? q.notes.replace(/\s*$/, ' ') : '';
    rec.onresult = (e) => {
      let text = '';
      for (let k = 0; k < e.results.length; k++) text += e.results[k][0].transcript;
      setQ((cur) => ({ ...cur, notes: baseRef.current + text.trim() }));
    };
    rec.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setErr('Microphone is blocked. Allow mic access for this site in your browser settings.');
      else if (e.error !== 'no-speech' && e.error !== 'aborted') setErr('Voice input stopped (' + e.error + '). Tap the mic to try again.');
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setErr('');
    try { rec.start(); setListening(true); } catch (e) { setListening(false); }
  };

  /* saved quotes */
  const beginQuote = (rows) => {
    const now = new Date();
    const no = Math.max(1041, ...quotes.map((x) => x.qNo || 0)) + 1;
    const rec = {
      id: 'q' + now.getTime().toString(36) + Math.random().toString(36).slice(2, 6),
      qNo: no, createdAt: now.toISOString(),
      customer: q.customer, address: q.address, jobType: q.jobType, notes: q.notes,
      items: rows, markup: saved.markup, tax: saved.tax,
      total: calc(rows, saved.markup, saved.tax).total,
      status: 'Draft', signature: '', approvedOn: '', terms: saved.terms,
    };
    setQuotes((l) => [rec, ...l]);
    setCurrentId(rec.id); setQNo(no); setQDate(now);
    setItems(rows); setMarkup(saved.markup); setTax(saved.tax);
    setStatus('Draft'); setSignature(''); setApprovedOn(''); setTerms(saved.terms); setGenerated(true);
  };
  const newQuote = () => {
    stopMic();
    setCurrentId(null);
    setQ({ customer: '', address: '', jobType: 'Fencing', notes: '' });
    setItems([]); setGenerated(false); setStatus('Draft'); setSignature(''); setApprovedOn(''); setTerms(saved.terms);
    setNotice(''); setErr(''); setView('quote');
  };
  const openQuote = (rec, goTo) => {
    stopMic();
    setQ({ customer: rec.customer, address: rec.address, jobType: rec.jobType, notes: rec.notes });
    setItems(rec.items.map((it) => ({ ...it, id: nid() })));
    setMarkup(rec.markup); setTax(rec.tax);
    setQNo(rec.qNo); setQDate(new Date(rec.createdAt));
    setStatus(rec.status); setSignature(rec.signature || ''); setApprovedOn(rec.approvedOn || ''); setTerms(rec.terms || saved.terms);
    setGenerated(true); setNotice(''); setCurrentId(rec.id);
    setView(goTo);
  };
  const deleteQuote = (id) => {
    setQuotes((l) => l.filter((x) => x.id !== id));
    setConfirmId(null);
    if (id === currentId) {
      setCurrentId(null); setItems([]); setGenerated(false);
      setStatus('Draft'); setSignature(''); setApprovedOn('');
    }
    flash('Quote deleted.');
  };
  const changeStatus = (id, st) => {
    setQuotes((l) => l.map((x) => (x.id === id ? { ...x, status: st } : x)));
    if (id === currentId) setStatus(st);
  };

  /* generate with Claude (falls back to the built-in estimator) */
  const generate = async () => {
    if (!q.notes.trim()) { setErr('Add a job description first, or tap one of the sample jobs.'); return; }
    stopMic();
    setErr(''); setNotice(''); setLoading(true); setStep(0);
    let i = 0;
    const iv = setInterval(() => { i += 1; setStep(Math.min(i, STEPS.length - 1)); }, 900);
    let rows;
    let source = 'claude';
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobType: q.jobType, notes: q.notes, rate: saved.rate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      rows = data.items.map((it) => ({ id: nid(), ...it }));
    } catch (e) {
      source = 'builtin';
      rows = buildEstimate(q.jobType, q.notes, saved.rate);
      setNotice('Claude was unavailable (' + e.message + ') so this estimate came from the built-in estimator.');
    }
    clearInterval(iv);
    beginQuote(rows);
    setLoading(false); setView('items');
    flash(source === 'claude' ? 'Claude built your estimate. Edit anything you like.' : 'Estimate ready (built-in estimator).');
  };
  const startBlank = () => {
    beginQuote([{ id: nid(), cat: 'material', desc: '', qty: 1, unit: 'ea', cost: 0 }]);
    setView('items');
  };

  /* items */
  const updateItem = (id, patch) => setItems((arr) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const deleteItem = (id) => setItems((arr) => arr.filter((it) => it.id !== id));
  const addItem = (cat) => setItems((arr) => [...arr, { id: nid(), cat, desc: '', qty: 1, unit: cat === 'labor' ? 'hrs' : 'ea', cost: cat === 'labor' ? saved.rate : 0 }]);

  const t = calc(items, markup, tax);
  const mNum = num(markup);
  const brand = BRANDS[saved.accent] || BRANDS.amber;
  const draftBrand = BRANDS[draft.accent] || BRANDS.amber;

  /* proposal */
  const doPrint = () => {
    const old = document.title;
    try {
      document.title = `Proposal QS-${qNo} - ${q.customer || 'Customer'}`;
      window.print();
    } catch (e) {}
    document.title = old;
  };
  const approve = (dataUrl) => {
    setSignature(dataUrl);
    setApprovedOn(fmtDate(new Date()));
    setStatus('Approved');
    flash('Approved and date stamped.');
  };
  const resign = () => { setSignature(''); setApprovedOn(''); setStatus('Sent'); };

  const qd = qDate || new Date(0);
  const validThru = new Date(qd.getTime() + 30 * 86400000);
  const groups = [
    { key: 'material', label: 'Materials' },
    { key: 'labor', label: 'Labor' },
    { key: 'fee', label: 'Disposal, Permits and Fees' },
  ];

  /* ---------- views ---------- */
  const SettingsView = html`
    <div className="mx-auto max-w-3xl space-y-4">
      <${Card} title="Company Settings" subtitle="Saved here, applied automatically to every new quote and proposal.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><${Field} label="Company Name">
            <input className=${inputCls} value=${draft.name} onInput=${(e) => draftSet('name', e.target.value)} placeholder="Your company name" />
          <//></div>
          <${Field} label="Phone">
            <input className=${inputCls} value=${draft.phone} onInput=${(e) => draftSet('phone', e.target.value)} placeholder="(555) 555-5555" />
          <//>
          <${Field} label="Email">
            <input type="email" className=${inputCls} value=${draft.email} onInput=${(e) => draftSet('email', e.target.value)} placeholder="you@company.com" />
          <//>
          <${Field} label="Default Hourly Labor Rate" hint="Used for every labor line in a new estimate.">
            <${Affix} pre="$" post="/hr"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pl-8 pr-12'} value=${draft.rate} onInput=${(e) => draftSet('rate', e.target.value)} /><//>
          <//>
          <${Field} label="Material Markup %" hint="Added on top of material cost.">
            <${Affix} post="%"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pr-9'} value=${draft.markup} onInput=${(e) => draftSet('markup', e.target.value)} /><//>
          <//>
          <${Field} label="Texas Sales Tax Rate" hint="Applied to materials plus markup only. Labor and fees are not taxed.">
            <${Affix} post="%"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pr-9'} value=${draft.tax} onInput=${(e) => draftSet('tax', e.target.value)} /><//>
          <//>
        </div>
      <//>

      <${Card} title="Company Logo" subtitle="Prints at the top of every proposal. Stays on this device.">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400"
            onDragOver=${(e) => e.preventDefault()}
            onDrop=${(e) => { e.preventDefault(); onLogoFile(e.dataTransfer.files && e.dataTransfer.files[0]); }}>
            ${draft.logo
              ? html`<img src=${draft.logo} alt="Logo preview" className="max-h-20 max-w-[140px] object-contain" />`
              : html`<span className="flex flex-col items-center text-xs font-bold text-slate-500"><${Icon} name="image" size=${24} />No logo yet</span>`}
          </div>
          <div className="space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-600 bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-amber-400 active:scale-[0.98]">
              <${Icon} name="upload" size=${18} />${draft.logo ? 'Replace Logo' : 'Upload Logo'}
              <input type="file" accept="image/*" className="sr-only" onChange=${(e) => { onLogoFile(e.target.files && e.target.files[0]); e.target.value = ''; }} />
            </label>
            ${draft.logo && html`<div><${Btn} kind="danger" icon="trash" onClick=${() => draftSet('logo', '')}>Remove<//></div>`}
            <p className="text-xs text-slate-600">PNG, JPG or SVG. Drag a file onto the box or tap Upload.</p>
          </div>
        </div>
        ${logoErr && html`<p role="alert" className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">${logoErr}</p>`}
      <//>

      <${Card} title="Default Payment Terms" subtitle="Used on every new proposal. You can still edit them per quote on the Proposal tab.">
        <${TermsEditor} value=${draft.terms} onChange=${(v) => draftSet('terms', v)} rows=${6} />
      <//>

      <${Card} title="Brand Accent Color" subtitle="Colors the proposal header, borders, table and total banner. Pick one that matches your logo.">
        <div role="radiogroup" aria-label="Brand accent color" className="flex flex-wrap gap-2">
          ${Object.entries(BRANDS).map(([k, b]) => html`
            <button key=${k} type="button" role="radio" aria-checked=${draft.accent === k} onClick=${() => draftSet('accent', k)}
              className=${`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-bold transition duration-150 active:scale-[0.98] ${draft.accent === k ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full shadow ring-2 ring-white" style=${{ background: b.main, color: b.on }}>
                ${draft.accent === k && html`<${Icon} name="check" size=${16} />`}
              </span>${b.name}
            </button>`)}
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div style=${{ background: draftBrand.main, height: 10 }}></div>
          <div className="flex items-center justify-between gap-3 p-3" style=${{ borderBottom: `3px solid ${draftBrand.main}` }}>
            <div className="flex items-center gap-2">
              ${draft.logo && html`<img src=${draft.logo} alt="" className="max-h-8 max-w-[70px] object-contain" />`}
              <span className="text-sm font-extrabold">${draft.name || 'Your Company'}</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest" style=${{ background: draftBrand.main, color: draftBrand.on }}>Proposal</span>
          </div>
          <div className="space-y-1 p-3 text-xs">
            <div className="flex justify-between px-2 py-1 font-bold uppercase tracking-wide" style=${{ background: draftBrand.main, color: draftBrand.on }}><span>Description</span><span>Amount</span></div>
            <div className="flex justify-between px-2 py-1" style=${{ background: draftBrand.soft }}><span className="font-bold">Materials</span><span className="tabular-nums">$1,240.00</span></div>
            <div className="flex items-center justify-between px-2 py-1.5 font-extrabold" style=${{ background: draftBrand.main, color: draftBrand.on }}><span>TOTAL</span><span className="tabular-nums">$4,860.00</span></div>
          </div>
        </div>
      <//>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <${Btn} icon="check" onClick=${saveSettings} disabled=${!dirty}>Save Settings<//>
        <${Btn} kind="light" icon="rotate" onClick=${resetSettings}>Reset to Defaults<//>
        ${dirty && html`<span className="text-sm font-bold text-amber-700">Unsaved changes</span>`}
        ${!dirty && html`<span className="text-sm font-bold text-green-700">All saved</span>`}
      </div>
    </div>`;

  const QuoteView = html`
    <div className="mx-auto max-w-3xl space-y-4">
      <${Card} title="New Quote" subtitle="Describe the job and QuoteSnap builds the estimate."
        right=${(q.notes || q.customer || currentId) && html`<${Btn} kind="light" icon="rotate" onClick=${newQuote}>Clear Form<//>`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <${Field} label="Customer Name">
            <input className=${inputCls} value=${q.customer} onInput=${(e) => setQ({ ...q, customer: e.target.value })} placeholder="e.g. Maria Gonzalez" />
          <//>
          <${Field} label="Job Type">
            <select className=${inputCls} value=${q.jobType} onChange=${(e) => setQ({ ...q, jobType: e.target.value })}>
              <option>Fencing</option><option>Roofing</option><option>Landscaping</option><option>General Remodeling</option>
            </select>
          <//>
          <div className="sm:col-span-2"><${Field} label="Customer Address">
            <input className=${inputCls} value=${q.address} onInput=${(e) => setQ({ ...q, address: e.target.value })} placeholder="Street, City, TX ZIP" />
          <//></div>
          <div className="sm:col-span-2">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-800">Job Description and Notes</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600">${q.notes.length} characters</span>
                ${speechOk && html`
                  <button type="button" onClick=${toggleMic} aria-pressed=${listening}
                    aria-label=${listening ? 'Stop voice input' : 'Start voice input'}
                    className=${`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-bold shadow-sm transition active:scale-[0.97] ${listening ? 'border-red-700 bg-red-600 text-white' : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-700'}`}>
                    <${Icon} name=${listening ? 'stop' : 'mic'} size=${16} />
                    ${listening ? 'Listening... tap to stop' : 'Speak'}
                    ${listening && html`<span className="qs-pulse h-2 w-2 rounded-full bg-white"></span>`}
                  </button>`}
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="self-center text-xs font-bold uppercase tracking-wide text-slate-600">Load Sample Job:</span>
              ${PRESETS.map((p) => html`<button key=${p.label} type="button" onClick=${() => loadPreset(p)}
                className="rounded-full border border-amber-500 bg-amber-100 px-3 py-1.5 text-sm font-bold text-slate-900 transition hover:bg-amber-200 active:scale-[0.97]">${p.label}</button>`)}
            </div>
            ${!speechOk && html`<p className="mb-2 text-xs text-slate-600">Voice input needs Chrome, Edge or Safari.</p>`}
            <textarea rows="6" className=${inputCls} value=${q.notes} onInput=${(e) => { setQ({ ...q, notes: e.target.value }); setErr(''); }}
              placeholder="Include sizes, quantities, gates, tear-out, access notes..."></textarea>
            <p className="mt-1 text-xs text-slate-600">Tip: put sizes like "200 ft" or "2,400 sq ft" in the notes and the estimate scales to match.</p>
          </div>
        </div>
        ${err && html`<p role="alert" className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">${err}</p>`}
        <div className="mt-5">
          <button type="button" onClick=${generate} disabled=${loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-600 bg-amber-500 px-5 py-4 text-lg font-extrabold text-slate-900 shadow-md transition duration-150 hover:bg-amber-400 hover:shadow-lg active:scale-[0.99] disabled:opacity-80 sm:w-auto">
            ${loading ? html`<${Icon} name="loader" size=${22} className="qs-spin" />` : html`<${Icon} name="sparkles" size=${22} />`}
            ${loading ? 'Generating...' : 'Generate Smart Estimate'}
          </button>
          ${loading && html`<p aria-live="polite" className="mt-3 text-sm font-bold text-slate-700">${STEPS[step]}</p>`}
        </div>
      <//>
    </div>`;

  const ItemsView = items.length === 0 && !generated ? html`
    <div className="mx-auto max-w-3xl">
      <${Empty} title="No estimate yet" text="Generate a smart estimate from a job description, or start with a blank quote and add rows yourself.">
        <${Btn} icon="filePlus" onClick=${() => setView('quote')}>Go to New Quote<//>
        <${Btn} kind="light" icon="plus" onClick=${startBlank}>Start Blank Quote<//>
      <//>
    </div>` : html`
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <${Card} title="Line-Item Breakdown" subtitle=${`${q.jobType} for ${q.customer || 'customer'} · Quote QS-${qNo}`}
          right=${html`<div className="flex items-center gap-2"><${Badge} tone=${STATUS_TONE[status]}>${status}<//><span className="hidden sm:inline-flex"><${Btn} kind="dark" icon="fileText" onClick=${() => setView('proposal')}>Preview Proposal<//></span></div>`}>
          ${notice && html`<p role="status" className="mb-3 rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-sm font-bold text-slate-900">${notice}</p>`}
          <div className="mb-3 flex flex-wrap gap-2">
            <${Btn} kind="light" icon="plus" onClick=${() => addItem('material')}>Material<//>
            <${Btn} kind="light" icon="plus" onClick=${() => addItem('labor')}>Labor<//>
            <${Btn} kind="light" icon="plus" onClick=${() => addItem('fee')}>Fee<//>
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
            <div className=${`${ROWGRID} bg-slate-900 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-white`}>
              <span>Type</span><span>Description</span><span>Qty</span><span>Unit</span><span>Unit cost</span><span className="text-right">Line total</span><span></span>
            </div>
            ${items.map((it) => html`<${ItemRow} key=${it.id} it=${it} onChange=${(p) => updateItem(it.id, p)} onDelete=${() => deleteItem(it.id)} />`)}
            ${items.length === 0 && html`<div className="border-t border-slate-200 p-6 text-center text-slate-600">No rows. Use the buttons above to add one.</div>`}
          </div>

          <div className="space-y-3 md:hidden">
            ${items.map((it) => html`<${ItemCard} key=${it.id} it=${it} onChange=${(p) => updateItem(it.id, p)} onDelete=${() => deleteItem(it.id)} />`)}
            ${items.length === 0 && html`<div className="rounded-xl border border-slate-200 p-6 text-center text-slate-600">No rows. Use the buttons above to add one.</div>`}
          </div>
        <//>

        <div className="lg:sticky lg:top-4">
          <${Card} title="Totals">
            <div className="mb-4 grid grid-cols-2 gap-3">
              <${Field} label="Markup %"><${Affix} post="%"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pr-9'} value=${markup} onInput=${(e) => setMarkup(e.target.value)} /><//><//>
              <${Field} label="Sales tax %"><${Affix} post="%"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pr-9'} value=${tax} onInput=${(e) => setTax(e.target.value)} /><//><//>
            </div>
            <dl className="space-y-2 text-base">
              <div className="flex justify-between"><dt className="text-slate-700">Materials</dt><dd className="font-bold tabular-nums">${money(t.mat)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-700">Labor</dt><dd className="font-bold tabular-nums">${money(t.lab)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-700">Disposal, permits, fees</dt><dd className="font-bold tabular-nums">${money(t.fee)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-2"><dt className="font-bold">Subtotal</dt><dd className="font-extrabold tabular-nums">${money(t.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-700">Material markup (${mNum}%)</dt><dd className="font-bold tabular-nums">${money(t.markup)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-700">Sales tax (${num(tax)}% on ${money(t.taxable)})</dt><dd className="font-bold tabular-nums">${money(t.tax)}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-slate-500">Texas sales tax is charged on materials plus markup. Labor and fees are not taxed.</p>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white shadow-md">
              <span className="text-sm font-bold uppercase tracking-wide text-slate-300">Grand Total</span>
              <span className="text-3xl font-extrabold tabular-nums text-amber-400">${money(t.total)}</span>
            </div>
            <div className="mt-4"><${Btn} kind="dark" icon="fileText" className="w-full" onClick=${() => setView('proposal')}>Preview Proposal<//></div>
          <//>
        </div>
      </div>
    </div>`;

  const ProposalView = items.length === 0 ? html`
    <div className="mx-auto max-w-3xl">
      <${Empty} title="Nothing to preview yet" text="Generate an estimate first, or open one from Saved Quotes, and the client-ready proposal will appear here.">
        <${Btn} icon="filePlus" onClick=${() => setView('quote')}>Go to New Quote<//>
        <${Btn} kind="light" icon="folder" onClick=${() => setView('history')}>Saved Quotes<//>
      <//>
    </div>` : html`
    <div className="mx-auto max-w-[850px]">
      <div className="no-print mb-3 flex flex-wrap items-center gap-2">
        <${Btn} kind="light" icon="arrowLeft" onClick=${() => setView('items')}>Edit Line Items<//>
        <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</span>
          <${PillSelect} label="Quote status" value=${status} tone=${STATUS_TONE[status]} options=${STATUS_OPTS} onChange=${setStatus} />
        </div>
        <div className="flex-1"></div>
        <${Btn} icon="printer" onClick=${doPrint}>Print / Save as PDF<//>
      </div>
      <p className="no-print mb-3 text-xs text-slate-600">Have the customer sign in the Customer Approval box, tap Approve, then print or save as PDF. On a phone, choose Save as PDF or Share.</p>

      <div className="no-print mb-4">
        <${Card} title="Payment Terms for this proposal" subtitle="Edit before printing. Changes are saved with this quote only.">
          <${TermsEditor} value=${terms} onChange=${setTerms} rows=${5} />
          <div className="mt-3"><${Btn} kind="light" icon="rotate" onClick=${() => setTerms(saved.terms)} disabled=${terms === saved.terms}>Reset to company default<//></div>
        <//>
      </div>

      <article id="proposal" className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-900/10 print:rounded-none print:shadow-none print:ring-0" style=${{ color: '#0f172a' }}>
        <div style=${{ background: brand.main, height: 14 }}></div>
        <div className="p-6 sm:p-10">
          <header className="flex flex-wrap items-start justify-between gap-4 pb-5" style=${{ borderBottom: `4px solid ${brand.main}` }}>
            <div className="flex items-center gap-4">
              ${saved.logo && html`<img src=${saved.logo} alt="Company logo" className="max-h-20 max-w-[180px] object-contain" />`}
              <div>
                <h1 className="text-2xl font-extrabold">${saved.name || 'Your Company'}</h1>
                <p className="mt-1 text-sm text-slate-700">${saved.phone}${saved.phone && saved.email ? '  |  ' : ''}${saved.email}</p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="inline-block px-3 py-1 text-sm font-extrabold uppercase tracking-widest" style=${{ background: brand.main, color: brand.on }}>Proposal</div>
              <p className="mt-2 text-sm"><span className="font-bold">No.</span> QS-${qNo}</p>
              <p className="text-sm"><span className="font-bold">Date:</span> ${fmtDate(qd)}</p>
              <p className="text-sm"><span className="font-bold">Valid through:</span> ${fmtDate(validThru)}</p>
            </div>
          </header>

          <section className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest" style=${{ color: brand.text }}>Prepared for</h2>
              <p className="mt-1 text-lg font-bold">${q.customer || 'Valued Customer'}</p>
              <p className="text-sm text-slate-700">${q.address || 'Address on file'}</p>
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest" style=${{ color: brand.text }}>Project</h2>
              <p className="mt-1 text-lg font-bold">${q.jobType}</p>
            </div>
          </section>

          ${q.notes.trim() && html`
            <section className="mt-5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest" style=${{ color: brand.text }}>Scope of Work</h2>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-800">${q.notes}</p>
            </section>`}

          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide" style=${{ background: brand.main, color: brand.on }}>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 text-right">Qty</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2 text-right">Unit Price</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            ${groups.map((g) => {
              const rows = items.filter((it) => it.cat === g.key);
              if (!rows.length) return null;
              return html`
                <tbody key=${g.key}>
                  <tr><td colSpan="5" className="px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider" style=${{ background: brand.soft }}>${g.label}</td></tr>
                  ${rows.map((it) => {
                    const lt = r2(num(it.qty) * num(it.cost));
                    const amt = g.key === 'material' ? r2(lt + r2(lt * mNum / 100)) : lt;
                    const unitP = g.key === 'material' ? r2(num(it.cost) * (1 + mNum / 100)) : num(it.cost);
                    return html`
                      <tr key=${it.id} style=${{ borderBottom: '1px solid #cbd5e1' }}>
                        <td className="px-3 py-2">${it.desc || '(no description)'}</td>
                        <td className="px-3 py-2 text-right tabular-nums">${num(it.qty)}</td>
                        <td className="px-3 py-2">${it.unit}</td>
                        <td className="px-3 py-2 text-right tabular-nums">${money(unitP)}</td>
                        <td className="px-3 py-2 text-right font-bold tabular-nums">${money(amt)}</td>
                      </tr>`;
                  })}
                </tbody>`;
            })}
          </table>

          <div className="ml-auto mt-4 w-full max-w-xs space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold tabular-nums">${money(t.subtotal + t.markup)}</span></div>
            <div className="flex justify-between"><span>Sales tax (${num(tax)}%)</span><span className="font-bold tabular-nums">${money(t.tax)}</span></div>
            <div className="flex items-center justify-between px-3 py-2" style=${{ background: brand.main, color: brand.on }}>
              <span className="font-extrabold uppercase tracking-wide">Total</span>
              <span className="text-xl font-extrabold tabular-nums">${money(t.total)}</span>
            </div>

          </div>

          <section className="mt-8 pt-4" style=${{ borderTop: `2px solid ${brand.main}` }}>
            <h2 className="text-xs font-extrabold uppercase tracking-widest" style=${{ color: brand.text }}>Payment Terms</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-800">${terms.trim() || 'Payment terms to be agreed.'}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xs font-extrabold uppercase tracking-widest" style=${{ color: brand.text }}>Customer Approval</h2>
            <p className="mt-1 text-sm text-slate-800">By signing below, you accept this proposal and authorize ${saved.name || 'the contractor'} to begin work.</p>
            <div className="mt-5 grid gap-8 sm:grid-cols-2">
              <div>
                ${signature
                  ? html`
                    <div className="flex h-20 items-end"><img src=${signature} alt="Customer signature" className="max-h-20 max-w-full object-contain" /></div>
                    <div className="border-b-2 border-slate-900"></div>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide">Customer signature</p>
                    <p className="text-xs text-slate-600">${q.customer || ''}</p>
                    <div className="mt-4 flex h-8 items-end border-b-2 border-slate-900 text-sm font-bold">${approvedOn}</div>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide">Date approved</p>
                    <div className="no-print mt-3"><${Btn} kind="light" icon="eraser" onClick=${resign}>Re-sign<//></div>`
                  : html`
                    <div className="no-print">
                      <p className="mb-2 text-sm font-bold">Draw your signature</p>
                      <${SignaturePad} onApprove=${approve} />
                    </div>
                    <div className="hidden print:block">
                      <div className="h-14 border-b-2 border-slate-900"></div>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide">Customer signature</p>
                      <p className="text-xs text-slate-600">${q.customer || ''}</p>
                      <div className="mt-4 h-8 border-b-2 border-slate-900"></div>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide">Date</p>
                    </div>`}
              </div>
              <div>
                <div className="h-20 border-b-2 border-slate-900"></div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">Contractor signature</p>
                <p className="text-xs text-slate-600">${saved.name}</p>
                <div className="mt-4 h-8 border-b-2 border-slate-900"></div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">Date</p>
              </div>
            </div>
          </section>
          <p className="mt-8 text-center text-xs text-slate-500">Thank you for your business.</p>
        </div>
      </article>
    </div>`;

  /* saved quotes */
  const counts = { All: quotes.length };
  STATUSES.forEach((s) => { counts[s] = quotes.filter((x) => x.status === s).length; });
  const shown = filter === 'All' ? quotes : quotes.filter((x) => x.status === filter);
  const approvedValue = r2(quotes.filter((x) => x.status === 'Approved').reduce((a, x) => a + num(x.total), 0));
  const pipelineValue = r2(quotes.filter((x) => x.status !== 'Approved').reduce((a, x) => a + num(x.total), 0));

  const HistoryView = quotes.length === 0 ? html`
    <div className="mx-auto max-w-3xl">
      <${Empty} icon="folder" title="No saved quotes yet" text="Every quote you generate is saved here automatically so you can reopen it any time.">
        <${Btn} icon="filePlus" onClick=${() => setView('quote')}>Create a Quote<//>
      <//>
    </div>` : html`
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">Saved quotes</div><div className="mt-1 text-2xl font-extrabold tabular-nums">${quotes.length}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">Open pipeline</div><div className="mt-1 text-2xl font-extrabold tabular-nums">${money(pipelineValue)}</div></div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm"><div className="text-xs font-bold uppercase tracking-wide text-green-800">Approved</div><div className="mt-1 text-2xl font-extrabold tabular-nums text-green-800">${money(approvedValue)}</div></div>
      </div>

      <div className="flex flex-wrap gap-2">
        ${['All', ...STATUSES].map((f) => html`
          <button key=${f} type="button" onClick=${() => setFilter(f)}
            className=${`rounded-full border px-3.5 py-1.5 text-sm font-bold transition active:scale-[0.97] ${filter === f ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'}`}>
            ${f} <span className="opacity-70">${counts[f]}</span>
          </button>`)}
      </div>

      <div className="space-y-3">
        ${shown.map((x) => html`
          <article key=${x.id} className=${`rounded-2xl border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${x.id === currentId ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-extrabold">${x.customer || 'Unnamed customer'}</h3>
                  ${x.id === currentId && html`<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold uppercase text-amber-900">Open now</span>`}
                </div>
                <p className="text-sm text-slate-600">${x.jobType} · QS-${x.qNo} · ${fmtShort(x.createdAt)}</p>
                ${x.address && html`<p className="truncate text-sm text-slate-500">${x.address}</p>`}
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold tabular-nums">${money(x.total)}</div>
                <div className="mt-1"><${PillSelect} label="Quote status" value=${x.status} tone=${STATUS_TONE[x.status]} options=${STATUS_OPTS} onChange=${(v) => changeStatus(x.id, v)} /></div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <${Btn} kind="dark" icon="list" onClick=${() => openQuote(x, 'items')}>Open<//>
              <${Btn} kind="light" icon="fileText" onClick=${() => openQuote(x, 'proposal')}>Proposal<//>
              <div className="flex-1"></div>
              ${confirmId === x.id
                ? html`<${Btn} kind="dangerSolid" icon="trash" onClick=${() => deleteQuote(x.id)}>Confirm delete<//><${Btn} kind="light" onClick=${() => setConfirmId(null)}>Cancel<//>`
                : html`<${Btn} kind="danger" icon="trash" onClick=${() => setConfirmId(x.id)}>Delete<//>`}
            </div>
          </article>`)}
        ${shown.length === 0 && html`<p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">No ${filter.toLowerCase()} quotes.</p>`}
      </div>
    </div>`;

  const views = { settings: SettingsView, quote: QuoteView, items: ItemsView, proposal: ProposalView, history: HistoryView };
  const showBar = view === 'items' && items.length > 0;

  return html`
    <div className="min-h-screen">
      <style dangerouslySetInnerHTML=${{ __html: EXTRA_CSS }} />
      <header className="no-print z-30 bg-slate-900 text-white shadow-lg md:sticky md:top-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-900 shadow"><${Icon} name="hammer" size=${24} /></div>
            <div>
              <div className="text-xl font-extrabold leading-tight tracking-tight">Quote<span className="text-amber-400">Snap</span></div>
              <div className="text-xs text-slate-300">Smart estimates for local trades</div>
            </div>
          </div>
          <div className="hidden text-right text-sm sm:block">
            <div className="font-bold">${saved.name}</div>
            <div className="text-slate-300">${money(saved.rate)}/hr · ${saved.markup}% markup · ${saved.tax}% tax</div>
          </div>
        </div>
        <nav className="border-t border-slate-700 bg-slate-800" aria-label="Main">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-1.5">
            ${TABS.map((tb) => html`
              <button key=${tb.id} type="button" onClick=${() => setView(tb.id)} aria-current=${view === tb.id ? 'page' : undefined}
                className=${`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold transition duration-150 ${view === tb.id ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-200 hover:bg-white/10'}`}>
                <${Icon} name=${tb.icon} size=${18} />${tb.label}
                ${tb.id === 'history' && quotes.length > 0 && html`<span className=${`rounded-full px-1.5 text-xs font-extrabold ${view === tb.id ? 'bg-slate-900 text-amber-400' : 'bg-amber-500 text-slate-900'}`}>${quotes.length}</span>`}
              </button>`)}
          </div>
        </nav>
      </header>

      <main className=${`px-3 py-5 sm:px-4 sm:py-6 ${showBar ? 'pb-28 md:pb-8' : ''}`}>
        <div key=${view} className="qs-fade">${views[view]}</div>
      </main>

      ${showBar && html`
        <div className="no-print fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-700 bg-slate-900 px-4 py-3 text-white shadow-2xl md:hidden"
          style=${{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Grand Total</div>
            <div className="text-2xl font-extrabold tabular-nums text-amber-400">${money(t.total)}</div>
          </div>
          <button type="button" onClick=${() => setView('proposal')}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-600 bg-amber-500 px-4 py-2.5 text-sm font-extrabold text-slate-900 shadow transition active:scale-[0.98]">
            <${Icon} name="fileText" size=${18} />Proposal
          </button>
        </div>`}

      ${toast && html`<div role="status" className=${`no-print fixed left-1/2 z-50 -translate-x-1/2 rounded-xl border border-amber-500 bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg ${showBar ? 'bottom-24 md:bottom-4' : 'bottom-4'}`}>${toast}</div>`}
    </div>`;
}