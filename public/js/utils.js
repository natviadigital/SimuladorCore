// utils.js — Shared helpers

// ── Formatting ──
const fmt = {
  usd: (v, dec = 0) => v == null || isNaN(v) ? '—'
    : '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }),
  pct: (v, dec = 1) => v == null || isNaN(v) ? '—' : Number(v).toFixed(dec) + '%',
  num: (v, dec = 2) => v == null || isNaN(v) ? '—'
    : Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }),
};

// ── Color palette for chart segments ──
const SEGMENT_COLORS = {
  'A36 Material':         '#4f8ef7',
  'SSTL 304 Material':    '#60a5fa',
  'Tank Material':        '#4f8ef7',
  'Tank Logistics':       '#10b981',
  'Supplier to port':     '#34d399',
  'Overseas freight':     '#10b981',
  'India/China customs':  '#059669',
  'Unloading - other costs': '#6ee7b7',
  'Customs clearance US': '#a7f3d0',
  'US freight cost':      '#d1fae5',
  'Handling at ELP':      '#ecfdf5',
  'Transport ELP - CUU':  '#bbf7d0',
  'Domestic freight cost':'#10b981',
  'Core Material':        '#a855f7',
  'Tariff':               '#ef4444',
};

// Scenario palette (one per scenario)
const SCENARIO_COLORS = [
  '#4f8ef7', '#10b981', '#f59e0b', '#a855f7',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
  '#f97316', '#8b5cf6',
];

// ── Unique values helper ──
const unique = (arr) => [...new Set(arr)];

// ── Chart.js global defaults ──
function applyChartDefaults() {
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.tooltip.backgroundColor = '#1e2a40';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.12)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.titleColor = '#e2e8f0';
  Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
  Chart.defaults.plugins.tooltip.callbacks = {};
}

// ── Get or create chart ──
function getOrCreateChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, config);
}

// ── Compute integrated cost for a configuration ──
function computeIntegratedCost(data, cfg) {
  const { program, source, supplier, steelOrigin, coreMethod, breakdown } = cfg;
  const result = { segments: {}, total: 0, details: [] };

  // ── 1. TANK MATERIAL ──
  const tankBOM = data.tanksBOM[program];
  const a36Row  = data.tanksMaterialCost.find(r =>
    r.supplier === supplier && r.program === program &&
    r.source === source && r.steelOrigin === steelOrigin &&
    r.description === 'A36 Steel'
  );
  const s304Row = data.tanksMaterialCost.find(r =>
    r.supplier === supplier && r.program === program &&
    r.source === source && r.steelOrigin === steelOrigin &&
    r.description === 'SSTL 304'
  );

  const a36Cost  = (a36Row && typeof a36Row.cost === 'number')  ? a36Row.cost  * tankBOM.A36    : 0;
  const s304Cost = (s304Row && typeof s304Row.cost === 'number') ? s304Row.cost * tankBOM.SSTL304 : 0;
  const tankMat  = a36Cost + s304Cost;

  if (breakdown) {
    result.segments['A36 Material']      = a36Cost;
    result.segments['SSTL 304 Material'] = s304Cost;
    if (a36Cost)  result.details.push({ comp: 'Tank', sub: `A36 Steel (${tankBOM.A36} lbs × ${fmt.num(a36Row?.cost, 2)}/lb)`,  amt: a36Cost });
    if (s304Cost) result.details.push({ comp: 'Tank', sub: `SSTL 304 (${tankBOM.SSTL304} lbs × ${fmt.num(s304Row?.cost, 2)}/lb)`, amt: s304Cost });
  } else {
    result.segments['Tank Material'] = tankMat;
    result.details.push({ comp: 'Tank', sub: 'Tank Material (A36 + SSTL 304)', amt: tankMat });
  }

  // ── 2. TANK LOGISTICS ──
  const logItems = data.tankLogistics.filter(r => r.program === program && r.source === source && r.amount != null);
  const logTotal = logItems.reduce((s, r) => s + r.amount, 0);

  if (breakdown) {
    logItems.forEach(r => {
      result.segments[r.concept] = (result.segments[r.concept] || 0) + r.amount;
      result.details.push({ comp: 'Logistics', sub: r.concept, amt: r.amount });
    });
  } else {
    result.segments['Tank Logistics'] = logTotal;
    result.details.push({ comp: 'Logistics', sub: 'Tank Logistics', amt: logTotal });
  }

  // ── 3. CORE MATERIAL ──
  // Always HO-DR grade; JFE for Non-US, Cleveland Cliffs for US
  const coreSupplier = steelOrigin === 'US' ? 'CLEVELAND CLIFFS' : 'JFE';
  const coreRow = data.coreMaterialCost.find(r =>
    r.supplier === coreSupplier && r.grade === 'HO-DR'
  );
  const coreLbs = data.coreBOM[program];
  let coreCost = 0;

  if (coreRow) {
    if (coreMethod === 'inhouse') {
      const rate = (typeof coreRow.priceSlit === 'number' ? coreRow.priceSlit : 0) + coreRow.costCutInHouse;
      coreCost = rate * coreLbs;
      result.details.push({ comp: 'Core', sub: `In-House Make (${fmt.num(rate, 4)}/lb × ${coreLbs.toLocaleString()} lbs)`, amt: coreCost });
    } else if (coreMethod === 'outplant') {
      const rate = (typeof coreRow.priceSlit === 'number' ? coreRow.priceSlit : 0) + coreRow.outplantCost;
      coreCost = rate * coreLbs;
      result.details.push({ comp: 'Core', sub: `Outplant Make (${fmt.num(rate, 4)}/lb × ${coreLbs.toLocaleString()} lbs)`, amt: coreCost });
    } else { // mitter
      const rate = typeof coreRow.totalCostMitter === 'number' ? coreRow.totalCostMitter : 0;
      coreCost = rate * coreLbs;
      result.details.push({ comp: 'Core', sub: `Mitter Cut Core (${fmt.num(rate, 4)}/lb × ${coreLbs.toLocaleString()} lbs)`, amt: coreCost });
    }
  }
  result.segments['Core Material'] = coreCost;

  // ── 4. TARIFF ──
  // Non-US or Overseas → Original tariff; both Domestic+US → Reduced 10%
  const useOriginal = source === 'Overseas' || steelOrigin === 'Non-US';
  const demand = data.annualDemand[program];
  const tariff = useOriginal ? demand.originalTariff : demand.reducedTariff10;
  result.segments['Tariff'] = tariff;
  result.details.push({ comp: 'Tariff', sub: useOriginal ? 'Original Tariff (25%/15%)' : 'Reduced Tariff (10%)', amt: tariff });
  result.tariffType = useOriginal ? 'original' : 'reduced';

  // ── Total ──
  result.total = Object.values(result.segments).reduce((s, v) => s + (v || 0), 0);
  return result;
}

// ── Get list of suppliers for a given source/program/steelOrigin ──
function getSuppliersFor(data, source, program, steelOrigin) {
  const rows = data.tanksMaterialCost.filter(r => {
    const srcMatch    = r.source      === source;
    const progMatch   = !program   || r.program    === program;
    const steelMatch  = !steelOrigin || r.steelOrigin === steelOrigin;
    return srcMatch && progMatch && steelMatch;
  });
  return unique(rows.map(r => r.supplier)).sort();
}

// Global data reference
let _appData = null;
function setAppData(d) { _appData = d; }
function getAppData()  { return _appData; }
