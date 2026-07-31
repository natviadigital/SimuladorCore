// scenarios.js — Section 3: N-Scenario Dynamic Comparison

let scenariosChart = null;
let scenarios = [];
let scnIdCounter = 0;

const CORE_METHODS = [
  { value: 'inhouse',  label: 'In-House Make' },
  { value: 'outplant', label: 'Outplant Make' },
  { value: 'mitter',   label: 'Mitter Cut Core' },
];

// ── Plugin: draw total $ on top of each scenario bar ──
const scnTotalLabelPlugin = {
  id: 'scnStackedTotals',
  afterDraw(chart) {
    const { ctx, data } = chart;
    if (!data.datasets.length) return;
    const lastMeta = chart.getDatasetMeta(data.datasets.length - 1);
    ctx.save();
    lastMeta.data.forEach((bar, i) => {
      const total = data.datasets.reduce((s, ds) => s + (Number(ds.data[i]) || 0), 0);
      if (!total) return;
      const label = total >= 1e6
        ? `$${(total / 1e6).toFixed(2)}M`
        : `$${(total / 1000).toFixed(0)}K`;
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(label, bar.x, bar.y - 5);
    });
    ctx.restore();
  }
};

// ── Plugin: draw percentage label inside each stacked segment ──
const stackedPercentagesPlugin = {
  id: 'stackedPercentages',
  afterDatasetsDraw(chart) {
    if (chart.config.type !== 'bar') return;
    const { ctx, data } = chart;
    const metaSets = data.datasets.map((_, i) => chart.getDatasetMeta(i));
    if (!metaSets.length) return;

    const numBars = metaSets[0].data.length;
    for (let barIdx = 0; barIdx < numBars; barIdx++) {
      const totalVal = data.datasets.reduce((sum, ds) => sum + (Number(sum) === 0 ? 0 : 0) + (Number(ds.data[barIdx]) || 0), 0);
      if (!totalVal) continue;

      data.datasets.forEach((dataset, dsIdx) => {
        const val = Number(dataset.data[barIdx]) || 0;
        if (!val) return;

        const pct = (val / totalVal) * 100;
        if (pct < 5) return; // Hide on segments under 5% for clean styling

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

// ── Check if Mitter is available for a given steelOrigin ──
function isMitterAvailable(data, steelOrigin) {
  const coreSupplier = steelOrigin === 'US' ? 'CLEVELAND CLIFFS' : 'JFE';
  const coreRow = data.coreMaterialCost.find(r => r.supplier === coreSupplier && r.grade === 'HO-DR');
  return coreRow && typeof coreRow.totalCostMitter === 'number';
}

function initScenarios(data) {
  document.getElementById('add-scenario-btn').addEventListener('click', () => {
    addScenario(data);
    renderScenariosChart(data);
  });

  document.querySelectorAll('input[name="scnProgram"]').forEach(r => {
    r.addEventListener('change', () => {
      scenarios.forEach(s => refreshScnSuppliers(data, s.id));
      renderScenariosChart(data);
    });
  });

  // Start with 2 default scenarios
  addScenario(data, {
    name: 'Scenario A — Domestic',
    source: 'Domestic',
    steelOrigin: 'Non-US',
    coreMethod: 'inhouse'
  });
  addScenario(data, {
    name: 'Scenario B — Overseas',
    source: 'Overseas',
    steelOrigin: 'Non-US',
    coreMethod: 'inhouse'
  });

  renderScenariosChart(data);
}

function getScnProgram() {
  return document.querySelector('input[name="scnProgram"]:checked')?.value || 'E2X';
}

function addScenario(data, defaults = {}) {
  const id    = ++scnIdCounter;
  const color = SCENARIO_COLORS[(id - 1) % SCENARIO_COLORS.length];

  const scn = {
    id,
    color,
    name:        defaults.name        || `Scenario ${String.fromCharCode(64 + id)}`,
    source:      defaults.source      || 'Domestic',
    steelOrigin: defaults.steelOrigin || 'Non-US',
    supplier:    defaults.supplier    || '',
    coreMethod:  defaults.coreMethod  || 'inhouse',
  };
  scenarios.push(scn);

  const card = buildScenarioCard(data, scn);
  document.getElementById('scenarios-cards').appendChild(card);
  refreshScnSuppliers(data, id);
}

function removeScenario(data, id) {
  scenarios = scenarios.filter(s => s.id !== id);
  const card = document.getElementById(`scn-card-${id}`);
  if (card) card.remove();
  renderScenariosChart(data);
}

function buildScenarioCard(data, scn) {
  const mitterAvail = isMitterAvailable(data, scn.steelOrigin);

  const card = document.createElement('div');
  card.className = 'scenario-card';
  card.id = `scn-card-${scn.id}`;

  card.innerHTML = `
    <div class="scenario-card-header">
      <div class="scenario-color-dot" style="background:${scn.color}"></div>
      <input class="scenario-name-input" id="scn-name-${scn.id}" type="text" value="${scn.name}" placeholder="Scenario name" />
      <button class="btn-remove-scenario" title="Remove scenario" data-id="${scn.id}">✕</button>
    </div>
    <div class="scenario-card-body">

      <div class="scn-field">
        <span class="scn-field-label">Tank Source</span>
        <div class="scn-radio-group" id="scn-source-${scn.id}">
          ${['Domestic','Overseas'].map(v =>
            `<button class="scn-radio-pill ${scn.source === v ? 'selected':''}" data-field="source" data-val="${v}">${v}</button>`
          ).join('')}
        </div>
      </div>

      <div class="scn-field" id="scn-steel-field-${scn.id}" style="${scn.source === 'Overseas' ? 'opacity:0.45;pointer-events:none' : ''}">
        <span class="scn-field-label">Steel Origin</span>
        <div class="scn-radio-group" id="scn-steel-${scn.id}">
          ${['Non-US','US'].map(v =>
            `<button class="scn-radio-pill ${scn.steelOrigin === v ? 'selected':''}" data-field="steelOrigin" data-val="${v}">${v === 'US' ? '🇺🇸 US Steel' : 'Non-US'}</button>`
          ).join('')}
        </div>
      </div>

      <div class="scn-field">
        <span class="scn-field-label">Tank Supplier</span>
        <select class="scn-select" id="scn-supplier-${scn.id}"></select>
      </div>

      <div class="scn-field">
        <span class="scn-field-label">Core Method</span>
        <div class="scn-radio-group" id="scn-core-${scn.id}">
          ${CORE_METHODS.map(m => {
            const isMitter = m.value === 'mitter';
            const disabled = isMitter && !mitterAvail;
            return `<button
              class="scn-radio-pill ${scn.coreMethod === m.value && !disabled ? 'selected':''} ${disabled ? 'disabled-pill':''}"
              data-field="coreMethod"
              data-val="${m.value}"
              ${disabled ? 'disabled title="Mitter Cut Core requires Non-US steel (JFE)"' : ''}
            >${m.label}</button>`;
          }).join('')}
        </div>
      </div>

    </div>
    <div class="scenario-result-badge" id="scn-result-${scn.id}">
      <div>
        <div class="srb-label">Total Cost / Unit</div>
        <div class="srb-tariff" id="scn-tariff-lbl-${scn.id}"></div>
      </div>
      <div class="srb-value" id="scn-total-${scn.id}">—</div>
    </div>
  `;

  // ── Event listeners ──

  // Name
  card.querySelector(`#scn-name-${scn.id}`).addEventListener('input', e => {
    scn.name = e.target.value || `Scenario ${scn.id}`;
    renderScenariosChart(data);
  });

  // Remove
  card.querySelector('.btn-remove-scenario').addEventListener('click', () => removeScenario(data, scn.id));

  // Pill buttons
  card.querySelectorAll('.scn-radio-pill:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.field;
      const val   = btn.dataset.val;
      scn[field]  = val;

      // Deselect siblings
      card.querySelectorAll(`.scn-radio-pill[data-field="${field}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // If overseas → force Non-US steel
      if (field === 'source' && val === 'Overseas') {
        scn.steelOrigin = 'Non-US';
        card.querySelectorAll(`#scn-steel-${scn.id} .scn-radio-pill`).forEach(b => {
          b.classList.toggle('selected', b.dataset.val === 'Non-US');
        });
        document.getElementById(`scn-steel-field-${scn.id}`).style.opacity = '0.45';
        document.getElementById(`scn-steel-field-${scn.id}`).style.pointerEvents = 'none';
        updateMitterAvailability(data, scn, card);
      }
      if (field === 'source' && val === 'Domestic') {
        document.getElementById(`scn-steel-field-${scn.id}`).style.opacity = '';
        document.getElementById(`scn-steel-field-${scn.id}`).style.pointerEvents = '';
      }

      // If steelOrigin changes → update Mitter availability
      if (field === 'steelOrigin') {
        updateMitterAvailability(data, scn, card);
      }

      refreshScnSuppliers(data, scn.id);
      renderScenariosChart(data);
    });
  });

  // Supplier select
  card.querySelector(`#scn-supplier-${scn.id}`).addEventListener('change', e => {
    scn.supplier = e.target.value;
    renderScenariosChart(data);
  });

  return card;
}

