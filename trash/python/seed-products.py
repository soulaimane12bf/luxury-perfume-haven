import requests
import json
import random
import time

API_URL = "https://luxury-perfume-haven.vercel.app/api"
USERNAME = "admin"
PASSWORD = "admintest"

# Login to get token
print("🔐 Logging in...")
login_response = requests.post(f"{API_URL}/auth/login", json={
    "username": USERNAME,
    "password": PASSWORD
})

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

TOKEN = login_response.json().get("token")
headers = {"Authorization": f"Bearer {TOKEN}"}

print("✅ Logged in successfully!")

# Get all categories
print("\n📦 Fetching categories...")
categories_response = requests.get(f"{API_URL}/categories")
categories = categories_response.json()

print(f"Found {len(categories)} categories:")
for cat in categories:
    print(f"  - {cat['name']} ({cat['slug']})")

# Product generation data
brands = ['لوكسوري', 'بريميوم', 'إيليت', 'رويال', 'كلاسيك', 'مودرن', 'فينتاج', 'أرتيزان']
types = ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Cologne']
sizes = ['50ml', '75ml', '100ml', '125ml', '150ml']

def generate_product(category, index):
    base_price = random.randint(100, 600)
    has_discount = random.random() > 0.6
    old_price = int(base_price * 1.3) if has_discount else None
    is_best_selling = random.random() > 0.85
    
    return {
        "name": f"{category['name']} {random.choice(brands)} {index}",
        "brand": random.choice(brands),
        "price": base_price,
        "old_price": old_price,
        "category": category['slug'],
        "type": random.choice(types),
        "size": random.choice(sizes),
        "description": f"منتج فاخر من فئة {category['name']} - جودة عالية ورائحة مميزة تدوم طويلاً.",
        "notes": {
            "top": ['برغموت', 'ليمون', 'نعناع'],
            "heart": ['ورد', 'ياسمين', 'لافندر'],
            "base": ['عنبر', 'مسك', 'خشب الصندل']
        },
        "image_urls": [
            'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500'
        ],
        "stock": random.randint(10, 100),
        "rating": round(random.uniform(3.0, 5.0), 1),
        "reviewCount": random.randint(0, 200),
        "best_selling": is_best_selling
    }

# Add products to each category
total_created = 0
total_failed = 0

for category in categories:
    print(f"\n🔄 Adding 20 products to {category['name']}...")
    
    for i in range(1, 21):
        product = generate_product(category, i)
        
        try:
            response = requests.post(
                f"{API_URL}/products",
                headers=headers,
                json=product
            )
            
            if response.status_code == 201:
                total_created += 1
                print(f"  ✅ Created product {i}/20 - {product['name']}")
            else:
                total_failed += 1
                print(f"  ❌ Failed to create product {i}/20: {response.text}")
        except Exception as e:
            total_failed += 1
            print(f"  ❌ Error creating product {i}/20: {e}")
        
        # Small delay to avoid rate limiting
        time.sleep(0.2)

print(f"\n✅ Done! Created {total_created} products, {total_failed} failed")
print(f"📊 Total products: {total_created}/{len(categories) * 20}")
