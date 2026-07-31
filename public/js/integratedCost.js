// integratedCost.js — Section 2: Integrated Cost stacked bar + logistics doughnut

let intChart = null;
let logisticsChart = null;

// ── Varied palette so every logistics segment is clearly distinct ──
const LOG_COLORS = [
  '#10b981', // teal      — Overseas freight / Domestic freight
  '#3b82f6', // blue      — Supplier to port
  '#f59e0b', // amber     — India/China customs
  '#8b5cf6', // purple    — Unloading costs
  '#06b6d4', // cyan      — Customs clearance US
  '#ec4899', // pink      — US freight cost
  '#84cc16', // lime      — Handling at ELP
  '#f97316', // orange    — Transport ELP–CUU
];

// ── Plugin: draw total $ on top of each stacked bar ──
const intTotalLabelPlugin = {
  id: 'intStackedTotals',
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
      ctx.font = 'bold 12px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(label, bar.x, bar.y - 5);
    });
    ctx.restore();
  }
};

// ── Plugin: draw $ total in doughnut center ──
const doughnutCenterPlugin = {
  id: 'doughnutCenter',
  afterDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const { ctx, chartArea: { width, height, left, top } } = chart;
    const cx = left + width / 2;
    const cy = top + height / 2;
    const total = (chart.data.datasets[0]?.data || []).reduce((s, v) => s + (v || 0), 0);
    if (!total) return;
    const label = total >= 1e6 ? `$${(total/1e6).toFixed(2)}M` : `$${(total/1000).toFixed(0)}K`;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px "Inter", system-ui, sans-serif';
    ctx.fillText(label, cx, cy - 8);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 10px "Inter", system-ui, sans-serif';
    ctx.fillText('LOGISTICS', cx, cy + 10);
    ctx.restore();
  }
};

