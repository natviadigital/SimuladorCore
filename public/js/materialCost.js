// materialCost.js — Section 1: Material Cost Table

let matChart = null;

function initMaterialCost(data) {
  // Populate core supplier dropdown
  const coreSuppliers = unique(data.coreMaterialCost.map(r => r.supplier)).sort();
  const coreSupplierSel = document.getElementById('core-supplier-filter');
  coreSuppliers.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    coreSupplierSel.appendChild(opt);
  });

  // Populate core grade dropdown
  const coreGrades = unique(data.coreMaterialCost.map(r => r.grade)).sort();
  const coreGradeSel = document.getElementById('core-grade-filter');
  coreGrades.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g; opt.textContent = g;
    coreGradeSel.appendChild(opt);
  });

  // Material type toggle
  document.querySelectorAll('input[name="matType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isTank = radio.value === 'tank';
      document.getElementById('tank-filters').style.display = isTank ? '' : 'none';
      document.getElementById('core-filters').style.display = isTank ? 'none' : '';
      document.querySelector('#pill-tank').classList.toggle('active', isTank);
      document.querySelector('#pill-core').classList.toggle('active', !isTank);
      renderMaterialTable(data);
    });
  });

  // Apply button
  document.getElementById('mat-apply-btn').addEventListener('click', () => renderMaterialTable(data));

  // Also update on filter changes instantly
  document.querySelectorAll('#material-filters input, #material-filters select').forEach(el => {
    el.addEventListener('change', () => renderMaterialTable(data));
  });

  // Initial render
  renderMaterialTable(data);
}

function renderMaterialTable(data) {
  const matType = document.querySelector('input[name="matType"]:checked')?.value || 'tank';

  if (matType === 'tank') {
    renderTankTable(data);
  } else {
    renderCoreTable(data);
  }
}

// ── TANK TABLE (Pivot) ──────────────────────────────────────────────
function renderTankTable(data) {
  // Gather active filters
  const sources = [...document.querySelectorAll('input[name="matSource"]:checked')].map(e => e.value);
  const programs = [...document.querySelectorAll('input[name="matProgram"]:checked')].map(e => e.value);
  const steels  = [...document.querySelectorAll('input[name="matSteel"]:checked')].map(e => e.value);

  document.getElementById('mat-table-title').textContent = 'Tank Material Costs';
  document.getElementById('mat-table-desc').textContent  = 'Cost per pound ($/lb) by supplier — columns show cost per program';

  // Filter rows
  let rows = data.tanksMaterialCost.filter(r => {
    const srcOk   = sources.length  === 0 || sources.includes(r.source);
    const steelOk = steels.length   === 0 || steels.includes(r.steelOrigin);
    return srcOk && steelOk;
  });

  // Active programs
  const activePrograms = programs.length > 0 ? programs : ['E2X', 'P1', 'MPU'];

  // Build pivot: key = supplier|description|location|source|steelOrigin
  const pivotMap = {};
  rows.forEach(r => {
    const prog = r.program;
    if (!activePrograms.includes(prog)) return;
    const key = `${r.supplier}||${r.description}||${r.location}||${r.source}||${r.steelOrigin}`;
    if (!pivotMap[key]) {
      pivotMap[key] = {
        supplier: r.supplier,
        description: r.description,
        location: r.location,
        source: r.source,
        steelOrigin: r.steelOrigin,
        costs: {}
      };
    }
    pivotMap[key].costs[prog] = r.cost;
  });

  const pivotRows = Object.values(pivotMap);

  // Update count
  document.getElementById('mat-result-count').textContent = `${pivotRows.length} rows`;

  // Compute price range for coloring
  const allPrices = pivotRows.flatMap(r => activePrograms.map(p => r.costs[p]).filter(v => typeof v === 'number'));
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  // Build table
  const head = document.getElementById('material-table-head');
  const body = document.getElementById('material-table-body');

  head.innerHTML = `<tr>
    <th>Supplier</th>
    <th>Description</th>
    <th>State / Country</th>
    <th>Source</th>
    <th>Steel Origin</th>
    ${activePrograms.map(p => `<th class="num">${p}</th>`).join('')}
  </tr>`;

  if (pivotRows.length === 0) {
    body.innerHTML = `<tr><td colspan="${5 + activePrograms.length}" style="text-align:center;padding:40px;color:var(--text-muted);">No data matches the selected filters</td></tr>`;
    return;
  }

  // Sort: source desc (Domestic first), then supplier
  pivotRows.sort((a, b) => {
    if (a.source !== b.source) return a.source === 'Domestic' ? -1 : 1;
    if (a.supplier !== b.supplier) return a.supplier.localeCompare(b.supplier);
    return a.description.localeCompare(b.description);
  });

  body.innerHTML = pivotRows.map(row => {
    const srcClass  = row.source === 'Domestic' ? 'domestic' : 'overseas';
    const steelHtml = row.steelOrigin === 'US'
      ? '<span class="badge-origin-us">🇺🇸 US</span>'
      : '<span class="badge-origin-nonus">Non-US</span>';

    const priceCells = activePrograms.map(p => {
      const cost = row.costs[p];
      if (cost == null) return `<td class="num"><span class="cell-na">—</span></td>`;
      if (typeof cost !== 'number') return `<td class="num"><span class="cell-quote">Quote</span></td>`;
      // Color: low=teal, high=red, mid=amber
      const norm = maxPrice === minPrice ? 0.5 : (cost - minPrice) / (maxPrice - minPrice);
      const cls = norm < 0.33 ? 'low' : norm > 0.67 ? 'high' : 'mid';
      return `<td class="num"><span class="cell-price ${cls}">${fmt.num(cost, 2)}</span></td>`;
    }).join('');

    return `<tr>
      <td><strong>${row.supplier}</strong></td>
      <td>${row.description}</td>
      <td>${row.location}</td>
      <td><span class="badge-source ${srcClass}">${row.source}</span></td>
      <td>${steelHtml}</td>
      ${priceCells}
    </tr>`;
  }).join('');
}

