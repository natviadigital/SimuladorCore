// realScenarios.js — Section 4: Custom Scenario Comparison
// Users input real transformer specs per scenario to compare actual costs

'use strict';

let realChart = null;
let realScenariosList = [];
let realIdCounter = 0;

// ── Chart plugins (unique IDs to avoid collisions with other sections) ──

const realTotalsPlugin = {
  id: 'realTotalsLabel',
  afterDraw(chart) {
    const { ctx, data } = chart;
    if (!data.datasets.length) return;
    const lastMeta = chart.getDatasetMeta(data.datasets.length - 1);
    ctx.save();

    const totals = [];
    lastMeta.data.forEach((bar, i) => {
      totals.push(data.datasets.reduce((s, ds) => s + (Number(ds.data[i]) || 0), 0));
    });
    const valid = totals.filter(t => t > 0);
    const minTotal = valid.length > 0 ? Math.min(...valid) : Infinity;

    lastMeta.data.forEach((bar, i) => {
      const total = totals[i];
      if (!total) return;
      const isBest = total === minTotal && valid.length >= 2;
      let label = total >= 1e6
        ? `$${(total / 1e6).toFixed(2)}M`
        : `$${(total / 1000).toFixed(0)}K`;
      if (isBest) {
        label = `⭐ ${label}`;
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px "Inter", system-ui, sans-serif';
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px "Inter", system-ui, sans-serif';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(label, bar.x, bar.y - 5);
    });
    ctx.restore();
  }
};

const realPercentagesPlugin = {
  id: 'realStackedPercentages',
  afterDatasetsDraw(chart) {
    if (chart.config.type !== 'bar') return;
    const { ctx, data } = chart;
    const metaSets = data.datasets.map((_, i) => chart.getDatasetMeta(i));
    if (!metaSets.length) return;
    const numBars = metaSets[0].data.length;
    for (let barIdx = 0; barIdx < numBars; barIdx++) {
      const totalVal = data.datasets.reduce((s, ds) => s + (Number(ds.data[barIdx]) || 0), 0);
      if (!totalVal) continue;
      data.datasets.forEach((dataset, dsIdx) => {
        const val = Number(dataset.data[barIdx]) || 0;
        if (!val) return;
        const pct = (val / totalVal) * 100;
        if (pct < 5) return;
        const meta = metaSets[dsIdx];
        const bar = meta.data[barIdx];
        if (!bar) return;
        const { x, y, base } = bar;
        const cy = (y + base) / 2;
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px "Inter", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 3;
        ctx.fillText(`${pct.toFixed(0)}%`, x, cy);
        ctx.restore();
      });
    }
  }
};

// ── Segment colors ──
const REAL_SEG_COLORS = {
  'Tank Material':   '#4f8ef7',
  'Tank Logistics':  '#10b981',
  'Core Material':   '#a855f7',
  'Core Logistics':  '#8b5cf6',
  'Oil (US Fill)':   '#f59e0b',
  'Tariff':          '#ef4444',
};
const REAL_ALL_SEGS = ['Tank Material', 'Tank Logistics', 'Core Material', 'Core Logistics', 'Oil (US Fill)', 'Tariff'];

// ── Read shared inputs ──
function getRealShared() {
  return {
    program:       document.querySelector('input[name="realProgram"]:checked')?.value || 'E2X',
    lbsA36:        parseFloat(document.getElementById('real-lbs-a36').value)         || 0,
    lbsSSTL304:    parseFloat(document.getElementById('real-lbs-sstl304').value)     || 0,
    lbsCore:       parseFloat(document.getElementById('real-lbs-core').value)        || 0,
    gallonsOil:    parseFloat(document.getElementById('real-gallons-oil').value)     || 0,
    costPerGallon: parseFloat(document.getElementById('real-cost-per-gallon').value) || 0,
  };
}

// ── Core computation ──
function computeRealCost(shared, scn, data) {
  const result = { segments: {}, total: 0, details: [] };

  // 1. Tank Material
  const a36Cost  = shared.lbsA36    * (scn.priceA36    || 0);
  const sstlCost = shared.lbsSSTL304 * (scn.priceSSTL304 || 0);
  const tankMat  = a36Cost + sstlCost;
  result.segments['Tank Material'] = tankMat;
  result.details.push({
    comp: 'Tank',
    sub:  `A36 (${shared.lbsA36.toLocaleString()} lbs × ${fmt.usd(scn.priceA36 || 0, 2)}/lb) + SSTL 304 (${shared.lbsSSTL304.toLocaleString()} lbs × ${fmt.usd(scn.priceSSTL304 || 0, 2)}/lb)`,
    amt:  tankMat
  });

  // 2. Tank Logistics
  let tankLog = 0;
  let tankLogLabel = '';
  if (scn.tankTransportMode === 'preloaded') {
    const logItems = data.tankLogistics.filter(r =>
      r.program === shared.program && r.source === scn.tankSource && r.amount != null
    );
    tankLog = logItems.reduce((s, r) => s + r.amount, 0);
    tankLogLabel = `Preloaded — ${scn.tankSource} / ${shared.program}`;
  } else {
    tankLog = scn.tankTransportCustom || 0;
    tankLogLabel = 'Custom';
  }
  result.segments['Tank Logistics'] = tankLog;
  result.details.push({ comp: 'Logistics', sub: `Tank Transport — ${tankLogLabel}`, amt: tankLog });

  // 3. Core Material
  const coreMat = shared.lbsCore * (scn.priceCore || 0);
  result.segments['Core Material'] = coreMat;
  result.details.push({
    comp: 'Core',
    sub:  `Core Steel (${shared.lbsCore.toLocaleString()} lbs × ${fmt.usd(scn.priceCore || 0, 4)}/lb)`,
    amt:  coreMat
  });

  // 4. Core Logistics
  let coreLog = 0;
  let coreLogLabel = '';
  if (scn.coreTransportMode === 'preloaded') {
    const coreSupKey = scn.coreSteelOrigin === 'US' ? 'CLEVELAND CLIFFS' : 'JFE';
    const coreRow = data.coreMaterialCost.find(r => r.supplier === coreSupKey && r.grade === 'HO-DR');
    const freightPerLb = (coreRow && typeof coreRow.freightCost === 'number') ? coreRow.freightCost : 0;
    coreLog = freightPerLb * shared.lbsCore;
    coreLogLabel = `Preloaded — ${coreSupKey} (${fmt.usd(freightPerLb, 4)}/lb)`;
  } else {
    coreLog = scn.coreTransportCustom || 0;
    coreLogLabel = 'Custom';
  }
  result.segments['Core Logistics'] = coreLog;
  result.details.push({ comp: 'Core', sub: `Core Transport — ${coreLogLabel}`, amt: coreLog });

  // 5. Oil Cost (only if Less Oil / US Fill)
  const lessOil = scn.oilFill === 'lessOil';
  const oilCost = lessOil ? shared.gallonsOil * shared.costPerGallon : 0;
  if (oilCost > 0) {
    result.segments['Oil (US Fill)'] = oilCost;
    result.details.push({
      comp: 'Oil',
      sub:  `${shared.gallonsOil} gal × ${fmt.usd(shared.costPerGallon, 2)}/gal`,
      amt:  oilCost
    });
  }

  // 6. Tariff — preloaded from annualDemand
  const useOriginal = scn.tankSource === 'Overseas' || scn.tankSteelOrigin === 'Non-US';
  const demand      = data.annualDemand[shared.program];
  const tariff = useOriginal
    ? (lessOil ? demand.originalTariffLessOil  : demand.originalTariff)
    : (lessOil ? demand.reducedTariff10LessOil : demand.reducedTariff10);

  result.segments['Tariff'] = tariff;
  result.tariffType = useOriginal ? 'original' : 'reduced';
  result.oilFill    = scn.oilFill;

  const tariffLabel = useOriginal
    ? (lessOil ? 'Original Tariff — Less Oil (25%/15%)' : 'Original Tariff (25%/15%)')
    : (lessOil ? 'Reduced Tariff — Less Oil (10%)'      : 'Reduced Tariff (10%)');
  result.details.push({ comp: 'Tariff', sub: tariffLabel, amt: tariff });

  // Total
  result.total = Object.values(result.segments).reduce((s, v) => s + (v || 0), 0);
  return result;
}

// ── Init ──
function initRealScenarios(data) {
  // Program & shared inputs re-render on change
  document.querySelectorAll('input[name="realProgram"]').forEach(r => {
    r.addEventListener('change', () => renderRealChart(data));
  });
  ['real-lbs-a36', 'real-lbs-sstl304', 'real-lbs-core', 'real-gallons-oil', 'real-cost-per-gallon'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => renderRealChart(data));
  });

  // Add Scenario button
  document.getElementById('add-real-scenario-btn').addEventListener('click', () => {
    addRealScenario(data);
    renderRealChart(data);
  });

  // Start with 2 default scenarios
  addRealScenario(data, { name: 'Scenario A' });
  addRealScenario(data, { name: 'Scenario B' });
}

