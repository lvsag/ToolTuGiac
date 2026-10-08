# Product Backlog – Học tứ giác với Neo4j

> File này là **bản chính để cập nhật tiến độ**. AI hoặc thành viên nhóm sửa cột *Trạng thái* và *Ghi chú* sau mỗi lần làm. Bản Excel (`2_Product-backlog.xlsx`) dùng để nộp, cần đồng bộ lại khi cuối kỳ.

**Trạng thái:** Chưa làm · Đang làm · Hoàn thành. **Ưu tiên (MoSCoW):** M bắt buộc, S nên có, C có thể có. **Bản phát hành:** MVP (Sprint 1–4), 1.1 (5–6), 1.2 (7–8), 2.0 (9+).

## Tổng quan tiến độ

| Trạng thái | Số story | Story point |
|---|---|---|
| Hoàn thành | 11 | 51 |
| Đang làm | 8 | 50 |
| Chưa làm | 34 | 218 |
| **Tổng** | **53** | **319** |

Cập nhật lần cuối: (ghi ngày vào đây mỗi lần chỉnh sửa)

## Danh sách story

| ID | Epic | User story | Tiêu chí chấp nhận | Ưu tiên | SP | Sprint | Bản | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|
| A1 | Thư viện kiến thức | Là học sinh, tôi muốn xem danh sách các loại tứ giác để biết mình cần học những hình nào | Hiển thị danh sách hình theo lớp đã chọn, có tên và hình nhỏ; bấm vào mở chi tiết | M | 3 | 1 | MVP | Hoàn thành | Danh sách hình lọc theo lớp (api /api/hinh) |
| A2 | Thư viện kiến thức | Là học sinh, tôi muốn xem thẻ kiến thức của từng hình (định nghĩa, tính chất, dấu hiệu, công thức) | Đủ các mục theo Phụ lục A của hồ sơ đặc tả; công thức hiển thị đúng ký hiệu | M | 8 | 1 | MVP | Hoàn thành | Có định nghĩa, tính chất, dấu hiệu, công thức; chưa có mục Ví dụ |
| A3 | Thư viện kiến thức | Là học sinh, tôi muốn xem hình minh họa có ký hiệu cạnh bằng, song song, góc vuông | Hình vẽ đúng ký hiệu chuẩn sách giáo khoa | M | 5 | 1 | MVP | Chưa làm |  |
| A4 | Thư viện kiến thức | Là học sinh, tôi muốn xem sơ đồ quan hệ giữa các hình để hiểu hình nào nằm trong hình nào | Sơ đồ bao hàm đúng; bấm vào nút nhảy tới thẻ hình | M | 5 | 2 | MVP | Hoàn thành | Sơ đồ xếp tầng dạng danh sách, từ lớp 8; chưa vẽ đồ thị |
| A5 | Thư viện kiến thức | Là học sinh, tôi muốn xem bảng so sánh các hình để phân biệt nhanh | Bảng so sánh đúng; cuộn ngang được trên điện thoại | S | 3 | 2 | MVP | Chưa làm |  |
| A6 | Thư viện kiến thức | Là học sinh, tôi muốn thấy mẹo nhớ ngắn cho mỗi hình | Mỗi hình có ít nhất 1 mẹo, tối đa 2 câu | C | 2 | 5 | 1.1 | Chưa làm |  |
| B1 | Tra cứu và nhận diện | Là học sinh, tôi muốn tìm hình theo tên | Tìm không phân biệt hoa thường, có hoặc không dấu | S | 3 | 2 | MVP | Chưa làm |  |
| B2 | Tra cứu và nhận diện | Là học sinh, tôi muốn lọc hình theo đặc điểm | Lọc nhiều điều kiện cùng lúc, kết quả đúng bảng so sánh | S | 5 | 5 | 1.1 | Chưa làm |  |
| B3 | Tra cứu và nhận diện | Là học sinh, tôi muốn chọn các đặc điểm đã biết và nhận gợi ý đó là hình gì | Trả về hình phù hợp nhất kèm giải thích; báo "không đủ dữ kiện" nếu thiếu | S | 8 | 5 | 1.1 | Chưa làm |  |
| B4 | Tra cứu và nhận diện | Là học sinh, tôi muốn kéo đỉnh của hình để thấy tính chất luôn đúng | Kéo mượt; ký hiệu tự cập nhật; hình không thoát khỏi loại đang học | S | 13 | 6 | 1.1 | Chưa làm |  |
| C1 | Luyện tập và ôn tập | Là học sinh, tôi muốn làm câu nhận diện tên hình | Ngân hàng ít nhất 40 câu, 2 mức độ, phản hồi đúng sai tức thì | M | 8 | 2 | MVP | Đang làm | Có dạng định nghĩa → tên hình; chưa đủ 40 câu, chưa có 2 mức độ |
| C2 | Luyện tập và ôn tập | Là học sinh, tôi muốn làm câu hỏi về tính chất | Ít nhất 30 câu, có giải thích | M | 5 | 2 | MVP | Chưa làm |  |
| C3 | Luyện tập và ôn tập | Là học sinh, tôi muốn làm câu hỏi về dấu hiệu nhận biết | Ít nhất 30 câu, có giải thích | M | 5 | 3 | MVP | Đang làm | Có dạng dấu hiệu → kết luận (khoảng 24 câu); chưa đủ 30 câu, chưa có giải thích |
| C4 | Luyện tập và ôn tập | Là học sinh, tôi muốn làm câu hỏi phân biệt "tính chất" và "dấu hiệu" | Ít nhất 20 câu tình huống | S | 5 | 5 | 1.1 | Chưa làm |  |
| C5 | Luyện tập và ôn tập | Là học sinh, tôi muốn làm bài tập công thức chu vi, diện tích, đường chéo | Ít nhất 30 câu, số liệu ngẫu nhiên, đáp án kèm bước giải | M | 8 | 3 | MVP | Đang làm | Có dạng công thức → tên hình; chưa có bài tính số liệu và bước giải |
| C6 | Luyện tập và ôn tập | Là học sinh, tôi muốn dùng máy tính công thức để kiểm tra kết quả | Nhập số, hiển thị bước thế số, báo lỗi dữ liệu không hợp lệ | S | 5 | 5 | 1.1 | Chưa làm |  |
| C7 | Luyện tập và ôn tập | Là học sinh, tôi muốn ôn flashcard theo lịch lặp lại | Thẻ sai lặp lại sớm hơn; có nút đã nhớ / chưa nhớ | S | 8 | 6 | 1.1 | Chưa làm |  |
| C8 | Luyện tập và ôn tập | Là học sinh, tôi muốn làm bài kiểm tra tổng hợp | 10–20 câu trộn dạng, có điểm và lời giải | M | 8 | 4 | MVP | Chưa làm |  |
| D1 | Theo dõi tiến độ | Là học sinh, tôi muốn xem điểm theo từng chủ đề | Biểu đồ hoặc phần trăm theo hình và theo dạng bài | S | 5 | 5 | 1.1 | Chưa làm |  |
| D2 | Theo dõi tiến độ | Là học sinh, tôi muốn xem danh sách thẻ hay sai | Sắp theo số lần sai, bấm để ôn lại | S | 3 | 5 | 1.1 | Chưa làm |  |
| D3 | Theo dõi tiến độ | Là học sinh, tôi muốn có chuỗi ngày học và huy hiệu để có động lực | Chuỗi tính theo ngày; huy hiệu cơ bản | C | 5 | 6 | 1.1 | Chưa làm |  |
| E1 | Tài khoản và giáo viên | Là học sinh, tôi muốn đăng nhập để lưu tiến độ trên nhiều thiết bị | Đăng ký, đăng nhập, quên mật khẩu, đồng bộ | S | 13 | 5 | 1.1 | Chưa làm |  |
| E2 | Tài khoản và giáo viên | Là giáo viên, tôi muốn tạo lớp và mời học sinh bằng mã | Mã lớp, danh sách học sinh | C | 8 | 9 | 2.0 | Chưa làm |  |
| E3 | Tài khoản và giáo viên | Là giáo viên, tôi muốn giao bài và xem báo cáo cả lớp | Giao theo chủ đề và khối lớp; báo cáo điểm và lỗi sai phổ biến | C | 13 | 10 | 2.0 | Chưa làm |  |
| E4 | Tài khoản và giáo viên | Là giáo viên, tôi muốn thêm hoặc sửa câu hỏi của riêng mình | Giao diện quản lý ngân hàng câu hỏi, duyệt trước khi dùng | C | 13 | 10 | 2.0 | Chưa làm |  |
| F1 | Nền tảng và chất lượng | Thiết lập dự án, CI/CD, môi trường thử nghiệm | Triển khai tự động lên môi trường thử nghiệm | M | 5 | 1 | MVP | Chưa làm |  |
| F2 | Nền tảng và chất lượng | Thiết kế UI/UX và design system | Bộ màn hình chính, được Product Owner duyệt | M | 8 | 1 | MVP | Chưa làm |  |
| F3 | Nền tảng và chất lượng | Hiển thị công thức toán chuẩn | Dùng LaTeX hoặc MathML, hiển thị đúng trên điện thoại | M | 3 | 1 | MVP | Chưa làm |  |
| F4 | Nền tảng và chất lượng | Kiểm duyệt nội dung bởi giáo viên | Mọi thẻ và câu hỏi có trạng thái "đã duyệt" | M | 5 | Liên tục | MVP | Chưa làm |  |
| F5 | Nền tảng và chất lượng | Kiểm thử khả dụng với 5–10 học sinh | Báo cáo lỗi và danh sách cải tiến | S | 5 | 4 | MVP | Chưa làm |  |
| F6 | Nền tảng và chất lượng | Bảo mật, quyền riêng tư dữ liệu học sinh | Rà soát trước khi có tài khoản | M | 5 | 5 | 1.1 | Chưa làm |  |
| G1 | Cá nhân hóa theo lớp | Là học sinh, tôi muốn chọn lớp (6–12) khi bắt đầu để chỉ thấy nội dung phù hợp | Màn hình chọn lớp lần đầu; đổi lớp trong Cài đặt; không mất tiến độ | M | 3 | 1 | MVP | Hoàn thành | Chọn lớp 6–12, nhớ bằng localStorage |
| G2 | Cá nhân hóa theo lớp | Là đội phát triển, chúng tôi cần mô hình nội dung gắn nhãn lớp, mức độ, bộ sách, trạng thái duyệt | Mọi thẻ, câu hỏi, công thức có đủ thuộc tính theo BR-07 | M | 5 | 1 | MVP | Đang làm | Đã có lop_min; chưa có mức độ, bộ sách, trạng thái duyệt (BR-07) |
| G3 | Cá nhân hóa theo lớp | Là học sinh, tôi muốn thẻ kiến thức, câu hỏi, công thức được lọc theo lớp | Không hiển thị nội dung ngoài lớp (trừ khi xem trước) | M | 5 | 2 | MVP | Hoàn thành | Lọc hình, tính chất, dấu hiệu, công thức, câu hỏi theo lớp |
| G4 | Cá nhân hóa theo lớp | Là học sinh, tôi muốn xem trước lớp trên và ôn lại lớp dưới | Nhãn "Sẽ học ở lớp X" và "Ôn lớp Y"; bật tắt được | S | 5 | 5 | 1.1 | Đang làm | Có nhãn Ôn tập; chưa có chế độ xem trước lớp trên |
| G5 | Cá nhân hóa theo lớp | Là học sinh lớp 6, tôi muốn học 5 hình, đối xứng, chu vi, diện tích | Ít nhất 40 câu hỏi; hình động; đúng phạm vi lớp 6 | M | 8 | 2 | MVP | Đang làm | Có 5 hình lớp 6, chu vi, diện tích; chưa có đối xứng, chưa đủ 40 câu |
| G6 | Cá nhân hóa theo lớp | Là học sinh lớp 7, tôi muốn ôn lớp 6 và học hình khối có đáy là tứ giác | Ít nhất 30 câu hỏi; công thức lăng trụ, hình hộp | S | 5 | 5 | 1.1 | Chưa làm |  |
| G7 | Cá nhân hóa theo lớp | Gắn nhãn lớp 8 cho toàn bộ nội dung Epic A–C đã có | Mọi mục lớp 8 có nhãn lớp và mức độ | M | 3 | 1 | MVP | Hoàn thành | Nội dung lớp 8 trong data.py đều có lop_min |
| G8 | Cá nhân hóa theo lớp | Là học sinh lớp 9, tôi muốn học tứ giác nội tiếp và ôn thi vào lớp 10 | Thẻ kiến thức, ít nhất 30 câu, bộ đề ôn | S | 8 | 6 | 1.1 | Đang làm | Có tứ giác nội tiếp; chưa có bộ đề ôn thi vào 10 |
| G9 | Cá nhân hóa theo lớp | Là học sinh lớp 10, tôi muốn luyện tứ giác bằng vectơ và tọa độ | Ít nhất 30 câu; công thức diện tích dùng sin | C | 8 | 7 | 1.2 | Chưa làm |  |
| G10 | Cá nhân hóa theo lớp | Là học sinh lớp 11, tôi muốn luyện tứ giác trong không gian | Thiết diện, hình hộp, chóp đáy tứ giác | C | 8 | 8 | 1.2 | Chưa làm |  |
| G11 | Cá nhân hóa theo lớp | Là học sinh lớp 12, tôi muốn luyện tứ giác bằng tọa độ Oxyz và bài tối ưu | Ít nhất 30 câu; có đề ôn tốt nghiệp | C | 8 | 8 | 1.2 | Chưa làm |  |
| G12 | Cá nhân hóa theo lớp | Là học sinh, tôi muốn làm kiểm tra đầu vào và nhận lộ trình theo lớp | Bài ngắn theo lớp, gợi ý hình cần học trước | S | 5 | 5 | 1.1 | Chưa làm |  |
| G13 | Cá nhân hóa theo lớp | Là học sinh, tôi muốn giao diện và cách trình bày phù hợp lứa tuổi | Ba kiểu trình bày theo cấp học | C | 5 | 6 | 1.1 | Chưa làm |  |
| G14 | Cá nhân hóa theo lớp | Là giáo viên, tôi muốn duyệt nội dung theo từng khối lớp | Trạng thái duyệt theo lớp; chỉ nội dung đã duyệt được hiển thị | M | 5 | Liên tục | MVP | Chưa làm |  |
| H1 | Cơ sở dữ liệu Neo4j | Thiết kế mô hình đồ thị: nút, quan hệ, ràng buộc (Phụ lục B) | Có sơ đồ mô hình; ràng buộc duy nhất cho tên hình; được nhóm duyệt | M | 5 | 1 | MVP | Hoàn thành | Mô hình ở Phụ lục B của hồ sơ đặc tả; ràng buộc duy nhất cho Hinh.id và Lop.so |
| H2 | Cơ sở dữ liệu Neo4j | Nhập dữ liệu 8 hình cùng tính chất, dấu hiệu, công thức vào Neo4j bằng Cypher hoặc CSV | Script nhập chạy lại được; số nút và quan hệ khớp bảng nội dung lớp 8 | M | 8 | 2 | MVP | Hoàn thành | import_neo4j.py; cần xác nhận số nút, quan hệ khi chạy với Neo4j thật |
| H3 | Cơ sở dữ liệu Neo4j | Truy vấn quan hệ bao hàm để dựng sơ đồ các hình | Trả về đúng chuỗi hình vuông → chữ nhật → bình hành → hình thang → tứ giác | M | 3 | 2 | MVP | Hoàn thành | Truy vấn quan_he trong repo.py |
| H4 | Cơ sở dữ liệu Neo4j | Truy vấn gợi ý hình theo đặc điểm và "cần thêm điều kiện gì" để thành hình khác | Trả về hình phù hợp và điều kiện còn thiếu; có kiểm thử với ít nhất 10 trường hợp | S | 5 | 5 | 1.1 | Hoàn thành | Truy vấn goi_y; chưa có bộ kiểm thử 10 trường hợp |
| H5 | Cơ sở dữ liệu Neo4j | Gắn quan hệ HOC_O giữa hình và lớp để lọc nội dung theo lớp | Truy vấn theo lớp 6–12 trả đúng danh sách hình và mức độ | M | 3 | 2 | MVP | Hoàn thành | Quan hệ HOC_O tạo trong import_neo4j.py, truy vấn hinh_theo_lop |
| H6 | Cơ sở dữ liệu Neo4j | Lưu kết quả làm bài của học sinh dưới dạng quan hệ TRA_LOI | Thống kê được điểm theo hình và theo lớp bằng một truy vấn | S | 5 | 5 | 1.1 | Chưa làm |  |
| H7 | Cơ sở dữ liệu Neo4j | Trực quan hóa đồ thị kiến thức cho học sinh | Hiển thị đồ thị các hình và quan hệ; bấm vào nút mở thẻ kiến thức | C | 8 | 8 | 1.2 | Chưa làm |  |
| H8 | Cơ sở dữ liệu Neo4j | Thiết lập Neo4j (Docker hoặc AuraDB), sao lưu và phân quyền truy cập | Môi trường chạy được từ README; có bản sao lưu; tài khoản ứng dụng chỉ đọc/ghi cần thiết | M | 3 | 1 | MVP | Đang làm | Có docker-compose.yml và hướng dẫn AuraDB; chưa có sao lưu, phân quyền |
