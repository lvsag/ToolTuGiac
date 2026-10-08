/**
 * Interactive Concept Hierarchy Graph Visualizer
 * Renders quadrilateral inheritance tree with SVG connectors and node highlights
 */

const GraphView = (function() {
  let activeNodeId = null;

  function render(containerId, data, onSelectNode) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { hinh, quan_he } = data;

    if (!quan_he || !quan_he.length) {
      container.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 12px;">📐</div>
          <h3 style="font-size: 18px; margin-bottom: 8px;">Quan hệ bao hàm bắt đầu từ Lớp 8</h3>
          <p style="font-size: 14px; max-width: 480px; margin: 0 auto;">
            Ở chương trình Lớp 6–7, học sinh học nhận biết các hình rời rạc. Vui lòng chọn <b>Lớp 8 trở lên</b> trên thanh tiêu đề để khám phá sơ đồ phả hệ quan hệ giữa các hình!
          </p>
        </div>
      `;
      return;
    }

    const tenMap = Object.fromEntries(hinh.map(h => [h.id, h.ten]));

    // Compute parent & child relationships
    const getParents = id => quan_he.filter(e => e.con === id).map(e => e.cha);
    const getChildren = id => quan_he.filter(e => e.cha === id).map(e => e.con);

    // Compute topological depth for each shape
    const depthCache = {};
    function getDepth(id, visited = new Set()) {
      if (id in depthCache) return depthCache[id];
      if (visited.has(id)) return 0;
      visited.add(id);
      const parents = getParents(id);
      if (!parents.length) return (depthCache[id] = 0);
      const d = 1 + Math.max(...parents.map(p => getDepth(p, new Set(visited))));
      return (depthCache[id] = d);
    }

    const layers = {};
    hinh.forEach(h => {
      const d = getDepth(h.id);
      if (!layers[d]) layers[d] = [];
      layers[d].push(h);
    });

    const sortedDepths = Object.keys(layers).sort((a, b) => Number(a) - Number(b));

    let html = `
      <div class="graph-toolbar">
        <div class="graph-legend">
          <div class="legend-item"><span class="legend-dot" style="background:var(--primary)"></span> Nút hình học</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--secondary)"></span> Mối quan hệ kế thừa (Cha → Con)</div>
        </div>
        <div style="font-size:12px; color:var(--text-subtle);">
          💡 <i>Nhấp vào một hình để làm nổi bật nhánh gia phả và xem chi tiết</i>
        </div>
      </div>
      <div class="canvas-viewport" id="graph-viewport">
        <svg id="graph-connections" class="graph-edge-svg"></svg>
        <div id="tree-nodes-container" style="width:100%; position:relative; z-index:2;">
    `;

    sortedDepths.forEach(d => {
      html += `<div class="graph-tree-level" data-depth="${d}">`;
      layers[d].forEach(h => {
        html += `
          <div class="graph-node ${activeNodeId === h.id ? 'active' : ''}" 
               id="node-${h.id}" 
               data-id="${h.id}" 
               onclick="GraphView.handleNodeClick('${h.id}')">
            <div style="width: 50px; height: 35px; margin-bottom: 6px;">
              ${GeometryDraw.draw(h.id, 50, 35)}
            </div>
            <div class="graph-node-title">${h.ten}</div>
            <div class="graph-node-subtitle">${h.vai_tro === 'chinh_thuc' ? 'Lớp này' : 'Ôn tập'}</div>
          </div>
        `;
      });
      html += `</div>`;
    });

    html += `
        </div>
      </div>
      <div style="margin-top: 24px;">
        <h4 style="font-size: 15px; margin-bottom: 12px; color: var(--text-main);">📋 Bảng quan hệ chi tiết:</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px;">
          ${quan_he.map(rel => `
            <div class="feature-item" style="cursor:pointer;" onclick="GraphView.handleNodeClick('${rel.con}')">
              <span class="feature-icon">↳</span>
              <div>
                <b>${tenMap[rel.con]}</b> là trường hợp đặc biệt của <b>${tenMap[rel.cha]}</b>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Draw connecting bezier curves between nodes
    setTimeout(() => {
      drawCurves(quan_he);
    }, 50);

    window.addEventListener('resize', () => drawCurves(quan_he));
    GraphView._onSelectNode = onSelectNode;
  }

  function drawCurves(quan_he) {
    const svg = document.getElementById('graph-connections');
    const viewport = document.getElementById('graph-viewport');
    if (!svg || !viewport) return;

    const vpRect = viewport.getBoundingClientRect();
    svg.setAttribute('width', viewport.scrollWidth);
    svg.setAttribute('height', viewport.scrollHeight);

    let paths = '';
    quan_he.forEach(rel => {
      const parentEl = document.getElementById(`node-${rel.cha}`);
      const childEl = document.getElementById(`node-${rel.con}`);
      if (!parentEl || !childEl) return;

      const pRect = parentEl.getBoundingClientRect();
      const cRect = childEl.getBoundingClientRect();

      // Parent bottom center to Child top center
      const x1 = pRect.left + pRect.width / 2 - vpRect.left + viewport.scrollLeft;
      const y1 = pRect.bottom - vpRect.top + viewport.scrollTop;
      const x2 = cRect.left + cRect.width / 2 - vpRect.left + viewport.scrollLeft;
      const y2 = cRect.top - vpRect.top + viewport.scrollTop;

      const deltaY = y2 - y1;
      const cy1 = y1 + deltaY * 0.5;
      const cy2 = y2 - deltaY * 0.5;

      const isHighlight = activeNodeId && (rel.cha === activeNodeId || rel.con === activeNodeId);
      const strokeColor = isHighlight ? 'var(--primary)' : 'var(--border-subtle)';
      const strokeWidth = isHighlight ? '3' : '1.8';

      paths += `
        <path d="M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}" 
              fill="none" 
              stroke="${strokeColor}" 
              stroke-width="${strokeWidth}" 
              stroke-linecap="round" />
      `;
    });

    svg.innerHTML = paths;
  }

  function handleNodeClick(id) {
    activeNodeId = (activeNodeId === id ? null : id);
    document.querySelectorAll('.graph-node').forEach(el => {
      el.classList.toggle('active', el.dataset.id === activeNodeId);
    });
    if (GraphView._onSelectNode) {
      GraphView._onSelectNode(id);
    }
  }

  return {
    render,
    handleNodeClick
  };
})();
