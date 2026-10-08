"""Dữ liệu kiến thức tứ giác (nguồn duy nhất, dùng để nạp vào Neo4j và làm dữ liệu dự phòng).
lop_min = lớp nhỏ nhất được hiển thị nội dung đó; lop_chinh/lop_max = các lớp có hình này."""

HINH = [  # id, tên, định nghĩa, lop_chinh, lop_max
    ("tu_giac", "Tứ giác", "Hình có bốn đỉnh, bốn cạnh, trong đó không có ba đỉnh nào thẳng hàng.", 8, 12),
    ("thang", "Hình thang", "Tứ giác có hai cạnh đối song song.", 8, 12),
    ("thang_can", "Hình thang cân", "Hình thang có hai góc kề một đáy bằng nhau.", 6, 12),
    ("thang_vuong", "Hình thang vuông", "Hình thang có một góc vuông.", 8, 12),
    ("binh_hanh", "Hình bình hành", "Tứ giác có các cạnh đối song song.", 6, 12),
    ("chu_nhat", "Hình chữ nhật", "Tứ giác có bốn góc vuông.", 6, 12),
    ("thoi", "Hình thoi", "Tứ giác có bốn cạnh bằng nhau.", 6, 12),
    ("vuong", "Hình vuông", "Tứ giác có bốn góc vuông và bốn cạnh bằng nhau.", 6, 12),
    ("noi_tiep", "Tứ giác nội tiếp", "Tứ giác có bốn đỉnh cùng nằm trên một đường tròn.", 9, 10),
]

# (con, cha): con là trường hợp đặc biệt của cha
QUAN_HE = [
    ("thang", "tu_giac"), ("noi_tiep", "tu_giac"),
    ("thang_can", "thang"), ("thang_vuong", "thang"), ("binh_hanh", "thang"),
    ("chu_nhat", "binh_hanh"), ("thoi", "binh_hanh"),
    ("vuong", "chu_nhat"), ("vuong", "thoi"),
]

TINH_CHAT = [  # hình, nội dung, lop_min
    ("tu_giac", "Tổng bốn góc bằng 360°.", 8),
    ("thang", "Hai góc kề một cạnh bên bù nhau (tổng 180°).", 8),
    ("thang_can", "Hai cạnh bên bằng nhau.", 6),
    ("thang_can", "Hai đường chéo bằng nhau.", 6),
    ("thang_vuong", "Có hai góc vuông kề một cạnh bên.", 8),
    ("binh_hanh", "Các cạnh đối song song và bằng nhau.", 6),
    ("binh_hanh", "Các góc đối bằng nhau.", 6),
    ("binh_hanh", "Hai đường chéo cắt nhau tại trung điểm mỗi đường.", 6),
    ("chu_nhat", "Bốn góc vuông.", 6),
    ("chu_nhat", "Hai đường chéo bằng nhau.", 6),
    ("thoi", "Bốn cạnh bằng nhau.", 6),
    ("thoi", "Hai đường chéo vuông góc với nhau.", 6),
    ("thoi", "Hai đường chéo là phân giác của các góc.", 8),
    ("noi_tiep", "Tổng hai góc đối bằng 180°.", 9),
    ("noi_tiep", "Góc ngoài bằng góc trong của đỉnh đối diện.", 9),
]

DAU_HIEU = [  # áp dụng cho, kết luận, nội dung (bắt đầu bằng "có"), lop_min
    ("tu_giac", "thang", "có một cặp cạnh đối song song", 8),
    ("thang", "thang_can", "có hai góc kề một đáy bằng nhau", 8),
    ("thang", "thang_can", "có hai đường chéo bằng nhau", 8),
    ("thang", "thang_vuong", "có một góc vuông", 8),
    ("tu_giac", "binh_hanh", "có các cạnh đối song song", 8),
    ("tu_giac", "binh_hanh", "có các cạnh đối bằng nhau", 8),
    ("tu_giac", "binh_hanh", "có một cặp cạnh đối vừa song song vừa bằng nhau", 8),
    ("tu_giac", "binh_hanh", "có các góc đối bằng nhau", 8),
    ("tu_giac", "binh_hanh", "có hai đường chéo cắt nhau tại trung điểm mỗi đường", 8),
    ("tu_giac", "chu_nhat", "có ba góc vuông", 8),
    ("thang_can", "chu_nhat", "có một góc vuông", 8),
    ("binh_hanh", "chu_nhat", "có một góc vuông", 8),
    ("binh_hanh", "chu_nhat", "có hai đường chéo bằng nhau", 8),
    ("tu_giac", "thoi", "có bốn cạnh bằng nhau", 8),
    ("binh_hanh", "thoi", "có hai cạnh kề bằng nhau", 8),
    ("binh_hanh", "thoi", "có hai đường chéo vuông góc", 8),
    ("binh_hanh", "thoi", "có một đường chéo là phân giác của một góc", 8),
    ("chu_nhat", "vuong", "có hai cạnh kề bằng nhau", 8),
    ("chu_nhat", "vuong", "có hai đường chéo vuông góc", 8),
    ("chu_nhat", "vuong", "có một đường chéo là phân giác của một góc", 8),
    ("thoi", "vuong", "có một góc vuông", 8),
    ("thoi", "vuong", "có hai đường chéo bằng nhau", 8),
    ("tu_giac", "noi_tiep", "có tổng hai góc đối bằng 180°", 9),
    ("tu_giac", "noi_tiep", "có góc ngoài bằng góc trong của đỉnh đối diện", 9),
]

CONG_THUC = [  # hình, tên, biểu thức, lop_min
    ("vuong", "Chu vi", "P = 4a", 6), ("vuong", "Diện tích", "S = a²", 6), ("vuong", "Đường chéo", "d = a√2", 8),
    ("chu_nhat", "Chu vi", "P = 2(a + b)", 6), ("chu_nhat", "Diện tích", "S = a · b", 6),
    ("chu_nhat", "Đường chéo", "d = √(a² + b²)", 8),
    ("thoi", "Chu vi", "P = 4a", 6), ("thoi", "Diện tích", "S = d₁ · d₂ / 2", 6),
    ("binh_hanh", "Chu vi", "P = 2(a + b)", 6), ("binh_hanh", "Diện tích", "S = a · h", 6),
    ("thang_can", "Diện tích", "S = (a + b) · h / 2", 6),
    ("thang", "Diện tích", "S = (a + b) · h / 2", 8),
    ("thang_vuong", "Diện tích", "S = (a + b) · h / 2", 8),
]