// ── Add scenario ──
function addRealScenario(data, defaults = {}) {
  const id    = ++realIdCounter;
  const color = SCENARIO_COLORS[(id - 1) % SCENARIO_COLORS.length];

  // Build supplier lists from data
  const tankSuppliers = [...new Set(data.tanksMaterialCost.map(r => r.supplier))].sort();
  const coreSuppliers = [...new Set(data.coreMaterialCost.map(r => r.supplier))].sort();

  const scn = {
    id, color,
    name:                defaults.name               || `Scenario ${String.fromCharCode(64 + id)}`,
    // Tank
    tankSupplier:        defaults.tankSupplier        || tankSuppliers[0] || '',
    tankSteelOrigin:     defaults.tankSteelOrigin     || 'Non-US',
    tankSource:          defaults.tankSource          || 'Domestic',
    priceA36:            defaults.priceA36            || 0,
    priceSSTL304:        defaults.priceSSTL304        || 0,
    tankTransportMode:   defaults.tankTransportMode   || 'preloaded',
    tankTransportCustom: defaults.tankTransportCustom || 0,
    // Core
    coreSupplier:        defaults.coreSupplier        || coreSuppliers[0] || '',
    coreSteelOrigin:     defaults.coreSteelOrigin     || 'Non-US',
    priceCore:           defaults.priceCore           || 0,
    coreTransportMode:   defaults.coreTransportMode   || 'preloaded',
    coreTransportCustom: defaults.coreTransportCustom || 0,
    // Oil
    oilFill:             defaults.oilFill             || 'origin',
  };

  realScenariosList.push(scn);
  const card = buildRealCard(data, scn, tankSuppliers, coreSuppliers);
  document.getElementById('real-scenarios-cards').appendChild(card);
}

