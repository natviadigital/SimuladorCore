// integratedCost.js — Section 2: Integrated Cost stacked bar chart

let intChart = null;

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

  // Sum logistics segments dynamically
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

  // ── Chart ──
  const labels = Object.keys(result.segments);
  const values = Object.values(result.segments);
  const colors = labels.map(l => SEGMENT_COLORS[l] || '#4f8ef7');

  const barLabel = `${supplier} · ${program} · ${source}${steelOrigin === 'US' ? ' · 🇺🇸 US' : ''}`;

  intChart = getOrCreateChart('integrated-chart', {
    type: 'bar',
    plugins: [intTotalLabelPlugin],
    data: {
      labels: [barLabel],
      datasets: labels.map((lbl, i) => ({
        label: lbl,
        data: [values[i]],
        backgroundColor: colors[i] + 'cc',
        borderColor: colors[i],
        borderWidth: 1,
        borderRadius: i === labels.length - 1 ? { topLeft: 6, topRight: 6 } : 0,
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // Chart.js v4: interaction must be at top-level options, not inside plugins.tooltip
      interaction: {
        mode: 'index',
        intersect: false,
      },
      layout: { padding: { top: 30, right: 10, left: 5, bottom: 5 } },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 14, boxHeight: 14, padding: 14,
            color: '#94a3b8', font: { size: 11 },
          }
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
            padding: 8,
            color: '#94a3b8',
            font: { size: 11 },
            callback: v => v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`,
          }
        }
      }
    }
  });

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