// ── Update Mitter button enabled/disabled state ──
function updateMitterAvailability(data, scn, card) {
  const avail = isMitterAvailable(data, scn.steelOrigin);
  const mitterBtn = card.querySelector(`#scn-core-${scn.id} .scn-radio-pill[data-val="mitter"]`);
  if (!mitterBtn) return;

  mitterBtn.classList.toggle('disabled-pill', !avail);
  mitterBtn.disabled = !avail;

  if (!avail) {
    mitterBtn.setAttribute('title', 'Mitter Cut Core requires Non-US steel (JFE)');
    // If mitter was selected, fall back to inhouse
    if (scn.coreMethod === 'mitter') {
      scn.coreMethod = 'inhouse';
      card.querySelectorAll(`#scn-core-${scn.id} .scn-radio-pill`).forEach(b => {
        b.classList.toggle('selected', b.dataset.val === 'inhouse' && !b.disabled);
      });
    }
  } else {
    mitterBtn.removeAttribute('title');
    mitterBtn.removeAttribute('disabled');
  }
}

function refreshScnSuppliers(data, id) {
  const scn = scenarios.find(s => s.id === id);
  if (!scn) return;
  const program = getScnProgram();
  const suppliers = getSuppliersFor(data, scn.source, program, scn.steelOrigin);

  const sel = document.getElementById(`scn-supplier-${id}`);
  if (!sel) return;

  const prev = sel.value;
  sel.innerHTML = '';

  if (suppliers.length === 0) {
    sel.innerHTML = '<option value="">No suppliers available</option>';
    scn.supplier = '';
    return;
  }

  suppliers.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    sel.appendChild(opt);
  });

  sel.value = suppliers.includes(prev) ? prev : suppliers[0];
  scn.supplier = sel.value;
}