// ── Remove scenario ──
function removeRealScenario(data, id) {
  realScenariosList = realScenariosList.filter(s => s.id !== id);
  const card = document.getElementById(`real-card-${id}`);
  if (card) card.remove();
  renderRealChart(data);
}

// ── Build scenario card ──
function buildRealCard(data, scn, tankSuppliers, coreSuppliers) {
  const card = document.createElement('div');
  card.className = 'scenario-card';
  card.id = `real-card-${scn.id}`;

  card.innerHTML = `
    <div class="scenario-card-header">
      <div class="scenario-color-dot" style="background:${scn.color}"></div>
      <input class="scenario-name-input" id="real-name-${scn.id}" type="text"
             value="${scn.name}" placeholder="Scenario name" />
      <button class="btn-remove-scenario" title="Remove scenario">✕</button>
    </div>
    <div class="real-card-body">

      <!-- ── TANK ─────────────────────────────── -->
      <div class="real-section-label">🏗️ Tank</div>

      <div class="scn-field">
        <span class="scn-field-label">Supplier (informational)</span>
        <select class="scn-select" id="real-tank-sup-${scn.id}">
          ${tankSuppliers.map(s =>
            `<option value="${s}" ${s === scn.tankSupplier ? 'selected' : ''}>${s}</option>`
          ).join('')}
        </select>
      </div>

      <div class="scn-field">
        <span class="scn-field-label">Tank Source</span>
        <div class="scn-radio-group">
          <button class="scn-radio-pill ${scn.tankSource === 'Domestic' ? 'selected' : ''}"
                  data-field="tankSource" data-val="Domestic">Domestic</button>
          <button class="scn-radio-pill ${scn.tankSource === 'Overseas' ? 'selected' : ''}"
                  data-field="tankSource" data-val="Overseas">Overseas</button>
        </div>
      </div>

      <div class="scn-field" id="real-tank-steel-field-${scn.id}"
           style="${scn.tankSource === 'Overseas' ? 'opacity:0.45;pointer-events:none' : ''}">
        <span class="scn-field-label">Steel Origin</span>
        <div class="scn-radio-group" id="real-tank-steel-${scn.id}">
          <button class="scn-radio-pill ${scn.tankSteelOrigin === 'Non-US' ? 'selected' : ''}"
                  data-field="tankSteelOrigin" data-val="Non-US">Non-US</button>
          <button class="scn-radio-pill ${scn.tankSteelOrigin === 'US' ? 'selected' : ''}"
                  data-field="tankSteelOrigin" data-val="US">🇺🇸 US Steel</button>
        </div>
      </div>

      <div class="real-price-row">
        <div class="scn-field">
          <span class="scn-field-label">A36 Price ($/lb)</span>
          <input type="number" class="scn-number-input" id="real-price-a36-${scn.id}"
                 value="${scn.priceA36 || ''}" min="0" step="0.01" placeholder="0.00" />
        </div>
        <div class="scn-field">
          <span class="scn-field-label">SSTL 304 ($/lb)</span>
          <input type="number" class="scn-number-input" id="real-price-sstl-${scn.id}"
                 value="${scn.priceSSTL304 || ''}" min="0" step="0.01" placeholder="0.00" />
        </div>
      </div>

      <div class="scn-field">
        <span class="scn-field-label">Tank Transport</span>
        <div class="real-transport-wrap">
          <div class="scn-radio-group">
            <button class="scn-radio-pill ${scn.tankTransportMode === 'preloaded' ? 'selected' : ''}"
                    data-field="tankTransportMode" data-val="preloaded">Preloaded</button>
            <button class="scn-radio-pill ${scn.tankTransportMode === 'custom' ? 'selected' : ''}"
                    data-field="tankTransportMode" data-val="custom">Custom $</button>
          </div>
          <div class="real-custom-input ${scn.tankTransportMode === 'custom' ? '' : 'hidden'}"
               id="real-tank-custom-wrap-${scn.id}">
            <input type="number" class="scn-number-input" id="real-tank-custom-${scn.id}"
                   value="${scn.tankTransportCustom || ''}" min="0" step="100"
                   placeholder="Total transport cost" />
          </div>
        </div>
      </div>

      <!-- ── CORE STEEL ─────────────────────── -->
      <div class="real-section-label" style="margin-top:12px">⚡ Core Steel</div>

      <div class="scn-field">
        <span class="scn-field-label">Supplier (informational)</span>
        <select class="scn-select" id="real-core-sup-${scn.id}">
          ${coreSuppliers.map(s =>
            `<option value="${s}" ${s === scn.coreSupplier ? 'selected' : ''}>${s}</option>`
          ).join('')}
        </select>
      </div>

      <div class="scn-field">
        <span class="scn-field-label">Steel Origin</span>
        <div class="scn-radio-group" id="real-core-steel-${scn.id}">
          <button class="scn-radio-pill ${scn.coreSteelOrigin === 'Non-US' ? 'selected' : ''}"
                  data-field="coreSteelOrigin" data-val="Non-US">Non-US</button>
          <button class="scn-radio-pill ${scn.coreSteelOrigin === 'US' ? 'selected' : ''}"
                  data-field="coreSteelOrigin" data-val="US">🇺🇸 US Steel</button>
        </div>
      </div>

      <div class="scn-field">
        <span class="scn-field-label">Core Steel Price ($/lb)</span>
        <input type="number" class="scn-number-input" id="real-price-core-${scn.id}"
               value="${scn.priceCore || ''}" min="0" step="0.0001" placeholder="0.0000" />
      </div>

      <div class="scn-field">
        <span class="scn-field-label">Core Transport</span>
        <div class="real-transport-wrap">
          <div class="scn-radio-group">
            <button class="scn-radio-pill ${scn.coreTransportMode === 'preloaded' ? 'selected' : ''}"
                    data-field="coreTransportMode" data-val="preloaded">Preloaded</button>
            <button class="scn-radio-pill ${scn.coreTransportMode === 'custom' ? 'selected' : ''}"
                    data-field="coreTransportMode" data-val="custom">Custom $</button>
          </div>
          <div class="real-custom-input ${scn.coreTransportMode === 'custom' ? '' : 'hidden'}"
               id="real-core-custom-wrap-${scn.id}">
            <input type="number" class="scn-number-input" id="real-core-custom-${scn.id}"
                   value="${scn.coreTransportCustom || ''}" min="0" step="100"
                   placeholder="Total transport cost" />
          </div>
        </div>
      </div>

      <!-- ── OIL FILL ───────────────────────── -->
      <div class="real-section-label" style="margin-top:12px">🛢️ Oil Fill Location</div>
      <div class="scn-field">
        <div class="scn-radio-group" id="real-oil-${scn.id}">
          <button class="scn-radio-pill ${scn.oilFill === 'origin'  ? 'selected' : ''}"
                  data-field="oilFill" data-val="origin">Fill at Origin</button>
          <button class="scn-radio-pill ${scn.oilFill === 'lessOil' ? 'selected' : ''}"
                  data-field="oilFill" data-val="lessOil">Less Oil (US Fill)</button>
        </div>
      </div>

    </div>

    <!-- Result badge -->
    <div class="scenario-result-badge" id="real-result-${scn.id}">
      <div>
        <div class="srb-label">Total Cost / Unit</div>
        <div class="srb-tariff" id="real-tariff-lbl-${scn.id}"></div>
      </div>
      <div class="srb-value" id="real-total-${scn.id}">—</div>
    </div>
  `;

  // ── Event listeners ──

  // Name
  card.querySelector(`#real-name-${scn.id}`).addEventListener('input', e => {
    scn.name = e.target.value || `Scenario ${scn.id}`;
    renderRealChart(data);
  });

  // Remove
  card.querySelector('.btn-remove-scenario').addEventListener('click', () => removeRealScenario(data, scn.id));

  // All pill buttons
  card.querySelectorAll('.scn-radio-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.field;
      const val   = btn.dataset.val;
      if (!field) return;

      scn[field] = val;
      card.querySelectorAll(`.scn-radio-pill[data-field="${field}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Overseas → force Non-US steel for tank
      if (field === 'tankSource' && val === 'Overseas') {
        scn.tankSteelOrigin = 'Non-US';
        card.querySelectorAll(`#real-tank-steel-${scn.id} .scn-radio-pill`).forEach(b =>
          b.classList.toggle('selected', b.dataset.val === 'Non-US')
        );
        const steelField = card.querySelector(`#real-tank-steel-field-${scn.id}`);
        if (steelField) { steelField.style.opacity = '0.45'; steelField.style.pointerEvents = 'none'; }
      }
      if (field === 'tankSource' && val === 'Domestic') {
        const steelField = card.querySelector(`#real-tank-steel-field-${scn.id}`);
        if (steelField) { steelField.style.opacity = ''; steelField.style.pointerEvents = ''; }
      }

      // Show / hide custom transport inputs
      if (field === 'tankTransportMode') {
        const wrap = card.querySelector(`#real-tank-custom-wrap-${scn.id}`);
        if (wrap) wrap.classList.toggle('hidden', val !== 'custom');
      }
      if (field === 'coreTransportMode') {
        const wrap = card.querySelector(`#real-core-custom-wrap-${scn.id}`);
        if (wrap) wrap.classList.toggle('hidden', val !== 'custom');
      }

      renderRealChart(data);
    });
  });

  // Supplier dropdowns (informational only)
  card.querySelector(`#real-tank-sup-${scn.id}`).addEventListener('change', e => { scn.tankSupplier = e.target.value; });
  card.querySelector(`#real-core-sup-${scn.id}`).addEventListener('change', e => { scn.coreSupplier = e.target.value; });

  // Number inputs
  [
    { elId: `real-price-a36-${scn.id}`,    prop: 'priceA36' },
    { elId: `real-price-sstl-${scn.id}`,   prop: 'priceSSTL304' },
    { elId: `real-price-core-${scn.id}`,   prop: 'priceCore' },
    { elId: `real-tank-custom-${scn.id}`,  prop: 'tankTransportCustom' },
    { elId: `real-core-custom-${scn.id}`,  prop: 'coreTransportCustom' },
  ].forEach(({ elId, prop }) => {
    const el = card.querySelector(`#${elId}`);
    if (el) el.addEventListener('input', e => {
      scn[prop] = parseFloat(e.target.value) || 0;
      renderRealChart(data);
    });
  });

  return card;
}