// ── CORE TABLE (raw from Core Material Cost) ───────────────────────
function renderCoreTable(data) {
  document.getElementById('mat-table-title').textContent = 'Core Steel Material Costs';
  document.getElementById('mat-table-desc').textContent  = 'Electrical steel cost per pound by grade and supplier';

  const supplierFilter = document.getElementById('core-supplier-filter').value;
  const gradeFilter    = document.getElementById('core-grade-filter').value;
  const steels = [...document.querySelectorAll('input[name="coreSteel"]:checked')].map(e => e.value);

  let rows = data.coreMaterialCost.filter(r => {
    const supOk   = !supplierFilter || r.supplier === supplierFilter;
    const gradeOk = !gradeFilter    || r.grade    === gradeFilter;
    const steelOk = steels.length === 0 || steels.includes(r.steelOrigin);
    return supOk && gradeOk && steelOk;
  });

  document.getElementById('mat-result-count').textContent = `${rows.length} rows`;

  const head = document.getElementById('material-table-head');
  const body = document.getElementById('material-table-body');

  head.innerHTML = `<tr>
    <th>Supplier</th>
    <th>Type</th>
    <th>Steel Origin</th>
    <th>Grade</th>
    <th class="num">Price/LB Mitter</th>
    <th class="num">Cutting Cost</th>
    <th class="num">Freight</th>
    <th class="num">Total Mitter</th>
    <th class="num">Price/LB Slit</th>
    <th class="num">Cut In-House</th>
    <th class="num">Outplant Cost</th>
    <th class="num">Total In-House</th>
    <th class="num">Total Outplant</th>
  </tr>`;

  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="13" style="text-align:center;padding:40px;color:var(--text-muted);">No data matches the selected filters</td></tr>`;
    return;
  }

  function cell(v, highlight = false) {
    if (v == null) return `<td class="num"><span class="cell-na">N/A</span></td>`;
    if (typeof v === 'string') return `<td class="num"><span class="cell-na">${v}</span></td>`;
    const cls = highlight ? 'cell-price' : '';
    return `<td class="num"><span class="${cls}">${fmt.num(v, 4)}</span></td>`;
  }

  body.innerHTML = rows.map(r => {
    const steelHtml = r.steelOrigin === 'US'
      ? '<span class="badge-origin-us">🇺🇸 US</span>'
      : '<span class="badge-origin-nonus">Non-US</span>';
    return `<tr>
      <td><strong>${r.supplier}</strong></td>
      <td>${r.type}</td>
      <td>${steelHtml}</td>
      <td><code style="font-size:0.78rem;color:var(--amber)">${r.grade}</code></td>
      ${cell(r.priceMitter)}
      ${cell(r.cuttingCostSupplier)}
      ${cell(r.freightCost)}
      ${cell(r.totalCostMitter, true)}
      ${cell(r.priceSlit)}
      ${cell(r.costCutInHouse)}
      ${cell(r.outplantCost)}
      ${cell(r.totalCostSlitInHouse, true)}
      ${cell(r.totalCostSlitOutplant, true)}
    </tr>`;
  }).join('');
}
