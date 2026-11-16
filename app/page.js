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
};
const Icon = ({ name, size = 18, className = '' }) => html`<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=${className} aria-hidden="true" dangerouslySetInnerHTML=${{ __html: ICONS[name] }}></svg>`;

/* ---------- smart estimate engine (simulated AI) ---------- */
const maxNum = (t, re, dflt) => {
  let best = 0;
  for (const m of t.matchAll(new RegExp(re.source, 'gi'))) best = Math.max(best, parseFloat(m[1].replace(/,/g, '')));
  return best || dflt;
};
const LEN_RE = /(\d[\d,]*)\s*-?\s*(?:linear\s*)?(?:ft|feet|foot|lf)\b(?!\s*(?:cedar|privacy|wood|picket|fence|vinyl|chain|tall))/;
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

/* ---------- small UI pieces ---------- */
const inputCls = 'w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300';

const Field = ({ label, hint, children }) => html`
  <label className="block">
    <span className="block text-sm font-bold text-slate-800 mb-1">${label}</span>
    ${children}
    ${hint && html`<span className="block text-xs text-slate-600 mt-1">${hint}</span>`}
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
    light: 'bg-white text-slate-900 hover:bg-slate-100 border-slate-400',
    danger: 'bg-white text-red-700 hover:bg-red-50 border-red-300',
  };
  return html`<button type="button" onClick=${onClick} disabled=${disabled}
    className=${`inline-flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${kinds[kind]} ${className}`}>
    ${icon && html`<${Icon} name=${icon} size=${18} />`}${children}
  </button>`;
};

const Card = ({ title, subtitle, right, children }) => html`
  <section className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
    ${(title || right) && html`
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-200 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">${title}</h2>
          ${subtitle && html`<p className="text-sm text-slate-600">${subtitle}</p>`}
        </div>
        ${right}
      </div>`}
    <div className="p-4 sm:p-5">${children}</div>
  </section>`;

const Empty = ({ title, text, children }) => html`
  <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700"><${Icon} name="fileText" size=${24} /></div>
    <h2 className="text-lg font-extrabold">${title}</h2>
    <p className="mx-auto mt-1 max-w-md text-slate-600">${text}</p>
    <div className="mt-4 flex flex-wrap justify-center gap-2">${children}</div>
  </div>`;

/* ---------- line item row ---------- */
const catCls = { material: 'bg-slate-100', labor: 'bg-amber-100', fee: 'bg-white' };
const Row = ({ it, onChange, onDelete }) => {
  const lt = r2(num(it.qty) * num(it.cost));
  const cell = 'w-full rounded-md border-2 border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300';
  return html`
    <tr className="border-t-2 border-slate-200 align-top">
      <td className="p-2 w-32">
        <select aria-label="Item type" value=${it.cat} onChange=${(e) => onChange({ cat: e.target.value })}
          className=${`${cell} font-bold ${catCls[it.cat]}`}>
          <option value="material">Material</option>
          <option value="labor">Labor</option>
          <option value="fee">Fee / Permit</option>
        </select>
      </td>
      <td className="p-2 min-w-[240px]">
        <input aria-label="Description" className=${cell} value=${it.desc} placeholder="Description" onInput=${(e) => onChange({ desc: e.target.value })} />
      </td>
      <td className="p-2 w-24">
        <input aria-label="Quantity" type="number" inputMode="decimal" min="0" step="any" className=${cell} value=${it.qty} onInput=${(e) => onChange({ qty: e.target.value })} />
      </td>
      <td className="p-2 w-20">
        <input aria-label="Unit" className=${cell} value=${it.unit} onInput=${(e) => onChange({ unit: e.target.value })} />
      </td>
      <td className="p-2 w-32">
        <input aria-label="Unit cost" type="number" inputMode="decimal" min="0" step="any" className=${cell} value=${it.cost} onInput=${(e) => onChange({ cost: e.target.value })} />
      </td>
      <td className="p-2 w-32 pt-4 text-right font-extrabold tabular-nums">${money(lt)}</td>
      <td className="p-2 w-12">
        <button type="button" aria-label="Delete row" onClick=${onDelete} className="rounded-md p-2 text-red-700 hover:bg-red-50"><${Icon} name="trash" size=${18} /></button>
      </td>
    </tr>`;
};

/* ---------- presets ---------- */
const PRESETS = [
  { label: '200-ft Cedar Fence', jobType: 'Fencing', customer: 'Maria Gonzalez', address: '4821 Seawall Blvd, Galveston, TX 77550',
    notes: '200-ft 6ft Cedar Privacy Fence with 2 gates and old fence tear-down. Remove and haul off the existing fence along the back and sides, set new posts in concrete, install cap rail and trim. One 4ft walk gate and one 10ft drive gate.' },
  { label: '2,400 sq ft Roof', jobType: 'Roofing', customer: 'James and Linda Carter', address: '1208 Ball Ave, Galveston, TX 77550',
    notes: '2,400 sq ft Architectural Shingle Roof Replacement. Tear off one layer of old shingles, replace with synthetic underlayment, ice and water shield in valleys, new drip edge, ridge vent and pipe flashings.' },
  { label: 'Paver Patio + Sod', jobType: 'Landscaping', customer: 'Danielle Brooks', address: '77 Palm Court, League City, TX 77573',
    notes: 'Backyard Paver Patio 400 sq ft with Sod. Excavate and grade, compacted gravel base, concrete pavers with edge restraint, then lay 600 sq ft of new sod around the patio.' },
];

const DEFAULTS = { name: 'Lone Star Fence & Roof Co.', phone: '(409) 555-0142', email: 'quotes@lonestarfence.com', rate: 85, markup: 20, tax: 8.25, logo: '' };
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
const TABS = [
  { id: 'settings', label: 'Company Settings', icon: 'sliders' },
  { id: 'quote', label: 'New Quote', icon: 'filePlus' },
  { id: 'items', label: 'Line Items', icon: 'list' },
  { id: 'proposal', label: 'Proposal', icon: 'fileText' },
];

/* ---------- app ---------- */
export default function App() {
  const [view, setView] = useState('quote');
  const [saved, setSaved] = useState(DEFAULTS);
  const [draft, setDraft] = useState({ ...DEFAULTS, rate: String(DEFAULTS.rate), markup: String(DEFAULTS.markup), tax: String(DEFAULTS.tax) });
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
  const recRef = useRef(null);
  const baseRef = useRef('');
  const toastT = useRef(null);

  /* Load saved settings once on the client (localStorage is not available on the server). */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = { ...DEFAULTS, ...JSON.parse(raw) };
        setSaved(s);
        setDraft({ ...s, rate: String(s.rate), markup: String(s.markup), tax: String(s.tax) });
        setMarkup(s.markup); setTax(s.tax);
      }
    } catch (e) {}
    setQDate(new Date());
    setSpeechOk(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => { try { recRef.current && recRef.current.abort(); } catch (e) {} };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const flash = (m) => {
    setToast(m);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(''), 2600);
  };

  /* settings */
  const draftSet = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const draftNums = { rate: num(draft.rate), markup: num(draft.markup), tax: num(draft.tax) };
  const dirty = draft.name !== saved.name || draft.phone !== saved.phone || draft.email !== saved.email || draft.logo !== saved.logo ||
    draftNums.rate !== saved.rate || draftNums.markup !== saved.markup || draftNums.tax !== saved.tax;
  const saveSettings = () => {
    const s = { name: draft.name, phone: draft.phone, email: draft.email, logo: draft.logo, ...draftNums };
    setSaved(s);
    if (!generated) { setMarkup(s.markup); setTax(s.tax); }
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
    flash('Settings saved. New quotes will use them.');
  };
  const resetSettings = () => {
    setDraft((d) => ({ ...DEFAULTS, logo: d.logo, rate: String(DEFAULTS.rate), markup: String(DEFAULTS.markup), tax: String(DEFAULTS.tax) }));
  };
  const onLogoFile = async (file) => {
    if (!file) return;
    setLogoErr('');
    if (!file.type.startsWith('image/')) { setLogoErr('Please choose an image file (PNG, JPG, SVG).'); return; }
    if (file.size > 8 * 1024 * 1024) { setLogoErr('That image is over 8 MB. Try a smaller one.'); return; }
    try { draftSet('logo', await fileToLogo(file)); } catch (e) { setLogoErr(e.message); }
  };

  /* quote */
  const loadPreset = (p) => {
    setQ((cur) => ({ customer: cur.customer.trim() ? cur.customer : p.customer, address: cur.address.trim() ? cur.address : p.address, jobType: p.jobType, notes: p.notes }));
    setErr('');
  };
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
    setItems(rows);
    setMarkup(saved.markup); setTax(saved.tax);
    setQNo((n) => n + 1); setQDate(new Date());
    setGenerated(true); setLoading(false); setView('items');
    flash(source === 'claude' ? 'Claude built your estimate. Edit anything you like.' : 'Estimate ready (built-in estimator).');
  };

  /* items */
  const updateItem = (id, patch) => setItems((arr) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const deleteItem = (id) => setItems((arr) => arr.filter((it) => it.id !== id));
  const addItem = (cat) => setItems((arr) => [...arr, { id: nid(), cat, desc: '', qty: 1, unit: cat === 'labor' ? 'hrs' : 'ea', cost: cat === 'labor' ? saved.rate : 0 }]);

  const t = calc(items, markup, tax);
  const mNum = num(markup);

  /* proposal */
  const doPrint = () => { try { window.print(); } catch (e) {} };
  const fmtDate = (d) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
          <${Field} label="Texas Sales Tax Rate" hint="Applied to materials plus markup. Galveston is 8.25%.">
            <${Affix} post="%"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pr-9'} value=${draft.tax} onInput=${(e) => draftSet('tax', e.target.value)} /><//>
          <//>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <${Btn} icon="check" onClick=${saveSettings} disabled=${!dirty}>Save Settings<//>
          <${Btn} kind="light" icon="rotate" onClick=${resetSettings}>Reset to Defaults<//>
          ${dirty && html`<span className="text-sm font-bold text-amber-700">Unsaved changes</span>`}
          ${!dirty && html`<span className="text-sm font-bold text-green-700">All saved</span>`}
        </div>
      <//>
      <${Card} title="Company Logo" subtitle="Prints at the top of every proposal. Stays on this device.">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50"
            onDragOver=${(e) => e.preventDefault()}
            onDrop=${(e) => { e.preventDefault(); onLogoFile(e.dataTransfer.files && e.dataTransfer.files[0]); }}>
            ${draft.logo
              ? html`<img src=${draft.logo} alt="Logo preview" className="max-h-20 max-w-[140px] object-contain" />`
              : html`<span className="flex flex-col items-center text-xs font-bold text-slate-500"><${Icon} name="image" size=${24} />No logo yet</span>`}
          </div>
          <div className="space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-amber-600 bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-amber-400">
              <${Icon} name="upload" size=${18} />${draft.logo ? 'Replace Logo' : 'Upload Logo'}
              <input type="file" accept="image/*" className="sr-only" onChange=${(e) => { onLogoFile(e.target.files && e.target.files[0]); e.target.value = ''; }} />
            </label>
            ${draft.logo && html`<div><${Btn} kind="danger" icon="trash" onClick=${() => draftSet('logo', '')}>Remove<//></div>`}
            <p className="text-xs text-slate-600">PNG, JPG or SVG. Drag a file onto the box or tap Upload. Hit Save Settings to keep it.</p>
          </div>
        </div>
        ${logoErr && html`<p role="alert" className="mt-3 rounded-lg border-2 border-red-300 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">${logoErr}</p>`}
      <//>
      <${Card} title="Currently in use">
        <dl className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-slate-900 p-3 text-white"><dt className="text-xs uppercase tracking-wide text-slate-300">Labor</dt><dd className="text-xl font-extrabold text-amber-400">${money(saved.rate)}/hr</dd></div>
          <div className="rounded-lg bg-slate-900 p-3 text-white"><dt className="text-xs uppercase tracking-wide text-slate-300">Markup</dt><dd className="text-xl font-extrabold text-amber-400">${saved.markup}%</dd></div>
          <div className="rounded-lg bg-slate-900 p-3 text-white"><dt className="text-xs uppercase tracking-wide text-slate-300">Sales tax</dt><dd className="text-xl font-extrabold text-amber-400">${saved.tax}%</dd></div>
        </dl>
      <//>
    </div>`;

  const QuoteView = html`
    <div className="mx-auto max-w-3xl space-y-4">
      <${Card} title="New Quote" subtitle="Describe the job and QuoteSnap builds the estimate.">
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
                    className=${`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-bold ${listening ? 'border-red-700 bg-red-600 text-white' : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-700'}`}>
                    <${Icon} name=${listening ? 'stop' : 'mic'} size=${16} />
                    ${listening ? 'Listening... tap to stop' : 'Speak'}
                    ${listening && html`<span className="qs-pulse h-2 w-2 rounded-full bg-white"></span>`}
                  </button>`}
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="self-center text-xs font-bold uppercase tracking-wide text-slate-600">Load Sample Job:</span>
              ${PRESETS.map((p) => html`<button key=${p.label} type="button" onClick=${() => loadPreset(p)}
                className="rounded-full border-2 border-amber-500 bg-amber-100 px-3 py-1.5 text-sm font-bold text-slate-900 hover:bg-amber-200">${p.label}</button>`)}
            </div>
            ${!speechOk && html`<p className="mb-2 text-xs text-slate-600">Voice input needs Chrome, Edge or Safari.</p>`}
            <textarea rows="6" className=${inputCls} value=${q.notes} onInput=${(e) => { setQ({ ...q, notes: e.target.value }); setErr(''); }}
              placeholder="Include sizes, quantities, gates, tear-out, access notes..."></textarea>
            <p className="mt-1 text-xs text-slate-600">Tip: put sizes like "200 ft" or "2,400 sq ft" in the notes and the estimate scales to match.</p>
          </div>
        </div>
        ${err && html`<p role="alert" className="mt-3 rounded-lg border-2 border-red-300 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">${err}</p>`}
        <div className="mt-5">
          <button type="button" onClick=${generate} disabled=${loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-600 bg-amber-500 px-5 py-4 text-lg font-extrabold text-slate-900 shadow hover:bg-amber-400 disabled:opacity-80 sm:w-auto">
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
        <${Btn} kind="light" icon="plus" onClick=${() => { addItem('material'); setGenerated(true); }}>Start Blank Quote<//>
      <//>
    </div>` : html`
    <div className="mx-auto max-w-5xl space-y-4">
      <${Card} title="Line-Item Breakdown" subtitle=${`${q.jobType} for ${q.customer || 'customer'} · Quote QS-${qNo}`}
        right=${html`<${Btn} kind="dark" icon="fileText" onClick=${() => setView('proposal')}>Preview Proposal<//>`}>
        ${notice && html`<p role="status" className="mb-3 rounded-lg border-2 border-amber-400 bg-amber-50 px-3 py-2 text-sm font-bold text-slate-900">${notice}</p>`}
        <div className="mb-3 flex flex-wrap gap-2">
          <${Btn} kind="light" icon="plus" onClick=${() => addItem('material')}>Material<//>
          <${Btn} kind="light" icon="plus" onClick=${() => addItem('labor')}>Labor<//>
          <${Btn} kind="light" icon="plus" onClick=${() => addItem('fee')}>Fee / Permit<//>
        </div>
        <div className="overflow-x-auto rounded-lg border-2 border-slate-200">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-slate-900 text-xs uppercase tracking-wide text-white">
              <tr>
                <th className="p-3">Type</th><th className="p-3">Description</th><th className="p-3">Qty</th>
                <th className="p-3">Unit</th><th className="p-3">Unit Cost</th><th className="p-3 text-right">Line Total</th><th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              ${items.map((it) => html`<${Row} key=${it.id} it=${it} onChange=${(p) => updateItem(it.id, p)} onDelete=${() => deleteItem(it.id)} />`)}
              ${items.length === 0 && html`<tr><td colSpan="7" className="p-6 text-center text-slate-600">No rows. Use the buttons above to add one.</td></tr>`}
            </tbody>
          </table>
        </div>
      <//>

      <div className="ml-auto max-w-md">
        <${Card} title="Totals">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <${Field} label="Markup %"><${Affix} post="%"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pr-9'} value=${markup} onInput=${(e) => setMarkup(e.target.value)} /><//><//>
            <${Field} label="Sales tax %"><${Affix} post="%"><input type="number" min="0" step="any" inputMode="decimal" className=${inputCls + ' pr-9'} value=${tax} onInput=${(e) => setTax(e.target.value)} /><//><//>
          </div>
          <dl className="space-y-2 text-base">
            <div className="flex justify-between"><dt className="text-slate-700">Materials</dt><dd className="font-bold tabular-nums">${money(t.mat)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-700">Labor</dt><dd className="font-bold tabular-nums">${money(t.lab)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-700">Disposal, permits and fees</dt><dd className="font-bold tabular-nums">${money(t.fee)}</dd></div>
            <div className="flex justify-between border-t-2 border-slate-200 pt-2"><dt className="font-bold">Subtotal</dt><dd className="font-extrabold tabular-nums">${money(t.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-700">Material markup (${mNum}%)</dt><dd className="font-bold tabular-nums">${money(t.markup)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-700">Sales tax (${num(tax)}% on ${money(t.taxable)})</dt><dd className="font-bold tabular-nums">${money(t.tax)}</dd></div>
          </dl>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
            <span className="text-sm font-bold uppercase tracking-wide text-slate-300">Grand Total</span>
            <span className="text-3xl font-extrabold tabular-nums text-amber-400">${money(t.total)}</span>
          </div>
        <//>
      </div>
    </div>`;

  const ProposalView = items.length === 0 ? html`
    <div className="mx-auto max-w-3xl">
      <${Empty} title="Nothing to preview yet" text="Generate an estimate first and the client-ready proposal will appear here.">
        <${Btn} icon="filePlus" onClick=${() => setView('quote')}>Go to New Quote<//>
      <//>
    </div>` : html`
    <div className="mx-auto max-w-[850px]">
      <div className="no-print mb-3 flex flex-wrap items-center gap-2">
        <${Btn} kind="light" icon="arrowLeft" onClick=${() => setView('items')}>Edit Line Items<//>
        <div className="flex-1"></div>
        <${Btn} icon="printer" onClick=${doPrint}>Print / Save as PDF<//>
      </div>
      <p className="no-print mb-3 text-xs text-slate-600">On a phone, tap Print / Save as PDF, then choose Save as PDF or Share.</p>

      <article id="proposal" className="border-2 border-slate-200 bg-white shadow-md" style=${{ color: '#0f172a' }}>
        <div className="h-3 bg-amber-500"></div>
        <div className="p-6 sm:p-10">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-slate-900 pb-5">
            <div className="flex items-center gap-4">
              ${saved.logo && html`<img src=${saved.logo} alt="Company logo" className="max-h-20 max-w-[180px] object-contain" />`}
              <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">${saved.name || 'Your Company'}</h1>
                <p className="mt-1 text-sm text-slate-700">${saved.phone}${saved.phone && saved.email ? '  |  ' : ''}${saved.email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-slate-900 px-3 py-1 text-sm font-extrabold uppercase tracking-widest text-amber-400">Proposal</div>
              <p className="mt-2 text-sm"><span className="font-bold">No.</span> QS-${qNo}</p>
              <p className="text-sm"><span className="font-bold">Date:</span> ${fmtDate(qd)}</p>
              <p className="text-sm"><span className="font-bold">Valid through:</span> ${fmtDate(validThru)}</p>
            </div>
          </header>

          <section className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Prepared for</h2>
              <p className="mt-1 text-lg font-bold">${q.customer || 'Valued Customer'}</p>
              <p className="text-sm text-slate-700">${q.address || 'Address on file'}</p>
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Project</h2>
              <p className="mt-1 text-lg font-bold">${q.jobType}</p>
            </div>
          </section>

          ${q.notes.trim() && html`
            <section className="mt-5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Scope of Work</h2>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-800">${q.notes}</p>
            </section>`}

          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-left text-xs uppercase tracking-wide text-white">
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
                  <tr><td colSpan="5" className="bg-amber-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-900">${g.label}</td></tr>
                  ${rows.map((it) => {
                    const lt = r2(num(it.qty) * num(it.cost));
                    const amt = g.key === 'material' ? r2(lt + r2(lt * mNum / 100)) : lt;
                    const unitP = g.key === 'material' ? r2(num(it.cost) * (1 + mNum / 100)) : num(it.cost);
                    return html`
                      <tr key=${it.id} className="border-b border-slate-300">
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

          <div className="mt-4 ml-auto w-full max-w-xs space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold tabular-nums">${money(t.subtotal + t.markup)}</span></div>
            <div className="flex justify-between"><span>Sales tax (${num(tax)}%)</span><span className="font-bold tabular-nums">${money(t.tax)}</span></div>
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 text-white">
              <span className="font-extrabold uppercase tracking-wide">Total</span>
              <span className="text-xl font-extrabold tabular-nums text-amber-400">${money(t.total)}</span>
            </div>
            <div className="flex justify-between pt-1 text-slate-700"><span>Deposit due at signing (50%)</span><span className="font-bold tabular-nums">${money(r2(t.total / 2))}</span></div>
          </div>

          <section className="mt-8 border-t-2 border-slate-300 pt-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Payment Terms</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
              <li>50% deposit due at signing to schedule the job. Balance due upon completion.</li>
              <li>We accept check, ACH, and major credit cards. Card payments may carry a 3% fee.</li>
              <li>This proposal is valid for 30 days. Material prices may change after that date.</li>
              <li>Changes to the scope of work will be priced in a written change order before work begins.</li>
              <li>Texas sales tax is applied to materials.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Acceptance</h2>
            <p className="mt-1 text-sm text-slate-800">By signing below, you accept this proposal and authorize ${saved.name || 'the contractor'} to begin work.</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="h-10 border-b-2 border-slate-900"></div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">Customer signature</p>
                <p className="text-xs text-slate-600">${q.customer || ''}</p>
                <div className="mt-6 h-8 border-b-2 border-slate-900"></div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">Date</p>
              </div>
              <div>
                <div className="h-10 border-b-2 border-slate-900"></div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">Contractor signature</p>
                <p className="text-xs text-slate-600">${saved.name}</p>
                <div className="mt-6 h-8 border-b-2 border-slate-900"></div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">Date</p>
              </div>
            </div>
          </section>
          <p className="mt-8 text-center text-xs text-slate-500">Thank you for your business.</p>
        </div>
      </article>
    </div>`;

  const views = { settings: SettingsView, quote: QuoteView, items: ItemsView, proposal: ProposalView };

  return html`
    <div className="min-h-screen">
      <header className="no-print bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900"><${Icon} name="hammer" size=${24} /></div>
            <div>
              <div className="text-xl font-extrabold leading-tight">Quote<span className="text-amber-400">Snap</span></div>
              <div className="text-xs text-slate-300">Smart estimates for local trades</div>
            </div>
          </div>
          <div className="hidden text-right text-sm sm:block">
            <div className="font-bold">${saved.name}</div>
            <div className="text-slate-300">${money(saved.rate)}/hr · ${saved.markup}% markup · ${saved.tax}% tax</div>
          </div>
        </div>
        <nav className="border-t border-slate-700 bg-slate-800" aria-label="Main">
          <div className="mx-auto flex max-w-6xl overflow-x-auto px-2">
            ${TABS.map((tb) => html`
              <button key=${tb.id} type="button" onClick=${() => setView(tb.id)} aria-current=${view === tb.id ? 'page' : undefined}
                className=${`flex shrink-0 items-center gap-2 border-b-4 px-4 py-3 text-sm font-bold transition ${view === tb.id ? 'border-amber-500 bg-slate-900 text-amber-400' : 'border-transparent text-slate-200 hover:bg-slate-700'}`}>
                <${Icon} name=${tb.icon} size=${18} />${tb.label}
              </button>`)}
          </div>
        </nav>
      </header>

      <main className="px-3 py-5 sm:px-4 sm:py-6">${views[view]}</main>

      ${toast && html`<div role="status" className="no-print fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border-2 border-amber-500 bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg">${toast}</div>`}
    </div>`;
}

