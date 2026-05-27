import sqlite3
import base64
import os
from supabase import create_client

# Supabase config
SUPABASE_URL = 'https://rrjtfenhfkmkvgolwefi.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyanRmZW5oZmtta3Znb2x3ZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjIyMDYsImV4cCI6MjA5NTQzODIwNn0.5h2MKYxfoxwi8reZtgWLq9jjd-JDk3jUJ0RCxprstoA'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Connect to SQLite
db = sqlite3.connect(r'C:\Users\stara\Desktop\ant-arm\server\data\antarm.db')
db.row_factory = sqlite3.Row
products = db.execute('SELECT id, name, image FROM products WHERE image IS NOT NULL').fetchall()

for p in products:
    img_data = p['image']
    if not img_data or not img_data.startswith('data:image'):
        continue
    
    # Parse base64
    header, base64_data = img_data.split(',', 1)
    mime_type = header.split(';')[0].split(':')[1]
    ext = mime_type.split('/')[1]
    
    # Decode
    image_bytes = base64.b64decode(base64_data)
    
    # Upload to Supabase Storage
    file_name = f"product_{p['id']}.{ext}"
    try:
        result = supabase.storage.from_('products').upload(file_name, image_bytes, {
            'content-type': mime_type,
            'upsert': True
        })
        
        # Get public URL
        public_url = supabase.storage.from_('products').get_public_url(file_name)
        print(f"Uploaded {file_name}: {public_url}")
        
        # Update database
        db.execute("UPDATE products SET image = ? WHERE id = ?", (public_url, p['id']))
        db.commit()
        
    except Exception as e:
        print(f"Error uploading {file_name}: {e}")

db.close()
print("Done!")
