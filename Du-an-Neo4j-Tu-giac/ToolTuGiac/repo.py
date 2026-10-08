"""Truy cập dữ liệu: Neo4jRepo (Cypher) và MemoryRepo (dữ liệu dự phòng, cùng giao diện)."""
import os
from data import HINH, QUAN_HE, TINH_CHAT, DAU_HIEU, CONG_THUC

TEN = {h[0]: h[1] for h in HINH}


class MemoryRepo:
    name = "memory"

    def _hien(self, lop):
        return {h[0] for h in HINH if h[3] <= lop <= h[4]}

    def hinh_theo_lop(self, lop):
        return [{"id": h[0], "ten": h[1], "dinh_nghia": h[2], "vai_tro": "chinh_thuc" if h[3] == lop else "on_tap"}
                for h in HINH if h[3] <= lop <= h[4]]

    def quan_he(self, lop):
        v = self._hien(lop)
        return [{"con": c, "cha": p} for c, p in QUAN_HE if c in v and p in v]

    def to_tien(self, hid):
        res, todo = {hid}, [hid]
        while todo:
            x = todo.pop()
            for c, p in QUAN_HE:
                if c == x and p not in res:
                    res.add(p); todo.append(p)
        return res

    def the_kien_thuc(self, hid, lop):
        v = self._hien(lop)
        h = next(x for x in HINH if x[0] == hid)
        anc = self.to_tien(hid)
        return {
            "id": hid, "ten": h[1], "dinh_nghia": h[2],
            "tinh_chat": list(dict.fromkeys(t[1] for t in TINH_CHAT if t[0] in anc and t[2] <= lop)),
            "dau_hieu": [{"noi_dung": d[2], "tu": TEN[d[0]]} for d in DAU_HIEU if d[1] == hid and d[3] <= lop and d[0] in v],
            "cong_thuc": [{"ten": c[1], "bieu_thuc": c[2]} for c in CONG_THUC if c[0] == hid and c[3] <= lop],
            "cha": [TEN[p] for c, p in QUAN_HE if c == hid and p in v],
            "con": [TEN[c] for c, p in QUAN_HE if p == hid and c in v],
        }

    def goi_y(self, hid, lop):
        v = self._hien(lop)
        return [{"dieu_kien": d[2], "ket_luan": TEN[d[1]]} for d in DAU_HIEU
                if d[0] == hid and d[3] <= lop and d[1] in v]

    def tat_ca_dau_hieu(self, lop):
        return [{"noi_dung": d[2], "tu": d[0], "tu_ten": TEN[d[0]], "den": d[1], "den_ten": TEN[d[1]]}
                for d in DAU_HIEU if d[3] <= lop]

    def tat_ca_cong_thuc(self, lop):
        return [{"hinh": c[0], "hinh_ten": TEN[c[0]], "ten": c[1], "bieu_thuc": c[2]}
                for c in CONG_THUC if c[3] <= lop]


