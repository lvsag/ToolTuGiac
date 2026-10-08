"""Nạp dữ liệu từ data.py vào Neo4j. Chạy: python import_neo4j.py"""
import os
from neo4j import GraphDatabase
from data import HINH, QUAN_HE, TINH_CHAT, DAU_HIEU, CONG_THUC

uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
auth = (os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", "tugiac12345"))

with GraphDatabase.driver(uri, auth=auth) as driver, driver.session(database=os.getenv("NEO4J_DATABASE") or None) as s:
    s.run("MATCH (n) DETACH DELETE n")  # nạp lại từ đầu
    for q in ["CREATE CONSTRAINT hinh_id IF NOT EXISTS FOR (h:Hinh) REQUIRE h.id IS UNIQUE",
              "CREATE CONSTRAINT lop_so IF NOT EXISTS FOR (l:Lop) REQUIRE l.so IS UNIQUE"]:
        s.run(q)
    s.run("UNWIND range(6, 12) AS n MERGE (:Lop {so: n})")
    s.run("""UNWIND $rows AS r
             MERGE (h:Hinh {id: r.id}) SET h.ten = r.ten, h.dinh_nghia = r.dn, h.thu_tu = r.tt
             WITH h, r UNWIND range(r.lop_chinh, r.lop_max) AS n
             MATCH (l:Lop {so: n}) MERGE (h)-[x:HOC_O]->(l)
             SET x.vai_tro = CASE WHEN n = r.lop_chinh THEN 'chinh_thuc' ELSE 'on_tap' END""",
          rows=[{"id": h[0], "ten": h[1], "dn": h[2], "lop_chinh": h[3], "lop_max": h[4], "tt": i} for i, h in enumerate(HINH)])
    s.run("""UNWIND $rows AS r MATCH (c:Hinh {id: r.con}), (p:Hinh {id: r.cha})
             MERGE (c)-[:LA_TRUONG_HOP_DAC_BIET_CUA]->(p)""", rows=[{"con": c, "cha": p} for c, p in QUAN_HE])
    s.run("""UNWIND $rows AS r MATCH (h:Hinh {id: r.h})
             CREATE (t:TinhChat {noi_dung: r.nd, lop_min: r.lop, thu_tu: r.tt}) CREATE (h)-[:CO_TINH_CHAT]->(t)""",
          rows=[{"h": h, "nd": nd, "lop": l, "tt": i} for i, (h, nd, l) in enumerate(TINH_CHAT)])
    s.run("""UNWIND $rows AS r MATCH (a:Hinh {id: r.a}), (k:Hinh {id: r.k})
             CREATE (d:DauHieu {noi_dung: r.nd, lop_min: r.lop, thu_tu: r.tt})
             CREATE (d)-[:AP_DUNG_CHO]->(a) CREATE (d)-[:KET_LUAN]->(k)""",
          rows=[{"a": a, "k": k, "nd": nd, "lop": l, "tt": i} for i, (a, k, nd, l) in enumerate(DAU_HIEU)])
    s.run("""UNWIND $rows AS r MATCH (h:Hinh {id: r.h})
             CREATE (c:CongThuc {ten: r.ten, bieu_thuc: r.bt, lop_min: r.lop, thu_tu: r.tt}) CREATE (h)-[:CO_CONG_THUC]->(c)""",
          rows=[{"h": h, "ten": t, "bt": b, "lop": l, "tt": i} for i, (h, t, b, l) in enumerate(CONG_THUC)])
    n = s.run("MATCH (n) RETURN count(n) AS nodes").single()["nodes"]
    r = s.run("MATCH ()-[r]->() RETURN count(r) AS rels").single()["rels"]
    print(f"Đã nạp xong: {n} nút, {r} quan hệ.")
