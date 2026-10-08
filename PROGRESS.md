# Nhật ký tiến độ

> Đọc file này và `BACKLOG.md` trước khi làm tiếp. Không cần đọc lại toàn bộ source. Mỗi phiên làm việc thêm một mục MỚI Ở ĐẦU phần "Lịch sử", không xóa mục cũ.

## Tình trạng hiện tại
- Ứng dụng Flask chạy được; kết nối Neo4j qua biến môi trường, nếu không có thì dùng dữ liệu dự phòng (`MemoryRepo`).
- Hoàn thành 11 story, đang làm 8, chưa làm 34 (chi tiết trong `BACKLOG.md`).
- Nội dung có cho lớp 6, 7 (ôn lớp 6), 8, 9; lớp 10–12 chỉ hiển thị nội dung ôn tập.

## Kiến trúc nhanh
| File | Vai trò |
|---|---|
| `data.py` | Dữ liệu kiến thức: HINH, QUAN_HE, TINH_CHAT, DAU_HIEU, CONG_THUC (mỗi mục có `lop_min`) |
| `import_neo4j.py` | Xóa và nạp lại toàn bộ dữ liệu vào Neo4j |
| `repo.py` | `Neo4jRepo` (Cypher) và `MemoryRepo`, cùng giao diện: `hinh_theo_lop`, `quan_he`, `the_kien_thuc`, `goi_y`, `tat_ca_dau_hieu`, `tat_ca_cong_thuc` |
| `app.py` | API: `/api/hinh`, `/api/hinh/<id>`, `/api/so-do`, `/api/quiz`, `/api/info`; sinh câu hỏi trắc nghiệm |
| `templates/index.html` | Giao diện một trang (3 tab: Thư viện, Sơ đồ, Luyện tập) |

Thêm truy vấn mới: viết cả hai phiên bản (Cypher trong `Neo4jRepo`, Python trong `MemoryRepo`) để hai nguồn cho cùng kết quả.

## Cách chạy
Xem `README.md`. Biến môi trường: `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, `NEO4J_DATABASE` (tùy chọn, dùng cho AuraDB). Không ghi mật khẩu vào code hoặc commit.

## Chưa kiểm chứng và hạn chế đã biết
- `Neo4jRepo` và `import_neo4j.py` đã được viết nhưng cần xác nhận khi chạy với Neo4j thật (số nút, quan hệ, kết quả truy vấn giống `MemoryRepo`).
- Quiz: câu hỏi sinh từ dữ liệu, chưa có lời giải thích; đáp án được gửi kèm câu hỏi (chỉ phù hợp bản demo).
- Công thức hiển thị bằng ký tự Unicode, chưa dùng LaTeX/KaTeX.
- Nội dung phân bổ theo lớp là đề xuất, cần giáo viên đối chiếu với bộ sách giáo khoa.
- Chưa có kiểm thử tự động.

## Việc nên làm tiếp (gợi ý thứ tự)
1. Xác nhận chạy được với Neo4j thật (H2, H3, H5); sửa lỗi nếu có.
2. Thêm lời giải thích cho từng câu quiz và dạng câu hỏi về tính chất (C2, C3).
3. Thêm kiểm thử cho `MemoryRepo` và API (pytest).
4. Tìm theo tên và lọc theo đặc điểm (B1, B2).
5. Chế độ xem trước lớp trên (G4).
6. Hiển thị công thức bằng KaTeX (F3).

## Lịch sử
### Phiên 1
- Dựng khung dự án: dữ liệu, truy vấn Neo4j và dự phòng, API, giao diện, nạp dữ liệu.
- Story hoàn thành: A1, A2, A4, G1, G3, G7, H1, H2, H3, H4, H5.
- Cách chạy thử: `python app.py` (dữ liệu dự phòng) hoặc theo `README.md` (Neo4j).