class Neo4jRepo:
    name = "neo4j"

    def __init__(self, uri, user, password):
        from neo4j import GraphDatabase  # import muộn để chạy được khi chưa cài driver
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.driver.verify_connectivity()
        self.db = os.getenv("NEO4J_DATABASE") or None  # AuraDB có thể dùng tên database riêng

    def _q(self, cypher, **params):
        with self.driver.session(database=self.db) as s:
            return [r.data() for r in s.run(cypher, **params)]

    def hinh_theo_lop(self, lop):
        return self._q("""MATCH (h:Hinh)-[r:HOC_O]->(:Lop {so: $lop})
                          RETURN h.id AS id, h.ten AS ten, h.dinh_nghia AS dinh_nghia, r.vai_tro AS vai_tro
                          ORDER BY h.thu_tu""", lop=lop)

    def quan_he(self, lop):
        return self._q("""MATCH (c:Hinh)-[:LA_TRUONG_HOP_DAC_BIET_CUA]->(p:Hinh),
                                (c)-[:HOC_O]->(:Lop {so: $lop}), (p)-[:HOC_O]->(:Lop {so: $lop})
                          RETURN c.id AS con, p.id AS cha""", lop=lop)

    def the_kien_thuc(self, hid, lop):
        h = self._q("MATCH (h:Hinh {id: $id}) RETURN h.ten AS ten, h.dinh_nghia AS dinh_nghia", id=hid)[0]
        tc = self._q("""MATCH (:Hinh {id: $id})-[:LA_TRUONG_HOP_DAC_BIET_CUA*0..]->(:Hinh)-[:CO_TINH_CHAT]->(t:TinhChat)
                        WHERE t.lop_min <= $lop RETURN DISTINCT t.noi_dung AS nd, t.thu_tu AS tt ORDER BY tt""", id=hid, lop=lop)
        dh = self._q("""MATCH (d:DauHieu)-[:KET_LUAN]->(:Hinh {id: $id}), (d)-[:AP_DUNG_CHO]->(a:Hinh)-[:HOC_O]->(:Lop {so: $lop})
                        WHERE d.lop_min <= $lop RETURN d.noi_dung AS noi_dung, a.ten AS tu ORDER BY d.thu_tu""", id=hid, lop=lop)
        ct = self._q("""MATCH (:Hinh {id: $id})-[:CO_CONG_THUC]->(c:CongThuc) WHERE c.lop_min <= $lop
                        RETURN c.ten AS ten, c.bieu_thuc AS bieu_thuc ORDER BY c.thu_tu""", id=hid, lop=lop)
        cha = self._q("""MATCH (:Hinh {id: $id})-[:LA_TRUONG_HOP_DAC_BIET_CUA]->(p:Hinh)-[:HOC_O]->(:Lop {so: $lop})
                         RETURN p.ten AS ten""", id=hid, lop=lop)
        con = self._q("""MATCH (c:Hinh)-[:LA_TRUONG_HOP_DAC_BIET_CUA]->(:Hinh {id: $id}), (c)-[:HOC_O]->(:Lop {so: $lop})
                         RETURN c.ten AS ten""", id=hid, lop=lop)
        return {"id": hid, **h, "tinh_chat": [x["nd"] for x in tc], "dau_hieu": dh, "cong_thuc": ct,
                "cha": [x["ten"] for x in cha], "con": [x["ten"] for x in con]}

    def goi_y(self, hid, lop):
        return self._q("""MATCH (d:DauHieu)-[:AP_DUNG_CHO]->(:Hinh {id: $id}), (d)-[:KET_LUAN]->(k:Hinh)-[:HOC_O]->(:Lop {so: $lop})
                          WHERE d.lop_min <= $lop RETURN d.noi_dung AS dieu_kien, k.ten AS ket_luan ORDER BY d.thu_tu""",
                       id=hid, lop=lop)

    def tat_ca_dau_hieu(self, lop):
        return self._q("""MATCH (d:DauHieu)-[:AP_DUNG_CHO]->(a:Hinh), (d)-[:KET_LUAN]->(k:Hinh) WHERE d.lop_min <= $lop
                          RETURN d.noi_dung AS noi_dung, a.id AS tu, a.ten AS tu_ten, k.id AS den, k.ten AS den_ten""", lop=lop)

    def tat_ca_cong_thuc(self, lop):
        return self._q("""MATCH (h:Hinh)-[:CO_CONG_THUC]->(c:CongThuc) WHERE c.lop_min <= $lop
                          RETURN h.id AS hinh, h.ten AS hinh_ten, c.ten AS ten, c.bieu_thuc AS bieu_thuc""", lop=lop)


def get_repo():
    uri = os.getenv("NEO4J_URI")
    if uri:
        try:
            return Neo4jRepo(uri, os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", ""))
        except Exception as e:  # không kết nối được: dùng dữ liệu dự phòng
            print(f"[!] Không kết nối được Neo4j ({e}). Dùng dữ liệu dự phòng trong bộ nhớ.")
    return MemoryRepo()
