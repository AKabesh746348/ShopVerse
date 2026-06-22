import os
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv

from pathlib import Path
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/ecommerce")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "your-super-secret-key")

mongo = PyMongo(app)

# Import and register blueprints
from routes.auth import auth_bp
from routes.products import products_bp
from routes.cart import cart_bp
from routes.orders import orders_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(products_bp, url_prefix="/api/products")
app.register_blueprint(cart_bp, url_prefix="/api/cart")
app.register_blueprint(orders_bp, url_prefix="/api/orders")


@app.route("/api/health", methods=["GET"])
def health_check():
    return {"status": "ok", "message": "E-Commerce API is running"}, 200


def seed_products():
    """Seed the database with sample products if empty."""
    with app.app_context():
        products_collection = mongo.db.products
        if products_collection.count_documents({}) == 0:
            sample_products = [
                {
                    "name": "Premium Wireless Headphones",
                    "price": 149.99,
                    "description": "High-fidelity sound with active noise cancellation. 30-hour battery life.",
                    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                    "category": "Electronics",
                    "rating": 4.8,
                    "stock": 50,
                },
                {
                    "name": "Minimalist Leather Watch",
                    "price": 229.99,
                    "description": "Handcrafted Italian leather band with sapphire crystal face.",
                    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
                    "category": "Accessories",
                    "rating": 4.9,
                    "stock": 30,
                },
                {
                    "name": "Organic Cotton T-Shirt",
                    "price": 39.99,
                    "description": "100% organic cotton, sustainably sourced. Ultra-soft comfort.",
                    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                    "category": "Clothing",
                    "rating": 4.5,
                    "stock": 100,
                },
                {
                    "name": "Smart Home Speaker",
                    "price": 89.99,
                    "description": "Voice-controlled speaker with rich 360° sound and smart home integration.",
                    "image": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
                    "category": "Electronics",
                    "rating": 4.6,
                    "stock": 75,
                },
                {
                    "name": "Designer Sunglasses",
                    "price": 179.99,
                    "description": "Polarized UV400 lenses with titanium frame. Lightweight and durable.",
                    "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
                    "category": "Accessories",
                    "rating": 4.7,
                    "stock": 40,
                },
                {
                    "name": "Running Shoes Pro",
                    "price": 129.99,
                    "description": "Engineered mesh upper with responsive cushioning for maximum performance.",
                    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
                    "category": "Footwear",
                    "rating": 4.8,
                    "stock": 60,
                },
                {
                    "name": "Ceramic Coffee Mug Set",
                    "price": 34.99,
                    "description": "Set of 4 handmade ceramic mugs. Microwave and dishwasher safe.",
                    "image": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
                    "category": "Home",
                    "rating": 4.4,
                    "stock": 80,
                },
                {
                    "name": "Leather Messenger Bag",
                    "price": 189.99,
                    "description": "Full-grain leather with padded laptop compartment. Vintage design.",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
                    "category": "Accessories",
                    "rating": 4.9,
                    "stock": 25,
                },
                {
                    "name": "Yoga Mat Premium",
                    "price": 59.99,
                    "description": "Extra thick, non-slip surface with alignment markers. Eco-friendly materials.",
                    "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
                    "category": "Fitness",
                    "rating": 4.6,
                    "stock": 90,
                },
                {
                    "name": "Stainless Steel Water Bottle",
                    "price": 29.99,
                    "description": "Double-wall vacuum insulated. Keeps drinks cold 24hrs or hot 12hrs.",
                    "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
                    "category": "Fitness",
                    "rating": 4.5,
                    "stock": 120,
                },
                {
                    "name": "Wireless Charging Pad",
                    "price": 44.99,
                    "description": "Fast 15W Qi wireless charger. Compatible with all Qi-enabled devices.",
                    "image": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
                    "category": "Electronics",
                    "rating": 4.3,
                    "stock": 65,
                },
                {
                    "name": "Scented Candle Collection",
                    "price": 49.99,
                    "description": "Set of 3 soy wax candles. Lavender, vanilla, and ocean breeze scents.",
                    "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400",
                    "category": "Home",
                    "rating": 4.7,
                    "stock": 55,
                },
            ]
            products_collection.insert_many(sample_products)
            print("✅ Database seeded with sample products!")


seed_products()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(debug=False, host="0.0.0.0", port=port)
