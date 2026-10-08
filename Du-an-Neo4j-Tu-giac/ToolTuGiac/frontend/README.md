# Frontend Architecture - Hệ Thống Tri Thức Tứ Giác

Thư mục này chứa toàn bộ mã nguồn giao diện người dùng (HTML5, CSS3, JavaScript ES6+) độc lập, hiện đại và trực quan:

## Cấu trúc thư mục:
- `css/styles.css`: Hệ thống thiết kế chuẩn UI/UX hiện đại (Design System, Dark/Light theme, Glassmorphism, Hiệu ứng chuyển động, Responsive mobile & desktop).
- `js/geometry-draw.js`: Trình vẽ hình học vector động (SVG Renderer) vẽ chuẩn xác từng tứ giác (Tứ giác, Hình thang, Hình thang cân, Hình thang vuông, Hình bình hành, Hình chữ nhật, Hình thoi, Hình vuông, Tứ giác nội tiếp).
- `js/graph-view.js`: Trình hiển thị sơ đồ phân cấp phả hệ quan hệ đồ thị (Concept Hierarchy Graph) với đường nối cong Bezier động và tương tác chọn nút.
- `js/calculator.js`: Máy tính hình học tương tác theo thời gian thực (tính Chu vi, Diện tích, Đường chéo kèm hiển thị công thức và bước thế số).
- `js/transformer.js`: Công cụ chuyển đổi hình học (Tìm đường đi ngắn nhất giữa 2 hình bằng thuật toán BFS trên tập dấu hiệu nhận biết).
- `js/quiz.js`: Hệ thống trắc nghiệm hình học tương tác (Đếm chuỗi trả lời đúng, giải thích trực quan, thanh tiến độ, tổng kết điểm).
- `js/app.js`: Bộ điều phối ứng dụng (Quản lý trạng thái, chuyển Tab, chọn Lớp 6–12, tìm kiếm & bộ lọc, kiểm tra trạng thái Neo4j/Memory).
- `index.html`: Bản template HTML5 cấu trúc chuẩn.
