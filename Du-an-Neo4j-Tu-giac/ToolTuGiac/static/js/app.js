/**
 * Main Application Controller
 * Coordinates views, state, navigation, and API interactions
 */

const App = (function() {
  let currentGrade = parseInt(localStorage.getItem("lop") || "8", 10);
  let activeTab = "library";
  let shapesCache = [];
  let currentFilter = "all";
  let searchQuery = "";

  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);

  async function init() {
    setupTheme();
    setupGradeSelect();
    setupTabs();
    setupSearchAndFilters();
    checkBackendInfo();

    await loadCurrentTab();
  }

  // --- Theme Controller ---
  function setupTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggleBtn = $("#btn-toggle-theme");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateThemeIcon(next);
      });
    }
  }

  function updateThemeIcon(theme) {
    const icon = $("#theme-icon");
    if (icon) {
      icon.innerHTML = theme === "dark" 
        ? `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
    }
  }

  // --- Grade Selector ---
  function setupGradeSelect() {
    const sel = $("#select-lop");
    if (!sel) return;

    sel.innerHTML = "";
    for (let i = 6; i <= 12; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `Lớp ${i}`;
      if (i === currentGrade) opt.selected = true;
      sel.appendChild(opt);
    }

    sel.addEventListener("change", async (e) => {
      currentGrade = parseInt(e.target.value, 10);
      localStorage.setItem("lop", currentGrade);
      await loadCurrentTab();
    });
  }

  // --- Tab Navigation ---
  function setupTabs() {
    $$(".nav-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tabKey = btn.dataset.tab;
        switchTab(tabKey);
      });
    });
  }

  function switchTab(tabKey) {
    activeTab = tabKey;
    $$(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabKey);
    });

    $$(".view-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === `view-${tabKey}`);
    });

    loadCurrentTab();
  }

  async function loadCurrentTab() {
    if (activeTab === "library") {
      await loadLibrary();
    } else if (activeTab === "graph") {
      await loadGraph();
    } else if (activeTab === "calculator") {
      GeometryCalculator.render("calc-container");
    } else if (activeTab === "quiz") {
      QuizEngine.load("quiz-container", currentGrade);
    } else if (activeTab === "transformer") {
      if (!shapesCache.length) {
        shapesCache = await fetchApi(`/api/hinh?lop=${currentGrade}`);
      }
      ShapeTransformer.render("transformer-container", shapesCache);
    }
  }

  // --- API Client ---
  async function fetchApi(url) {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}_t=${Date.now()}`);
    return await res.json();
  }

  async function checkBackendInfo() {
    try {
      const info = await fetchApi("/api/info");
      const badge = $("#db-status");
      const text = $("#db-status-text");
      if (badge && text) {
        if (info.backend === "neo4j") {
          badge.className = "db-status-badge neo4j";
          text.textContent = "Neo4j Database Connected";
        } else {
          badge.className = "db-status-badge memory";
          text.textContent = "Dữ liệu dự phòng (Bộ nhớ)";
        }
      }
    } catch (e) {
      console.warn("Backend status check failed", e);
    }
  }

  // --- Search & Filters ---
  function setupSearchAndFilters() {
    const searchInp = $("#search-shape");
    if (searchInp) {
      searchInp.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderShapeGrid();
      });
    }

    $$(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        $$(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilter = chip.dataset.filter;
        renderShapeGrid();
      });
    });
  }

  // --- Library View ---
  async function loadLibrary() {
    const container = $("#shape-grid-container");
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 40px 0; color:var(--text-muted);">Đang tải thư viện hình học...</div>`;
    try {
      shapesCache = await fetchApi(`/api/hinh?lop=${currentGrade}`);
      renderShapeGrid();
    } catch (e) {
      container.innerHTML = `<div style="color:var(--danger); text-align:center; padding: 40px 0;">Không thể tải dữ liệu hình học.</div>`;
    }
  }

  function renderShapeGrid() {
    const container = $("#shape-grid-container");
    if (!container) return;

    let filtered = shapesCache.filter(h => {
      const matchSearch = h.ten.toLowerCase().includes(searchQuery) || h.dinh_nghia.toLowerCase().includes(searchQuery);
      const matchFilter = (currentFilter === "all") || (h.vai_tro === currentFilter);
      return matchSearch && matchFilter;
    });

    if (!filtered.length) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 50px 20px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-color);">
          <div style="font-size:36px; margin-bottom:12px;">🔍</div>
          <h3 style="font-size:17px; margin-bottom:6px;">Không tìm thấy hình phù hợp</h3>
          <p style="font-size:13px; color:var(--text-muted);">Hãy thử tìm kiếm với từ khóa khác hoặc chuyển lớp học.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(h => `
      <div class="shape-card" onclick="App.showDetail('${h.id}')">
        <div class="shape-card-preview">
          ${GeometryDraw.draw(h.id, 240, 140)}
        </div>
        <div class="shape-card-header">
          <h3 class="shape-card-title">${h.ten}</h3>
          <span class="badge-role ${h.vai_tro}">
            ${h.vai_tro === "chinh_thuc" ? "Học chính thức" : "Ôn tập"}
          </span>
        </div>
        <p class="shape-card-desc">${h.dinh_nghia}</p>
        <div class="shape-card-footer">
          <span>Nhấp để xem tính chất & công thức</span>
          <span class="btn-card-action">Chi tiết ➔</span>
        </div>
      </div>
    `).join("");
  }

  // --- Detail View ---
  async function showDetail(shapeId) {
    const detailView = $("#view-detail");
    const libraryView = $("#view-library");
    const container = $("#shape-detail-container");

    if (!detailView || !container) return;

    $$(".view-section").forEach(sec => sec.classList.remove("active"));
    detailView.classList.add("active");

    container.innerHTML = `<div style="text-align:center; padding: 50px 0; color:var(--text-muted);">Đang tải chi tiết kiến thức...</div>`;

    try {
      const data = await fetchApi(`/api/hinh/${shapeId}?lop=${currentGrade}`);

      container.innerHTML = `
        <button class="btn-back" onclick="App.backToLibrary()">← Quay lại Thư viện hình</button>

        <div class="detail-grid">
          <div class="detail-main-card">
            <div class="detail-header">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <h2>${data.ten}</h2>
                <span class="badge-role chinh_thuc">Lớp ${currentGrade}</span>
              </div>
              <div class="detail-definition-box">
                <b>Định nghĩa:</b> ${data.dinh_nghia}
              </div>
            </div>

            <!-- Tính chất -->
            <div class="section-block">
              <div class="section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Tính chất đặc trưng (bao gồm kế thừa từ hình cha)</span>
              </div>
              ${data.tinh_chat && data.tinh_chat.length ? `
                <ul class="feature-list">
                  ${data.tinh_chat.map(tc => `
                    <li class="feature-item">
                      <span class="feature-icon">✦</span>
                      <span>${tc}</span>
                    </li>
                  `).join('')}
                </ul>
              ` : '<p style="color:var(--text-subtle); font-size:14px;">Chưa có tính chất riêng ở lớp này.</p>'}
            </div>

            <!-- Dấu hiệu nhận biết -->
            <div class="section-block">
              <div class="section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Dấu hiệu nhận biết</span>
              </div>
              ${data.dau_hieu && data.dau_hieu.length ? `
                <ul class="feature-list">
                  ${data.dau_hieu.map(dh => `
                    <li class="feature-item">
                      <span class="feature-icon">👉</span>
                      <span>Một <b>${dh.tu.toLowerCase()}</b> ${dh.noi_dung}</span>
                    </li>
                  `).join('')}
                </ul>
              ` : '<p style="color:var(--text-subtle); font-size:14px;">Dấu hiệu nhận biết hình này không có trong lớp này.</p>'}
            </div>

            <!-- Công thức tính -->
            <div class="section-block">
              <div class="section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <span>Công thức tính Chu vi, Diện tích & Đường chéo</span>
              </div>
              ${data.cong_thuc && data.cong_thuc.length ? `
                <div class="formula-grid">
                  ${data.cong_thuc.map(ct => `
                    <div class="formula-chip">
                      <span class="formula-name">${ct.ten}</span>
                      <span class="formula-expr">${ct.bieu_thuc}</span>
                    </div>
                  `).join('')}
                </div>
              ` : '<p style="color:var(--text-subtle); font-size:14px;">Chưa có công thức riêng cho lớp này.</p>'}
            </div>

            <!-- Điều kiện nâng cấp -->
            ${data.goi_y && data.goi_y.length ? `
              <div class="section-block">
                <div class="section-title">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  <span>Cần thêm điều kiện gì để thành hình đặc biệt hơn?</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                  ${data.goi_y.map(gy => `
                    <div class="feature-item" style="border-left: 3px solid var(--secondary);">
                      <span>Thêm <b>${gy.dieu_kien}</b> ➔ Sẽ trở thành <b style="color:var(--primary);">${gy.ket_luan}</b></span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Sidebar Visualizer & Family Tree -->
          <div class="detail-sidebar">
            <div class="visualizer-card">
              <h4 style="font-size:15px; font-weight:700; color:var(--text-main);">Hình học trực quan</h4>
              <div class="visualizer-box">
                ${GeometryDraw.draw(shapeId, 280, 180)}
              </div>
              <small style="color:var(--text-subtle);">Mô phỏng hình học chuẩn với góc & đường chéo</small>
            </div>

            <!-- Family Hierarchy -->
            <div class="visualizer-card" style="text-align:left;">
              <h4 style="font-size:15px; font-weight:700; color:var(--text-main); margin-bottom:12px;">🧬 Vị trí trong cây phả hệ</h4>
              <div style="font-size:13.5px; line-height:1.6; color:var(--text-muted);">
                <p style="margin-bottom:8px;">
                  <b>Là trường hợp đặc biệt của:</b><br>
                  ${data.cha && data.cha.length ? data.cha.map(c => `<span class="badge-role chinh_thuc" style="margin:2px 4px 2px 0; display:inline-block;">${c}</span>`).join('') : '<span style="color:var(--text-light)">— (Gốc phả hệ)</span>'}
                </p>
                <p>
                  <b>Có các trường hợp đặc biệt:</b><br>
                  ${data.con && data.con.length ? data.con.map(c => `<span class="badge-role on_tap" style="margin:2px 4px 2px 0; display:inline-block;">${c}</span>`).join('') : '<span style="color:var(--text-light)">— (Nhánh lá)</span>'}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = `<div style="color:var(--danger); text-align:center; padding: 40px 0;">Đã xảy ra lỗi khi tải thông tin hình học.</div>`;
    }
  }

  function backToLibrary() {
    $$(".view-section").forEach(sec => sec.classList.remove("active"));
    $("#view-library").classList.add("active");
  }

  // --- Graph View ---
  async function loadGraph() {
    const container = $("#graph-container-root");
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 40px 0; color:var(--text-muted);">Đang xây dựng sơ đồ phả hệ quan hệ...</div>`;
    try {
      const data = await fetchApi(`/api/so-do?lop=${currentGrade}`);
      GraphView.render("graph-container-root", data, (nodeId) => {
        showDetail(nodeId);
      });
    } catch (e) {
      container.innerHTML = `<div style="color:var(--danger); text-align:center; padding: 40px 0;">Không thể tải dữ liệu sơ đồ.</div>`;
    }
  }

  return {
    init,
    showDetail,
    backToLibrary
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