// ── Plugin: draw % label on each visible doughnut arc ──
const doughnutLabelsPlugin = {
  id: 'doughnutArcLabels',
  afterDatasetsDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const total   = (dataset?.data || []).reduce((s, v) => s + (v || 0), 0);
    if (!total) return;

    chart.getDatasetMeta(0).data.forEach((arc, i) => {
      const value = dataset.data[i];
      if (!value) return;
      const pct = (value / total) * 100;
      if (pct < 4) return; // skip slivers

      const mid   = (arc.startAngle + arc.endAngle) / 2;
      const r     = (arc.outerRadius + arc.innerRadius) / 2;
      const x     = arc.x + r * Math.cos(mid);
      const y     = arc.y + r * Math.sin(mid);

      ctx.save();
      // Shadow for readability
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur  = 3;
      ctx.fillStyle   = '#ffffff';
      ctx.font        = 'bold 11px "Inter", system-ui, sans-serif';
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${pct.toFixed(0)}%`, x, y);
      ctx.restore();
    });
  }
};

function initIntegratedCost(data) {
  updateIntSupplierList(data);

  document.querySelectorAll('input[name="intSource"], input[name="intProgram"], input[name="intSteel"]').forEach(el => {
    el.addEventListener('change', () => {
      updateIntSupplierList(data);
      if (el.name === 'intSource') {
        const isOverseas = document.querySelector('input[name="intSource"]:checked')?.value === 'Overseas';
        if (isOverseas) {
          document.querySelector('input[name="intSteel"][value="Non-US"]').checked = true;
          document.getElementById('int-steel-origin-group').style.opacity = '0.45';
          document.getElementById('int-steel-origin-group').style.pointerEvents = 'none';
        } else {
          document.getElementById('int-steel-origin-group').style.opacity = '';
          document.getElementById('int-steel-origin-group').style.pointerEvents = '';
        }
      }
    });
  });

  document.getElementById('int-breakdown-toggle').addEventListener('change', function () {
    document.getElementById('toggle-label-text').textContent = this.checked ? 'Detailed' : 'Summarized';
  });

  document.getElementById('int-apply-btn').addEventListener('click', () => renderIntegratedCost(data));
  renderIntegratedCost(data);
}

function updateIntSupplierList(data) {
  const program     = document.querySelector('input[name="intProgram"]:checked')?.value || 'E2X';
  const source      = document.querySelector('input[name="intSource"]:checked')?.value  || 'Domestic';
  const steelOrigin = document.querySelector('input[name="intSteel"]:checked')?.value   || 'Non-US';

  const suppliers = getSuppliersFor(data, source, program, steelOrigin);
  const sel = document.getElementById('int-supplier-select');
  const prevVal = sel.value;
  sel.innerHTML = '';

  if (suppliers.length === 0) {
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = '— No suppliers for this selection —';
    sel.appendChild(opt);
    return;
  }

  suppliers.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    sel.appendChild(opt);
  });

  if (suppliers.includes(prevVal)) sel.value = prevVal;
}

function renderIntegratedCost(data) {
  const program     = document.querySelector('input[name="intProgram"]:checked')?.value || 'E2X';
  const source      = document.querySelector('input[name="intSource"]:checked')?.value  || 'Domestic';
  const supplier    = document.getElementById('int-supplier-select').value;
  const steelOrigin = document.querySelector('input[name="intSteel"]:checked')?.value   || 'Non-US';
  const coreMethod  = document.querySelector('input[name="intCore"]:checked')?.value    || 'inhouse';
  const breakdown   = document.getElementById('int-breakdown-toggle').checked;

  if (!supplier) {
    document.getElementById('int-kpi-row').innerHTML =
      `<div class="no-data"><span class="no-data-icon">🔍</span>Select a valid supplier and click Calculate</div>`;
    return;
  }

  const result = computeIntegratedCost(data, { program, source, supplier, steelOrigin, coreMethod, breakdown });

  // ── Tariff badge ──
  const badge = document.getElementById('int-tariff-badge');
  badge.className = `tariff-badge ${result.tariffType}`;
  badge.textContent = result.tariffType === 'original'
    ? '⚠️ Original Tariff (25%/15%)'
    : '✅ Reduced Tariff (10%)';

  // ── KPI Cards ──
  const demand = data.annualDemand[program];

  const logisticsKeys = ['Tank Logistics','Supplier to port','Overseas freight','India/China customs',
    'Unloading - other costs','Customs clearance US','US freight cost','Handling at ELP',
    'Transport ELP - CUU','Domestic freight cost'];
  const tankMatKeys = ['Tank Material','A36 Material','SSTL 304 Material'];

  const logTotal = Object.entries(result.segments)
    .filter(([k]) => logisticsKeys.includes(k))
    .reduce((s,[,v]) => s + (v||0), 0);
  const matTotal = Object.entries(result.segments)
    .filter(([k]) => tankMatKeys.includes(k))
    .reduce((s,[,v]) => s + (v||0), 0);

  const kpiRow = document.getElementById('int-kpi-row');
  const kpis = [
    { label: 'Total Cost / Unit',   value: fmt.usd(result.total, 0),                         sub: `${program} program`,    color: 'var(--blue)' },
    { label: 'Tank Material',        value: fmt.usd(matTotal, 0),                              sub: 'A36 + SSTL 304',        color: 'var(--c1)'   },
    { label: 'Tank Logistics',       value: fmt.usd(logTotal, 0),                              sub: source + ' shipping',    color: 'var(--teal)' },
    { label: 'Core Material',        value: fmt.usd(result.segments['Core Material'] || 0, 0), sub: coreMethod === 'inhouse' ? 'In-House' : coreMethod === 'outplant' ? 'Outplant' : 'Mitter', color: 'var(--purple)' },
    { label: 'Tariff',               value: fmt.usd(result.segments['Tariff'] || 0, 0),        sub: result.tariffType === 'original' ? '25%/15%' : '10%', color: 'var(--red)' },
    { label: 'Annual Cost 2027',     value: fmt.usd(result.total * demand.demand2027, 0),       sub: `${demand.demand2027} units`, color: 'var(--amber)' },
  ];

  kpiRow.innerHTML = kpis.map(k => `
    <div class="kpi-card" style="--kpi-color:${k.color}">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>
  `).join('');

  // ── MAIN CHART: Stacked Bar ──
  const segLabels = Object.keys(result.segments);
  const segValues = Object.values(result.segments);
  const segColors = segLabels.map(l => SEGMENT_COLORS[l] || '#4f8ef7');
  const barLabel  = `${supplier} · ${program} · ${source}${steelOrigin === 'US' ? ' · 🇺🇸 US' : ''}`;

  intChart = getOrCreateChart('integrated-chart', {
    type: 'bar',
    plugins: [intTotalLabelPlugin],
    data: {
      labels: [barLabel],
      datasets: segLabels.map((lbl, i) => ({
        label: lbl,
        data: [segValues[i]],
        backgroundColor: segColors[i] + 'cc',
        borderColor: segColors[i],
        borderWidth: 1,
        borderRadius: i === segLabels.length - 1 ? { topLeft: 6, topRight: 6 } : 0,
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      layout: { padding: { top: 30, right: 10, left: 5, bottom: 5 } },
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 14, boxHeight: 14, padding: 14, color: '#94a3b8', font: { size: 11 } }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: items => items.length ? items[0].label : '',
            label: ctx => {
              const v = ctx.raw;
              if (v == null || v === 0) return null;
              const pct = result.total > 0 ? ((v / result.total) * 100).toFixed(1) : '0.0';
              return `  ${ctx.dataset.label}: ${fmt.usd(v, 0)}  (${pct}%)`;
            },
            footer: () => [``, `  Total: ${fmt.usd(result.total, 0)}`]
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { maxRotation: 0, color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            padding: 8, color: '#94a3b8', font: { size: 11 },
            callback: v => v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`,
          }
        }
      }
    }
  });

  // ── SECONDARY CHART: Logistics Doughnut ──
  renderLogisticsChart(data, program, source, logTotal);

  // ── Breakdown Table ──
  const wrap  = document.getElementById('int-breakdown-wrap');
  const bBody = document.getElementById('int-breakdown-body');
  wrap.style.display = '';

  bBody.innerHTML = result.details.map(d => {
    const pct = result.total > 0 ? ((d.amt / result.total) * 100) : 0;
    const barColor = SEGMENT_COLORS[d.sub] || SEGMENT_COLORS[d.comp + ' Material'] || SEGMENT_COLORS[d.comp] || '#4f8ef7';
    return `<tr>
      <td><strong>${d.comp}</strong></td>
      <td style="color:var(--text-dim)">${d.sub}</td>
      <td class="num" style="font-weight:600">${fmt.usd(d.amt, 0)}</td>
      <td class="num">
        <span class="pct-bar" style="width:${Math.max(2, pct * 0.6)}px;background:${barColor}"></span>
        ${fmt.pct(pct, 1)}
      </td>
    </tr>`;
  }).join('');

  bBody.innerHTML += `<tr style="border-top:2px solid var(--border2);font-weight:700">
    <td colspan="2" style="color:var(--text)">TOTAL</td>
    <td class="num" style="color:var(--blue-light)">${fmt.usd(result.total, 0)}</td>
    <td class="num" style="color:var(--text-muted)">100.0%</td>
  </tr>`;
}

