/**
 * Interactive Geometry Calculator
 * Computes perimeter, area, and diagonals with live visual feedback and step-by-step math
 */

const GeometryCalculator = (function() {
  const SHAPE_CONFIGS = {
    vuong: {
      name: "Hình vuông",
      inputs: [{ id: "a", label: "Cạnh a (cm)", default: 6, min: 0.1 }],
      calc: (vals) => {
        const a = vals.a;
        return [
          { name: "Chu vi (P)", formula: "P = 4 · a", step: `4 · ${a}`, value: (4 * a).toFixed(2), unit: "cm" },
          { name: "Diện tích (S)", formula: "S = a²", step: `${a}²`, value: (a * a).toFixed(2), unit: "cm²" },
          { name: "Đường chéo (d)", formula: "d = a√2", step: `${a} · 1.4142`, value: (a * Math.SQRT2).toFixed(2), unit: "cm" }
        ];
      }
    },
    chu_nhat: {
      name: "Hình chữ nhật",
      inputs: [
        { id: "a", label: "Chiều dài a (cm)", default: 8, min: 0.1 },
        { id: "b", label: "Chiều rộng b (cm)", default: 5, min: 0.1 }
      ],
      calc: (vals) => {
        const { a, b } = vals;
        return [
          { name: "Chu vi (P)", formula: "P = 2 · (a + b)", step: `2 · (${a} + ${b})`, value: (2 * (a + b)).toFixed(2), unit: "cm" },
          { name: "Diện tích (S)", formula: "S = a · b", step: `${a} · ${b}`, value: (a * b).toFixed(2), unit: "cm²" },
          { name: "Đường chéo (d)", formula: "d = √(a² + b²)", step: `√(${a}² + ${b}²)`, value: Math.sqrt(a*a + b*b).toFixed(2), unit: "cm" }
        ];
      }
    },
    thoi: {
      name: "Hình thoi",
      inputs: [
        { id: "a", label: "Cạnh a (cm)", default: 5, min: 0.1 },
        { id: "d1", label: "Đường chéo d₁ (cm)", default: 8, min: 0.1 },
        { id: "d2", label: "Đường chéo d₂ (cm)", default: 6, min: 0.1 }
      ],
      calc: (vals) => {
        const { a, d1, d2 } = vals;
        return [
          { name: "Chu vi (P)", formula: "P = 4 · a", step: `4 · ${a}`, value: (4 * a).toFixed(2), unit: "cm" },
          { name: "Diện tích (S)", formula: "S = (d₁ · d₂) / 2", step: `(${d1} · ${d2}) / 2`, value: ((d1 * d2) / 2).toFixed(2), unit: "cm²" }
        ];
      }
    },
    binh_hanh: {
      name: "Hình bình hành",
      inputs: [
        { id: "a", label: "Cạnh đáy a (cm)", default: 7, min: 0.1 },
        { id: "b", label: "Cạnh bên b (cm)", default: 5, min: 0.1 },
        { id: "h", label: "Chiều cao h (cm)", default: 4, min: 0.1 }
      ],
      calc: (vals) => {
        const { a, b, h } = vals;
        return [
          { name: "Chu vi (P)", formula: "P = 2 · (a + b)", step: `2 · (${a} + ${b})`, value: (2 * (a + b)).toFixed(2), unit: "cm" },
          { name: "Diện tích (S)", formula: "S = a · h", step: `${a} · ${h}`, value: (a * h).toFixed(2), unit: "cm²" }
        ];
      }
    },
    thang: {
      name: "Hình thang / Hình thang cân / Hình thang vuông",
      inputs: [
        { id: "a", label: "Đáy lớn a (cm)", default: 8, min: 0.1 },
        { id: "b", label: "Đáy nhỏ b (cm)", default: 4, min: 0.1 },
        { id: "h", label: "Chiều cao h (cm)", default: 5, min: 0.1 },
        { id: "c1", label: "Cạnh bên 1 (cm)", default: 5, min: 0.1 },
        { id: "c2", label: "Cạnh bên 2 (cm)", default: 5, min: 0.1 }
      ],
      calc: (vals) => {
        const { a, b, h, c1, c2 } = vals;
        return [
          { name: "Chu vi (P)", formula: "P = a + b + c₁ + c₂", step: `${a} + ${b} + ${c1} + ${c2}`, value: (a + b + c1 + c2).toFixed(2), unit: "cm" },
          { name: "Diện tích (S)", formula: "S = (a + b) · h / 2", step: `(${a} + ${b}) · ${h} / 2`, value: (((a + b) * h) / 2).toFixed(2), unit: "cm²" }
        ];
      }
    }
  };

  let selectedShape = "vuong";

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="calc-module-grid">
        <div class="calc-selector-pane">
          <h3 style="font-size:16px; font-weight:700; color:var(--text-main);">📐 Chọn hình tính toán</h3>
          <div class="shape-calc-btn-list">
            ${Object.entries(SHAPE_CONFIGS).map(([key, cfg]) => `
              <button class="shape-calc-btn ${selectedShape === key ? 'active' : ''}" 
                      onclick="GeometryCalculator.selectShape('${key}')">
                <span>${cfg.name}</span>
                <span>→</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="calc-workbench" id="calc-workbench-inner">
          <!-- Dynamic Form Content -->
        </div>
      </div>
    `;

    container.innerHTML = html;
    updateWorkbench();
  }

  function selectShape(key) {
    selectedShape = key;
    document.querySelectorAll('.shape-calc-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(SHAPE_CONFIGS[key].name));
    });
    updateWorkbench();
  }

  function updateWorkbench() {
    const workbench = document.getElementById('calc-workbench-inner');
    if (!workbench) return;

    const cfg = SHAPE_CONFIGS[selectedShape];
    if (!cfg) return;

    workbench.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:20px; background:var(--bg-subtle); border-radius:var(--radius-lg); padding:20px; border:1px solid var(--border-color);">
        <div style="flex: 1; min-width: 240px;">
          <div style="display:inline-block; font-size:11px; font-weight:700; text-transform:uppercase; color:var(--primary); background:var(--primary-light); padding:3px 10px; border-radius:var(--radius-full); margin-bottom:8px;">
            Mô hình hình học
          </div>
          <h2 style="font-size:24px; font-weight:800; color:var(--text-main); margin-bottom:6px;">${cfg.name}</h2>
          <p style="font-size:13.5px; color:var(--text-muted); line-height:1.5;">Nhập các thông số kích thước để tự động tính Chu vi, Diện tích và Đường chéo với các bước thế số chi tiết.</p>
        </div>
        <div style="width:220px; height:140px; background:var(--bg-card); border-radius:var(--radius-md); padding:8px; border:1px solid var(--border-color); box-shadow:var(--shadow-sm); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          ${GeometryDraw.draw(selectedShape === 'thang' ? 'thang_can' : selectedShape, 220, 140)}
        </div>
      </div>

      <div class="calc-form-grid">
        ${cfg.inputs.map(inp => `
          <div class="calc-input-group">
            <label for="inp-${inp.id}">${inp.label}</label>
            <input type="number" id="inp-${inp.id}" value="${inp.default}" min="${inp.min}" step="0.5" 
                   oninput="GeometryCalculator.compute()">
          </div>
        `).join('')}
      </div>

      <div class="calc-results-panel">
        <h4 style="font-size:14px; font-weight:700; color:var(--text-main); margin-bottom:14px; text-transform:uppercase; letter-spacing:0.04em;">
          📊 Kết quả tính toán & Các bước giải:
        </h4>
        <div id="calc-output-rows"></div>
      </div>
    `;

    compute();
  }

  function compute() {
    const cfg = SHAPE_CONFIGS[selectedShape];
    if (!cfg) return;

    const vals = {};
    cfg.inputs.forEach(inp => {
      const el = document.getElementById(`inp-${inp.id}`);
      vals[inp.id] = el ? parseFloat(el.value) || 0 : inp.default;
    });

    const results = cfg.calc(vals);
    const outputEl = document.getElementById('calc-output-rows');
    if (!outputEl) return;

    outputEl.innerHTML = results.map(res => `
      <div class="calc-result-row">
        <div>
          <div style="font-weight:700; font-size:14px; color:var(--text-main);">${res.name}</div>
          <div style="font-size:12px; color:var(--text-subtle); font-family:var(--font-mono); margin-top:2px;">
            ${res.formula} = ${res.step}
          </div>
        </div>
        <div class="calc-result-val">${res.value} <span style="font-size:13px; font-weight:500; color:var(--text-muted);">${res.unit}</span></div>
      </div>
    `).join('');
  }

  return {
    render,
    selectShape,
    compute
  };
})();
