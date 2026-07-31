// app.js — Main orchestrator: fetch data, init tabs & modules

(async function () {
  applyChartDefaults();

  // ── Fetch data from server ──
  let data;
  try {
    const res = await fetch('/api/data');
    data = await res.json();
    setAppData(data);
  } catch (e) {
    console.error('Failed to load data:', e);
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:12px;color:#ef4444">
        <div style="font-size:2rem">⚠️</div>
        <strong>Failed to load cost data</strong>
        <span style="color:#94a3b8;font-size:0.85rem">Make sure the server is running: npm start</span>
      </div>`;
    return;
  }

  // ── Tab navigation ──
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === target);
        b.setAttribute('aria-selected', b.dataset.tab === target);
      });
      tabSections.forEach(s => {
        s.classList.toggle('active', s.id === `section-${target}`);
      });
      // Re-render scenarios chart when tab becomes visible
      // (Chart.js can't measure canvas dimensions when section is display:none)
      if (target === 'scenarios') {
        requestAnimationFrame(() => renderScenariosChart(data));
      }
    });
  });

  // ── Initialize each section ──
  initMaterialCost(data);
  initIntegratedCost(data);
  initScenarios(data);

  console.log('✅ Transformer Cost Intelligence loaded successfully');
})();
