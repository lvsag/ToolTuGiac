"""Ứng dụng web hỗ trợ học tứ giác (Flask + Neo4j). Chạy: python app.py"""
import random
from flask import Flask, jsonify, render_template, request, abort
from repo import get_repo

app = Flask(__name__)
repo = get_repo()


def lop_arg():
    lop = request.args.get("lop", 8, type=int)
    if lop not in range(6, 13):
        abort(400, "Lớp phải từ 6 đến 12")
    return lop


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/info")
def info():
    return jsonify({"backend": repo.name})


@app.route("/api/hinh")
def hinh():
    return jsonify(repo.hinh_theo_lop(lop_arg()))


@app.route("/api/hinh/<hid>")
def the(hid):
    lop = lop_arg()
    if hid not in {h["id"] for h in repo.hinh_theo_lop(lop)}:
        abort(404, "Hình này chưa có ở lớp đã chọn")
    d = repo.the_kien_thuc(hid, lop)
    d["goi_y"] = repo.goi_y(hid, lop)
    if lop < 8:  # quan hệ bao hàm chỉ được học từ lớp 8
        d["cha"], d["con"] = [], []
    return jsonify(d)


@app.route("/api/so-do")
def so_do():
    lop = lop_arg()
    quan_he = repo.quan_he(lop) if lop >= 8 else []  # quan hệ bao hàm chỉ được học từ lớp 8
    return jsonify({"hinh": repo.hinh_theo_lop(lop), "quan_he": quan_he})


def to_tien(edges, hid):
    res, todo = {hid}, [hid]
    while todo:
        x = todo.pop()
        for e in edges:
            if e["con"] == x and e["cha"] not in res:
                res.add(e["cha"]); todo.append(e["cha"])
    return res


@app.route("/api/quiz")
def quiz():
    lop, n = lop_arg(), request.args.get("n", 5, type=int)
    hs = {h["id"]: h for h in repo.hinh_theo_lop(lop)}
    edges = repo.quan_he(lop)
    qs = []
    for h in hs.values():  # dạng 1: định nghĩa -> tên hình
        qs.append({"cau_hoi": f"Định nghĩa: \"{h['dinh_nghia']}\" là của hình nào?", "dap_an": h["id"], "loai": [h["id"]]})
    ct = repo.tat_ca_cong_thuc(lop)
    for c in ct:  # dạng 2: công thức duy nhất -> tên hình
        if c["hinh"] in hs and sum(1 for x in ct if x["ten"] == c["ten"] and x["bieu_thuc"] == c["bieu_thuc"]) == 1:
            qs.append({"cau_hoi": f"{c['ten']}: {c['bieu_thuc']} là công thức của hình nào?", "dap_an": c["hinh"], "loai": [c["hinh"]]})
    for d in repo.tat_ca_dau_hieu(lop):  # dạng 3: dấu hiệu -> kết luận (loại các hình cha ra khỏi đáp án nhiễu)
        if d["tu"] in hs and d["den"] in hs:
            qs.append({"cau_hoi": f"Một {d['tu_ten'].lower()} {d['noi_dung']}. Đó chắc chắn là hình gì?",
                       "dap_an": d["den"], "loai": list(to_tien(edges, d["den"]))})
    random.shuffle(qs)
    out = []
    for q in qs[:max(1, min(n, 20))]:
        pool = [i for i in hs if i not in q["loai"]]
        ids = random.sample(pool, min(3, len(pool))) + [q["dap_an"]]
        random.shuffle(ids)
        out.append({"cau_hoi": q["cau_hoi"], "lua_chon": [{"id": i, "ten": hs[i]["ten"]} for i in ids], "dap_an": q["dap_an"]})
    return jsonify(out)


if __name__ == "__main__":
    print(f"Nguồn dữ liệu: {repo.name}")
    app.run(debug=False, port=5000)