// ── Render chart ──
function renderRealChart(data) {
  const canvas = document.getElementById('real-scenarios-chart');
  if (!canvas) return;

  if (realScenariosList.length === 0) {
    document.getElementById('real-delta-wrap').innerHTML = '';
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
    return;
  }

  const shared = getRealShared();

  // Only include scenarios where at least one price is filled in
  const results = realScenariosList.map(scn => {
    if (!scn.priceA36 && !scn.priceSSTL304 && !scn.priceCore) return null;
    return { scn, result: computeRealCost(shared, scn, data) };
  }).filter(Boolean);

  // Update result badges on each card
  realScenariosList.forEach(scn => {
    const res = results.find(r => r.scn.id === scn.id);
    const totalEl  = document.getElementById(`real-total-${scn.id}`);
    const tariffEl = document.getElementById(`real-tariff-lbl-${scn.id}`);
    if (res) {
      if (totalEl)  totalEl.textContent  = fmt.usd(res.result.total, 0);
      if (tariffEl) {
        const base   = res.result.tariffType === 'original' ? '⚠️ Original Tariff' : '✅ Reduced Tariff';
        const oilTag = res.result.oilFill === 'lessOil' ? ' · Less Oil' : '';
        tariffEl.textContent = base + oilTag;
      }
    } else {
      if (totalEl)  totalEl.textContent  = '—';
      if (tariffEl) tariffEl.textContent = '';
    }
  });

  if (results.length === 0) {
    renderRealDeltaTable([], data);
    return;
  }

  // Build multi-line X-axis labels
  const labels = results.map(r => [
    r.scn.name,
    `Tank: ${r.scn.tankSupplier || 'N/A'} · ${r.scn.tankSource}`,
    `Oil: ${r.scn.oilFill === 'lessOil' ? 'Less Oil (US Fill)' : 'Fill at Origin'}`,
  ]);

  // Only include segments that have data in at least one scenario
  const activeSegs = REAL_ALL_SEGS.filter(seg =>
    results.some(r => (r.result.segments[seg] || 0) > 0)
  );

  const datasets = activeSegs.map(seg => ({
    label:           seg,
    data:            results.map(r => r.result.segments[seg] || 0),
    backgroundColor: REAL_SEG_COLORS[seg] + 'cc',
    borderColor:     REAL_SEG_COLORS[seg],
    borderWidth:     1,
  }));

  realChart = getOrCreateChart('real-scenarios-chart', {
    type: 'bar',
    plugins: [realTotalsPlugin, realPercentagesPlugin],
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      layout: { padding: { top: 35, right: 10, left: 5, bottom: 5 } },
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 14, boxHeight: 14, padding: 14, color: '#94a3b8', font: { size: 11 } }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: items => {
              const lbl = items[0]?.label;
              return Array.isArray(lbl) ? lbl[0] : (lbl || '');
            },
            label: ctx => {
              const v = ctx.raw;
              if (!v) return null;
              const total = results[ctx.dataIndex]?.result?.total || 1;
              const pct = ((v / total) * 100).toFixed(1);
              return `  ${ctx.dataset.label}: ${fmt.usd(v, 0)}  (${pct}%)`;
            },
            footer: items => {
              const total = results[items[0]?.dataIndex]?.result?.total;
              return total ? ['', `  Total: ${fmt.usd(total, 0)}`] : [];
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 0, autoSkip: false }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            padding: 8, color: '#94a3b8', font: { size: 11 },
            callback: v =>
              v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M`
              : v >= 1000 ? `$${(v / 1000).toFixed(0)}K`
              : `$${v}`
          }
        }
      }
    }
  });

  renderRealDeltaTable(results, data);
}

// ── Delta comparison table ──
function renderRealDeltaTable(results, data) {
  const wrap = document.getElementById('real-delta-wrap');
  if (!wrap) return;

  if (results.length < 2) {
    wrap.innerHTML = `<div class="no-data" style="height:80px;">
      <span style="font-size:0.82rem">Enter prices in at least 2 scenarios to see cost comparison</span>
    </div>`;
    return;
  }

  const totals   = results.map(r => r.result.total);
  const minTotal = Math.min(...totals);
  const rows     = results.map(r => ({
    scn:     r.scn,
    result:  r.result,
    delta:   r.result.total - minTotal,
    isBest:  r.result.total === minTotal,
    pctDiff: minTotal > 0 ? ((r.result.total - minTotal) / minTotal * 100) : 0,
  }));

  // Only show segments that appear in at least one result
  const visibleSegs = REAL_ALL_SEGS.filter(s => results.some(r => (r.result.segments[s] || 0) > 0));

  wrap.innerHTML = `
    <div class="delta-table-wrap">
      <div class="delta-table-title">📊 Custom Scenario Cost Comparison</div>
      <div class="table-scroll-wrap" style="border:none">
        <table class="data-table compact">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Tank Source</th>
              <th>Tank Steel</th>
              <th>Core Steel</th>
              <th>Oil Fill</th>
              <th>Tariff Rate</th>
              ${visibleSegs.map(s => `<th class="num">${s}</th>`).join('')}
              <th class="num">Total / Unit</th>
              <th class="num">vs. Best</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr style="${row.isBest ? 'background:rgba(16,185,129,0.06);' : ''}">
                <td>
                  <div style="display:flex;align-items:center;gap:7px">
                    <span style="width:10px;height:10px;border-radius:50%;background:${row.scn.color};flex-shrink:0;display:inline-block"></span>
                    <strong>${row.scn.name}</strong>
                    ${row.isBest ? '<span class="delta-badge neg" style="font-size:0.65rem">⭐ Best</span>' : ''}
                  </div>
                </td>
                <td><span class="badge-source ${row.scn.tankSource === 'Domestic' ? 'domestic' : 'overseas'}">${row.scn.tankSource}</span></td>
                <td style="color:var(--text-dim)">${row.scn.tankSteelOrigin === 'US' ? '🇺🇸 US Steel' : 'Non-US'}</td>
                <td style="color:var(--text-dim)">${row.scn.coreSteelOrigin === 'US' ? '🇺🇸 US Steel' : 'Non-US'}</td>
                <td>
                  <span class="delta-badge ${row.scn.oilFill === 'lessOil' ? 'pos' : 'neu'}">
                    ${row.scn.oilFill === 'lessOil' ? 'Less Oil (US Fill)' : 'Fill at Origin'}
                  </span>
                </td>
                <td>
                  <span class="delta-badge ${row.result.tariffType === 'reduced' ? 'neg' : 'pos'}">
                    ${row.result.tariffType === 'reduced' ? '10%' : '25%/15%'}${row.scn.oilFill === 'lessOil' ? ' − Oil' : ''}
                  </span>
                </td>
                ${visibleSegs.map(s => `<td class="num">${fmt.usd(row.result.segments[s] || 0, 0)}</td>`).join('')}
                <td class="num" style="font-weight:700;color:${row.isBest ? 'var(--teal)' : 'var(--text)'}">
                  ${fmt.usd(row.result.total, 0)}
                </td>
                <td class="num">
                  ${row.isBest
                    ? '<span class="delta-badge neg">Best</span>'
                    : `<span class="delta-badge pos">+${fmt.usd(row.delta, 0)} (+${row.pctDiff.toFixed(1)}%)</span>`
                  }
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
