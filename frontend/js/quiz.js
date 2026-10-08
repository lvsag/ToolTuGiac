/**
 * Interactive Gamified Quiz Engine
 * Handles MCQ geometry questions with instant feedback and animated scoring
 */

const QuizEngine = (function() {
  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let answered = false;
  let history = [];

  async function load(containerId, grade = 8, count = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="quiz-wrapper" style="text-align:center; padding: 40px 0;">
        <div style="font-size:32px; animation: pulse-dot 1.5s infinite;">⏳</div>
        <p style="margin-top:12px; color:var(--text-muted);">Đang tạo bộ câu hỏi trắc nghiệm...</p>
      </div>
    `;

    try {
      const res = await fetch(`/api/quiz?lop=${grade}&n=${count}`);
      questions = await res.json();
      currentIndex = 0;
      score = 0;
      streak = 0;
      history = [];
      renderQuestion(containerId);
    } catch (e) {
      container.innerHTML = `
        <div class="quiz-wrapper">
          <div class="quiz-card" style="text-align:center;">
            <h3>⚠️ Không thể tải câu hỏi</h3>
            <p style="color:var(--text-muted); margin: 10px 0;">Đã xảy ra lỗi khi tải dữ liệu từ máy chủ.</p>
            <button class="btn-primary" onclick="QuizEngine.load('${containerId}', ${grade})">Thử lại</button>
          </div>
        </div>
      `;
    }
  }

  function renderQuestion(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (currentIndex >= questions.length) {
      renderSummary(containerId);
      return;
    }

    answered = false;
    const q = questions[currentIndex];
    const progressPercent = ((currentIndex) / questions.length) * 100;

    container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-card">
          <div class="quiz-progress-bar-wrap">
            <div class="quiz-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>

          <div class="quiz-header-meta">
            <span>Câu hỏi ${currentIndex + 1} / ${questions.length}</span>
            <span>🔥 Chuỗi đúng: <b>${streak}</b> | Điểm: <b>${score}/${currentIndex}</b></span>
          </div>

          <h3 class="quiz-question-title">${q.cau_hoi}</h3>

          <div class="quiz-options-list" id="quiz-opts">
            ${q.lua_chon.map(opt => `
              <button class="quiz-opt-btn" data-id="${opt.id}" onclick="QuizEngine.selectOption(this, '${opt.id}', '${q.dap_an}', '${containerId}')">
                <span>${opt.ten}</span>
                <span class="opt-status-icon">○</span>
              </button>
            `).join('')}
          </div>

          <div class="quiz-feedback-box" id="quiz-feedback"></div>

          <div style="display:flex; justify-content:flex-end; margin-top:10px;">
            <button class="btn-primary" id="btn-next-q" style="display:none;" onclick="QuizEngine.next('${containerId}')">
              Câu tiếp theo →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function selectOption(buttonEl, chosenId, correctId, containerId) {
    if (answered) return;
    answered = true;

    const allOpts = document.querySelectorAll('.quiz-opt-btn');
    allOpts.forEach(btn => (btn.disabled = true));

    const isCorrect = (chosenId === correctId);
    const feedbackEl = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('btn-next-q');

    if (isCorrect) {
      score++;
      streak++;
      buttonEl.classList.add('correct');
      buttonEl.querySelector('.opt-status-icon').textContent = '✓';
      feedbackEl.className = 'quiz-feedback-box correct show';
      feedbackEl.innerHTML = `<b>🎉 Chính xác!</b> Bạn đã nhận diện đúng tính chất hình học.`;
    } else {
      streak = 0;
      buttonEl.classList.add('incorrect');
      buttonEl.querySelector('.opt-status-icon').textContent = '✕';
      // Highlight correct one
      allOpts.forEach(btn => {
        if (btn.dataset.id === correctId) {
          btn.classList.add('correct');
          btn.querySelector('.opt-status-icon').textContent = '✓';
        }
      });
      feedbackEl.className = 'quiz-feedback-box incorrect show';
      feedbackEl.innerHTML = `<b>💡 Chưa chính xác.</b> Đáp án đúng là hình có tính chất tương ứng được đánh dấu màu xanh.`;
    }

    if (nextBtn) nextBtn.style.display = 'inline-flex';
  }

  function next(containerId) {
    currentIndex++;
    renderQuestion(containerId);
  }

  function renderSummary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const percent = Math.round((score / questions.length) * 100);
    let title = "👏 Hoàn thành xuất sắc!";
    let desc = "Bạn đã nắm rất vững toàn bộ các định nghĩa và tính chất của các tứ giác.";
    let emoji = "🏆";

    if (percent < 50) {
      title = "📚 Cần luyện tập thêm!";
      desc = "Hãy đọc lại Thư viện hình học và Sơ đồ quan hệ để ghi nhớ các dấu hiệu nhận biết nhé.";
      emoji = "💪";
    } else if (percent < 80) {
      title = "👍 Kết quả khá tốt!";
      desc = "Bạn đã hiểu hầu hết các kiến thức trọng tâm của chương trình.";
      emoji = "⭐";
    }

    container.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-card" style="text-align:center; padding: 40px 30px;">
          <div style="font-size: 50px; margin-bottom: 12px;">${emoji}</div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">${title}</h2>
          <p style="color: var(--text-muted); font-size: 15px; margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto;">
            ${desc}
          </p>

          <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 20px; display: inline-block; min-width: 240px; margin-bottom: 28px;">
            <div style="font-size: 36px; font-weight: 800; color: var(--primary); font-family: var(--font-mono);">
              ${score} / ${questions.length}
            </div>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-subtle); margin-top: 4px;">
              Tỷ lệ chính xác: ${percent}%
            </div>
          </div>

          <div>
            <button class="btn-primary" onclick="QuizEngine.load('${containerId}', localStorage.getItem('lop') || 8, ${questions.length})">
              🔄 Làm đề trắc nghiệm mới
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return {
    load,
    selectOption,
    next
  };
})();
