/**
 * Geometry SVG Renderer
 * Generates accurate SVG geometric diagrams for each quadrilateral type
 */

const GeometryDraw = (function() {
  const THEME = {
    stroke: "#4f46e5",
    strokeWidth: 2.5,
    fill: "rgba(79, 70, 229, 0.08)",
    pointFill: "#ffffff",
    pointStroke: "#4f46e5",
    pointRadius: 4,
    accentStroke: "#0ea5e9",
    rightAngleStroke: "#ef4444",
    dashStroke: "#94a3b8",
    textColor: "#334155"
  };

  function getSVGWrapper(content) {
    return `<svg viewBox="0 0 240 150" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="${THEME.accentStroke}" />
        </marker>
      </defs>
      ${content}
    </svg>`;
  }

  function renderVertices(pts, labels = ["A", "B", "C", "D"]) {
    return pts.map((p, i) => `
      <circle cx="${p.x}" cy="${p.y}" r="${THEME.pointRadius}" fill="${THEME.pointFill}" stroke="${THEME.pointStroke}" stroke-width="2" />
      <text x="${p.tx || p.x}" y="${p.ty || p.y}" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" fill="${THEME.textColor}" text-anchor="middle" dominant-baseline="central">${labels[i]}</text>
    `).join("");
  }

  function renderPolygon(pts, customFill) {
    const d = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ") + " Z";
    return `<path d="${d}" fill="${customFill || THEME.fill}" stroke="${THEME.stroke}" stroke-width="${THEME.strokeWidth}" stroke-linejoin="round" />`;
  }

  function renderRightAngle(x, y, size, dirX, dirY) {
    const x1 = x + dirX * size;
    const y1 = y;
    const x2 = x + dirX * size;
    const y2 = y + dirY * size;
    const x3 = x;
    const y3 = y + dirY * size;
    return `<path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}" fill="none" stroke="${THEME.rightAngleStroke}" stroke-width="1.8" />`;
  }

  const shapes = {
    // 1. Tứ giác bất kỳ
    tu_giac: function(w = 240, h = 150) {
      const pts = [
        { x: 45, y: 35, tx: 35, ty: 25 },
        { x: 195, y: 30, tx: 205, ty: 22 },
        { x: 215, y: 120, tx: 225, ty: 130 },
        { x: 30, y: 115, tx: 20, ty: 125 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        ${renderVertices(pts)}
      `, w, h);
    },

    // 2. Hình thang
    thang: function(w = 240, h = 150) {
      const pts = [
        { x: 75, y: 35, tx: 70, ty: 22 },
        { x: 165, y: 35, tx: 170, ty: 22 },
        { x: 210, y: 120, tx: 220, ty: 130 },
        { x: 30, y: 120, tx: 20, ty: 130 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        <!-- Mũi tên song song 2 đáy -->
        <line x1="110" y1="35" x2="135" y2="35" stroke="${THEME.accentStroke}" stroke-width="2" marker-end="url(#arrow)" />
        <line x1="105" y1="120" x2="140" y2="120" stroke="${THEME.accentStroke}" stroke-width="2" marker-end="url(#arrow)" />
        ${renderVertices(pts)}
      `, w, h);
    },

    // 3. Hình thang cân
    thang_can: function(w = 240, h = 150) {
      const pts = [
        { x: 70, y: 35, tx: 65, ty: 22 },
        { x: 170, y: 35, tx: 175, ty: 22 },
        { x: 210, y: 120, tx: 220, ty: 130 },
        { x: 30, y: 120, tx: 20, ty: 130 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        <!-- Cung góc đáy bằng nhau -->
        <path d="M 45 120 A 15 15 0 0 0 38 107" fill="none" stroke="#f59e0b" stroke-width="2" />
        <path d="M 195 120 A 15 15 0 0 1 202 107" fill="none" stroke="#f59e0b" stroke-width="2" />
        <!-- Gạch bằng nhau trên 2 cạnh bên -->
        <line x1="46" y1="75" x2="54" y2="80" stroke="#f59e0b" stroke-width="2" />
        <line x1="186" y1="80" x2="194" y2="75" stroke="#f59e0b" stroke-width="2" />
        ${renderVertices(pts)}
      `, w, h);
    },

    // 4. Hình thang vuông
    thang_vuong: function(w = 240, h = 150) {
      const pts = [
        { x: 45, y: 35, tx: 35, ty: 25 },
        { x: 165, y: 35, tx: 175, ty: 25 },
        { x: 210, y: 120, tx: 220, ty: 130 },
        { x: 45, y: 120, tx: 35, ty: 130 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        ${renderRightAngle(45, 35, 12, 1, 1)}
        ${renderRightAngle(45, 120, 12, 1, -1)}
        ${renderVertices(pts)}
      `, w, h);
    },

    // 5. Hình bình hành
    binh_hanh: function(w = 240, h = 150) {
      const pts = [
        { x: 75, y: 35, tx: 70, ty: 22 },
        { x: 210, y: 35, tx: 220, ty: 25 },
        { x: 165, y: 120, tx: 170, ty: 132 },
        { x: 30, y: 120, tx: 20, ty: 130 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        <!-- Đường chéo nét đứt cắt nhau tại trung điểm -->
        <line x1="75" y1="35" x2="165" y2="120" stroke="${THEME.dashStroke}" stroke-width="1.5" stroke-dasharray="3 3" />
        <line x1="210" y1="35" x2="30" y2="120" stroke="${THEME.dashStroke}" stroke-width="1.5" stroke-dasharray="3 3" />
        <circle cx="120" cy="77.5" r="3" fill="#ef4444" />
        <text x="120" y="65" font-size="10" font-weight="700" fill="#ef4444" text-anchor="middle">O</text>
        ${renderVertices(pts)}
      `, w, h);
    },

    // 6. Hình chữ nhật
    chu_nhat: function(w = 240, h = 150) {
      const pts = [
        { x: 35, y: 35, tx: 25, ty: 25 },
        { x: 205, y: 35, tx: 215, ty: 25 },
        { x: 205, y: 120, tx: 215, ty: 130 },
        { x: 35, y: 120, tx: 25, ty: 130 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        ${renderRightAngle(35, 35, 12, 1, 1)}
        ${renderRightAngle(205, 35, 12, -1, 1)}
        ${renderRightAngle(205, 120, 12, -1, -1)}
        ${renderRightAngle(35, 120, 12, 1, -1)}
        <!-- Hai đường chéo bằng nhau -->
        <line x1="35" y1="35" x2="205" y2="120" stroke="${THEME.dashStroke}" stroke-width="1.2" stroke-dasharray="3 3" />
        <line x1="205" y1="35" x2="35" y2="120" stroke="${THEME.dashStroke}" stroke-width="1.2" stroke-dasharray="3 3" />
        ${renderVertices(pts)}
      `, w, h);
    },

    // 7. Hình thoi
    thoi: function(w = 240, h = 150) {
      const pts = [
        { x: 120, y: 20, tx: 120, ty: 8 },
        { x: 210, y: 75, tx: 222, ty: 75 },
        { x: 120, y: 130, tx: 120, ty: 142 },
        { x: 30, y: 75, tx: 18, ty: 75 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        <!-- Hai đường chéo vuông góc -->
        <line x1="120" y1="20" x2="120" y2="130" stroke="#8b5cf6" stroke-width="1.8" />
        <line x1="30" y1="75" x2="210" y2="75" stroke="#8b5cf6" stroke-width="1.8" />
        ${renderRightAngle(120, 75, 10, 1, -1)}
        ${renderVertices(pts)}
      `, w, h);
    },

    // 8. Hình vuông
    vuong: function(w = 240, h = 150) {
      const pts = [
        { x: 70, y: 25, tx: 60, ty: 16 },
        { x: 170, y: 25, tx: 180, ty: 16 },
        { x: 170, y: 125, tx: 180, ty: 135 },
        { x: 70, y: 125, tx: 60, ty: 135 }
      ];
      return getSVGWrapper(`
        ${renderPolygon(pts)}
        ${renderRightAngle(70, 25, 12, 1, 1)}
        ${renderRightAngle(170, 25, 12, -1, 1)}
        ${renderRightAngle(170, 125, 12, -1, -1)}
        ${renderRightAngle(70, 125, 12, 1, -1)}
        <!-- Hai đường chéo vuông góc và bằng nhau -->
        <line x1="70" y1="25" x2="170" y2="125" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
        <line x1="170" y1="25" x2="70" y2="125" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
        ${renderRightAngle(120, 75, 9, 1, -1)}
        ${renderVertices(pts)}
      `, w, h);
    },

    // 9. Tứ giác nội tiếp
    noi_tiep: function(w = 240, h = 150) {
      const cx = 120, cy = 75, r = 55;
      const pts = [
        { x: cx + r * Math.cos(-1.1), y: cy + r * Math.sin(-1.1), tx: cx + (r+12) * Math.cos(-1.1), ty: cy + (r+12) * Math.sin(-1.1) },
        { x: cx + r * Math.cos(-0.1), y: cy + r * Math.sin(-0.1), tx: cx + (r+12) * Math.cos(-0.1), ty: cy + (r+12) * Math.sin(-0.1) },
        { x: cx + r * Math.cos(1.2),  y: cy + r * Math.sin(1.2),  tx: cx + (r+12) * Math.cos(1.2),  ty: cy + (r+12) * Math.sin(1.2) },
        { x: cx + r * Math.cos(2.8),  y: cy + r * Math.sin(2.8),  tx: cx + (r+12) * Math.cos(2.8),  ty: cy + (r+12) * Math.sin(2.8) }
      ];
      return getSVGWrapper(`
        <!-- Đường tròn ngoại tiếp -->
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0ea5e9" stroke-width="1.8" stroke-dasharray="4 3" />
        <circle cx="${cx}" cy="${cy}" r="3" fill="#0ea5e9" />
        <text x="${cx}" y="${cy - 8}" font-size="10" font-weight="700" fill="#0ea5e9" text-anchor="middle">O</text>
        ${renderPolygon(pts, "rgba(14, 165, 233, 0.08)")}
        ${renderVertices(pts)}
      `, w, h);
    }
  };

  return {
    draw: function(shapeId, width = 240, height = 150) {
      if (shapes[shapeId]) {
        return shapes[shapeId](width, height);
      }
      return shapes.tu_giac(width, height);
    }
  };
})();