// ── Logistics Doughnut Chart ──────────────────────────────────────────────────
function renderLogisticsChart(data, program, source, logTotal) {
  const canvas  = document.getElementById('logistics-chart');
  const emptyEl = document.getElementById('logistics-empty');

  // Get individual logistics line items (always expanded, regardless of breakdown toggle)
  const logItems = data.tankLogistics.filter(r =>
    r.program === program && r.source === source && r.amount != null && r.amount > 0
  );

  if (logItems.length === 0) {
    canvas.style.display = 'none';
    if (emptyEl) emptyEl.style.display = '';
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
    return;
  }

  canvas.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  // Compute % of total logistics for each item
  const doughnutTotal = logItems.reduce((s, r) => s + r.amount, 0);

  logisticsChart = getOrCreateChart('logistics-chart', {
    type: 'doughnut',
    plugins: [doughnutCenterPlugin, doughnutLabelsPlugin],
    data: {
      labels: logItems.map(r => r.concept),
      datasets: [{
        data: logItems.map(r => r.amount),
        backgroundColor: LOG_COLORS.slice(0, logItems.length).map(c => c + 'e0'),
        borderColor:     LOG_COLORS.slice(0, logItems.length),
        borderWidth: 1.5,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      interaction: { mode: 'nearest', intersect: true },
      layout: { padding: { top: 5, bottom: 5, left: 5, right: 5 } },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10, boxHeight: 10, padding: 8,
            color: '#ffffff', font: { size: 10 },
            generateLabels: chart => {
              const ds    = chart.data.datasets[0];
              const total = ds.data.reduce((s, v) => s + (v || 0), 0);
              return chart.data.labels.map((lbl, i) => {
                const v   = ds.data[i];
                const pct = total > 0 ? ((v / total) * 100).toFixed(0) : 0;
                const short = lbl.length > 18 ? lbl.substring(0, 18) + '…' : lbl;
                return {
                  text: `${short}  ${pct}%`,
                  fillStyle: ds.backgroundColor[i],
                  strokeStyle: ds.borderColor[i],
                  lineWidth: 1,
                  index: i,
                  fontColor: '#ffffff', // Ensures label text color is white in Chart.js
                };
              });
            }
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: items => items.length ? items[0].label : '',
            label: ctx => {
              const v     = ctx.raw;
              const total = ctx.dataset.data.reduce((s, x) => s + (x || 0), 0);
              const pct   = total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';
              return `  ${fmt.usd(v, 0)}  —  ${pct}% of logistics`;
            },
            footer: ctx => {
              const total = ctx[0]?.dataset.data.reduce((s, x) => s + (x || 0), 0) || 0;
              return [``, `  Total logistics: ${fmt.usd(total, 0)}`];
            }
          }
        }
      }
    }
  });
}
