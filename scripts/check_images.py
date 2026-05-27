import sqlite3

db = sqlite3.connect(r'C:\Users\stara\Desktop\ant-arm\server\data\antarm.db')
db.row_factory = sqlite3.Row
products = db.execute('SELECT id, name, image FROM products WHERE image IS NOT NULL').fetchall()
for p in products:
    img = p['image']
    if img and img.startswith('data:image'):
        size = len(img)
        print(f'Product {p["id"]} ({p["name"]}): {size} chars')
    else:
        print(f'Product {p["id"]} ({p["name"]}): no image or not base64')
db.close()