function renderScenariosChart(data) {
  if (scenarios.length === 0) {
    document.getElementById('delta-wrap').innerHTML = '';
    const existing = Chart.getChart('scenarios-chart');
    if (existing) existing.destroy();
    return;
  }

  const program = getScnProgram();

  const results = scenarios.map(scn => {
    if (!scn.supplier) return null;
    const result = computeIntegratedCost(data, {
      program,
      source:      scn.source,
      supplier:    scn.supplier,
      steelOrigin: scn.steelOrigin,
      coreMethod:  scn.coreMethod,
      breakdown:   false
    });
    return { scn, result };
  }).filter(Boolean);

  // Update result badges on each card
  results.forEach(({ scn, result }) => {
    const totalEl  = document.getElementById(`scn-total-${scn.id}`);
    const tariffEl = document.getElementById(`scn-tariff-lbl-${scn.id}`);
    if (totalEl)  totalEl.textContent  = fmt.usd(result.total, 0);
    if (tariffEl) tariffEl.textContent = result.tariffType === 'original' ? '⚠️ Original Tariff' : '✅ Reduced Tariff';
  });

  if (results.length === 0) return;

  // ── Build stacked bar chart with detailed multi-line X labels ──
  const labels = results.map(r => {
    const coreLabel = CORE_METHODS.find(m => m.value === r.scn.coreMethod)?.label || r.scn.coreMethod;
    const tariffLabel = r.result.tariffType === 'reduced' ? 'Reduced Tariff' : 'Original Tariff';
    return [
      r.scn.name,
      `Tank: ${r.scn.supplier || 'N/A'}`,
      `Core: ${coreLabel}`,
      `Tariff: ${tariffLabel}`
    ];
  });

  const allSegs = ['Tank Material','Tank Logistics','Core Material','Tariff'];
  const segColors = {
    'Tank Material':  '#4f8ef7',
    'Tank Logistics': '#10b981',
    'Core Material':  '#a855f7',
    'Tariff':         '#ef4444',
  };

  const datasets = allSegs.map(seg => ({
    label: seg,
    data: results.map(r => r.result.segments[seg] || 0),
    backgroundColor: segColors[seg] + 'cc',
    borderColor: segColors[seg],
    borderWidth: 1,
  }));

  scenariosChart = getOrCreateChart('scenarios-chart', {
    type: 'bar',
    plugins: [scnTotalLabelPlugin, stackedPercentagesPlugin],
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      layout: { padding: { top: 30, right: 10, left: 5, bottom: 5 } },
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 14, boxHeight: 14, padding: 14, color: '#94a3b8', font: { size: 11 } }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            beforeTitle: items => {
              const idx = items[0].dataIndex;
              const r = results[idx];
              return r ? r.scn.name : '';
            },
            title: items => {
              if (!items.length) return '';
              const lbl = items[0].label;
              return Array.isArray(lbl) ? lbl[0] : lbl;
            },
            label: ctx => {
              const v = ctx.raw;
              if (v == null || v === 0) return null;
              const idx = ctx.dataIndex;
              const total = results[idx]?.result?.total || 1;
              const pct = total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';
              return `  ${ctx.dataset.label}: ${fmt.usd(v, 0)}  (${pct}%)`;
            },
            footer: items => {
              const idx = items[0].dataIndex;
              return [``, `  Total: ${fmt.usd(results[idx]?.result?.total, 0)}`];
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            color: '#94a3b8', font: { size: 10 },
            maxRotation: 0,
            autoSkip: false
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            padding: 8,
            color: '#94a3b8', font: { size: 11 },
            callback: v => v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`,
          }
        }
      }
    }
  });

  // ── Scenario legend ──
  document.getElementById('scenario-legend').innerHTML = results.map(r =>
    `<div class="legend-item">
      <span class="legend-dot" style="background:${r.scn.color}"></span>
      ${r.scn.name}
    </div>`
  ).join('');

  // ── Delta table ──
  renderDeltaTable(results);
}

function renderDeltaTable(results) {
  const wrap = document.getElementById('delta-wrap');
  if (results.length < 2) {
    wrap.innerHTML = `<div class="no-data" style="height:80px;"><span style="font-size:0.82rem">Add at least 2 scenarios to see cost comparison</span></div>`;
    return;
  }

  const totals = results.map(r => r.result.total);
  const minTotal = Math.min(...totals);

  const rows = results.map(r => ({
    scn: r.scn, result: r.result,
    delta: r.result.total - minTotal,
    isBest: r.result.total === minTotal,
    pctDiff: minTotal > 0 ? ((r.result.total - minTotal) / minTotal * 100) : 0
  }));

  const segs = ['Tank Material','Tank Logistics','Core Material','Tariff'];

  wrap.innerHTML = `
    <div class="delta-table-wrap">
      <div class="delta-table-title">📊 Scenario Cost Comparison</div>
      <div class="table-scroll-wrap" style="border:none">
        <table class="data-table compact">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Source</th>
              <th>Supplier</th>
              <th>Core Method</th>
              <th>Tariff</th>
              ${segs.map(s => `<th class="num">${s}</th>`).join('')}
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
                <td><span class="badge-source ${row.scn.source === 'Domestic' ? 'domestic' : 'overseas'}">${row.scn.source}</span></td>
                <td>${row.scn.supplier}</td>
                <td style="color:var(--text-dim)">${CORE_METHODS.find(m => m.value === row.scn.coreMethod)?.label || row.scn.coreMethod}</td>
                <td>
                  <span class="delta-badge ${row.result.tariffType === 'reduced' ? 'neg' : 'pos'}">
                    ${row.result.tariffType === 'reduced' ? '10%' : '25%/15%'}
                  </span>
                </td>
                ${segs.map(s => `<td class="num">${fmt.usd(row.result.segments[s] || 0, 0)}</td>`).join('')}
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
