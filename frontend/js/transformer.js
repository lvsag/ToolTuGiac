/**
 * Shape Transformer / Condition Pathway Finder
 * Finds how to transform shape A into shape B step-by-step
 */

const ShapeTransformer = (function() {
  let shapesList = [];
  let dauHieuList = [];

  const ALL_DAU_HIEU = [
    { tu: "tu_giac", den: "thang", nd: "có một cặp cạnh đối song song", lop: 8 },
    { tu: "thang", den: "thang_can", nd: "có hai góc kề một đáy bằng nhau", lop: 8 },
    { tu: "thang", den: "thang_can", nd: "có hai đường chéo bằng nhau", lop: 8 },
    { tu: "thang", den: "thang_vuong", nd: "có một góc vuông", lop: 8 },
    { tu: "tu_giac", den: "binh_hanh", nd: "có các cạnh đối song song", lop: 8 },
    { tu: "tu_giac", den: "binh_hanh", nd: "có các cạnh đối bằng nhau", lop: 8 },
    { tu: "tu_giac", den: "binh_hanh", nd: "có một cặp cạnh đối vừa song song vừa bằng nhau", lop: 8 },
    { tu: "tu_giac", den: "binh_hanh", nd: "có các góc đối bằng nhau", lop: 8 },
    { tu: "tu_giac", den: "binh_hanh", nd: "có hai đường chéo cắt nhau tại trung điểm mỗi đường", lop: 8 },
    { tu: "tu_giac", den: "chu_nhat", nd: "có ba góc vuông", lop: 8 },
    { tu: "thang_can", den: "chu_nhat", nd: "có một góc vuông", lop: 8 },
    { tu: "binh_hanh", den: "chu_nhat", nd: "có một góc vuông", lop: 8 },
    { tu: "binh_hanh", den: "chu_nhat", nd: "có hai đường chéo bằng nhau", lop: 8 },
    { tu: "tu_giac", den: "thoi", nd: "có bốn cạnh bằng nhau", lop: 8 },
    { tu: "binh_hanh", den: "thoi", nd: "có hai cạnh kề bằng nhau", lop: 8 },
    { tu: "binh_hanh", den: "thoi", nd: "có hai đường chéo vuông góc", lop: 8 },
    { tu: "binh_hanh", den: "thoi", nd: "có một đường chéo là phân giác của một góc", lop: 8 },
    { tu: "chu_nhat", den: "vuong", nd: "có hai cạnh kề bằng nhau", lop: 8 },
    { tu: "chu_nhat", den: "vuong", nd: "có hai đường chéo vuông góc", lop: 8 },
    { tu: "chu_nhat", den: "vuong", nd: "có một đường chéo là phân giác của một góc", lop: 8 },
    { tu: "thoi", den: "vuong", nd: "có một góc vuông", lop: 8 },
    { tu: "thoi", den: "vuong", nd: "có hai đường chéo bằng nhau", lop: 8 },
    { tu: "tu_giac", den: "noi_tiep", nd: "có tổng hai góc đối bằng 180°", lop: 9 },
    { tu: "tu_giac", den: "noi_tiep", nd: "có góc ngoài bằng góc trong của đỉnh đối diện", lop: 9 }
  ];

  function render(containerId, shapes) {
    const container = document.getElementById(containerId);
    if (!container) return;

    shapesList = shapes || [];

    const defaultFrom = shapesList[0]?.id || "tu_giac";
    const defaultTo = shapesList.find(s => s.id === "vuong")?.id || shapesList[shapesList.length - 1]?.id || "vuong";

    container.innerHTML = `
      <div class="transformer-box">
        <div style="text-align:center; max-width:600px; margin: 0 auto 28px;">
          <h2 style="font-size:22px; font-weight:800; color:var(--text-main); margin-bottom:8px;">
            🔄 Khám phá điều kiện chuyển đổi giữa các hình
          </h2>
          <p style="font-size:14px; color:var(--text-muted);">
            Chọn hình bắt đầu và hình muốn chứng minh để xem toàn bộ các con đường và dấu hiệu cần thiết.
          </p>
        </div>

        <div class="morph-selectors">
          <div class="morph-select-group">
            <label>Hình xuất phát (Giả thiết):</label>
            <select id="trans-from" onchange="ShapeTransformer.findPath()">
              ${shapesList.map(s => `<option value="${s.id}" ${s.id === defaultFrom ? 'selected' : ''}>${s.ten}</option>`).join('')}
            </select>
          </div>

          <div class="morph-arrow">➔</div>

          <div class="morph-select-group">
            <label>Hình đích (Kết luận):</label>
            <select id="trans-to" onchange="ShapeTransformer.findPath()">
              ${shapesList.map(s => `<option value="${s.id}" ${s.id === defaultTo ? 'selected' : ''}>${s.ten}</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="trans-results"></div>
      </div>
    `;

    findPath();
  }

  function findPath() {
    const fromId = document.getElementById('trans-from')?.value;
    const toId = document.getElementById('trans-to')?.value;
    const resultEl = document.getElementById('trans-results');
    if (!resultEl) return;

    if (fromId === toId) {
      resultEl.innerHTML = `
        <div class="feature-item" style="justify-content:center; padding:20px; color:var(--text-muted);">
          Hai hình xuất phát và đích giống nhau. Hãy chọn hình đích khác để tìm con đường chuyển đổi!
        </div>
      `;
      return;
    }

    const tenMap = Object.fromEntries(shapesList.map(s => [s.id, s.ten]));
    const grade = parseInt(localStorage.getItem('lop') || '8', 10);
    const validDauHieu = ALL_DAU_HIEU.filter(d => d.lop <= grade);

    // BFS to find all direct paths
    const queue = [[{ current: fromId, edge: null, parent: null }]];
    const allPaths = [];

    while (queue.length > 0) {
      const path = queue.shift();
      const last = path[path.length - 1].current;

      if (last === toId) {
        allPaths.push(path);
        if (allPaths.length >= 4) break; // Keep top 4 alternative paths
        continue;
      }

      if (path.length > 5) continue; // max depth

      const nextEdges = validDauHieu.filter(d => d.tu === last);
      for (const edge of nextEdges) {
        const alreadyVisited = path.some(p => p.current === edge.den);
        if (!alreadyVisited) {
          queue.push([...path, { current: edge.den, edge: edge, parent: last }]);
        }
      }
    }

    if (!allPaths.length) {
      resultEl.innerHTML = `
        <div class="feature-item" style="padding:24px; text-align:center; flex-direction:column; gap:8px;">
          <div style="font-size:28px;">🔍</div>
          <b>Không có con đường trực tiếp từ "${tenMap[fromId]}" tới "${tenMap[toId]}" theo phân loại hình học.</b>
          <small style="color:var(--text-subtle);">Thường do hình đích có tính chất tổng quát hơn hoặc khác nhánh phả hệ.</small>
        </div>
      `;
      return;
    }

    let html = `
      <div style="margin-top:20px;">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:16px; color:var(--text-main);">
          ✨ Tìm thấy ${allPaths.length} phương pháp / con đường chuyển đổi:
        </h3>
        <div style="display:flex; flex-direction:column; gap:20px;">
    `;

    allPaths.forEach((path, pathIdx) => {
      html += `
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:18px; box-shadow:var(--shadow-sm);">
          <div style="font-weight:700; font-size:14px; color:var(--primary); margin-bottom:12px;">
            Phương án ${pathIdx + 1}: ${path.map(p => tenMap[p.current] || p.current).join(' ➔ ')}
          </div>
          <div class="morph-path-container">
      `;

      for (let i = 1; i < path.length; i++) {
        const step = path[i];
        const fromTen = tenMap[path[i-1].current] || path[i-1].current;
        const toTen = tenMap[step.current] || step.current;
        html += `
          <div class="morph-step-card">
            <div class="step-num">${i}</div>
            <div>
              <div style="font-size:13px; font-weight:700; color:var(--text-main);">
                Từ <span style="color:var(--primary);">${fromTen}</span> ➔ Để trở thành <span style="color:var(--secondary);">${toTen}</span>:
              </div>
              <div style="font-size:14px; color:var(--text-muted); margin-top:4px;">
                👉 Cần chứng minh: <b>${step.edge.nd}</b>
              </div>
            </div>
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    resultEl.innerHTML = html;
  }

  return {
    render,
    findPath
  };
})();
