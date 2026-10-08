# Học tứ giác với Neo4j

Ứng dụng web hỗ trợ học sinh lớp 6–12 ghi nhớ tên gọi, tính chất, dấu hiệu nhận biết và công thức của các loại tứ giác.
Kiến thức được lưu trong cơ sở dữ liệu đồ thị **Neo4j**; giao diện web viết bằng **Flask**.

## Tính năng
- Chọn lớp (6–12): chỉ hiển thị nội dung phù hợp với lớp đã chọn.
- Thư viện hình: định nghĩa, tính chất (kể cả thừa hưởng từ hình cha), dấu hiệu nhận biết, công thức.
- Gợi ý "cần thêm điều kiện gì để thành hình khác".
- Sơ đồ quan hệ bao hàm giữa các hình (từ lớp 8).
- Luyện tập trắc nghiệm: định nghĩa, công thức, dấu hiệu nhận biết.

Chưa có: nội dung riêng cho lớp 10–12 (các lớp này hiển thị nội dung ôn tập lớp 8–9), máy tính công thức, tài khoản học sinh.

## Cấu trúc
| File | Vai trò |
|---|---|
| `data.py` | Dữ liệu kiến thức (nguồn duy nhất) |
| `import_neo4j.py` | Nạp dữ liệu vào Neo4j bằng Cypher |
| `repo.py` | Truy vấn dữ liệu: `Neo4jRepo` (Cypher) và `MemoryRepo` (dự phòng khi chưa có Neo4j) |
| `app.py` | Máy chủ Flask và các API |
| `templates/index.html` | Giao diện web |
| `docker-compose.yml` | Chạy Neo4j bằng Docker |
| `BACKLOG.md` | Product backlog kèm trạng thái, cập nhật sau mỗi lần làm |


## Cài đặt và chạy
1. Cài Python 3.10+ và Docker.
2. Tạo môi trường và cài thư viện:
   ```
   python -m venv .venv
   .venv\Scripts\activate        # Windows (macOS/Linux: source .venv/bin/activate)
   pip install -r requirements.txt
   ```
3. Chạy Neo4j: `docker compose up -d` (đợi khoảng 30 giây).
4. Đặt biến môi trường (Windows PowerShell):
   ```
   $env:NEO4J_URI="bolt://localhost:7687"; $env:NEO4J_USER="neo4j"; $env:NEO4J_PASSWORD="tugiac12345"
   ```
   (macOS/Linux: `export NEO4J_URI=bolt://localhost:7687 NEO4J_USER=neo4j NEO4J_PASSWORD=tugiac12345`)
5. Nạp dữ liệu: `python import_neo4j.py`
6. Chạy ứng dụng: `python app.py` rồi mở http://localhost:5000

Nếu không đặt `NEO4J_URI`, ứng dụng chạy bằng dữ liệu dự phòng trong bộ nhớ; góc trên bên phải trang cho biết đang dùng nguồn nào.

Xem đồ thị trực tiếp tại Neo4j Browser (http://localhost:7474), ví dụ:
```
MATCH (h:Hinh)-[r:LA_TRUONG_HOP_DAC_BIET_CUA]->(p:Hinh) RETURN h, r, p
```

## API
`GET /api/hinh?lop=6` · `GET /api/hinh/<id>?lop=8` · `GET /api/so-do?lop=8` · `GET /api/quiz?lop=8&n=5`
