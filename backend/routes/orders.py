from flask import Blueprint, request, jsonify
from bson import ObjectId
import jwt
import os
import datetime

orders_bp = Blueprint("orders", __name__)


def get_db():
    from app import mongo
    return mongo.db


def get_user_from_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY", "your-super-secret-key"), algorithms=["HS256"])
        return payload
    except Exception:
        return None


@orders_bp.route("/checkout", methods=["POST"])
def checkout():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    name = data.get("name")
    address = data.get("address")
    phone = data.get("phone")

    if not name or not address or not phone:
        return jsonify({"error": "Name, address, and phone are required"}), 400

    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user["user_id"])})
    cart = user_doc.get("cart", [])

    if not cart:
        return jsonify({"error": "Cart is empty"}), 400

    # Build order items with product details
    order_items = []
    total = 0
    for item in cart:
        product = db.products.find_one({"_id": ObjectId(item["product_id"])})
        if product:
            item_total = product["price"] * item["quantity"]
            total += item_total
            order_items.append({
                "product_id": str(product["_id"]),
                "name": product["name"],
                "price": product["price"],
                "quantity": item["quantity"],
                "item_total": item_total,
            })

    order = {
        "user_id": user["user_id"],
        "items": order_items,
        "total": round(total, 2),
        "delivery": {
            "name": name,
            "address": address,
            "phone": phone,
        },
        "status": "confirmed",
        "created_at": datetime.datetime.utcnow(),
    }

    result = db.orders.insert_one(order)

    # Clear cart after order
    db.users.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$set": {"cart": []}}
    )

    return jsonify({
        "message": "Order placed successfully!",
        "order_id": str(result.inserted_id),
        "total": round(total, 2),
    }), 201


@orders_bp.route("/", methods=["GET"])
def get_orders():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_db()
    orders = list(db.orders.find({"user_id": user["user_id"]}).sort("created_at", -1))
    for order in orders:
        order["_id"] = str(order["_id"])
        order["created_at"] = order["created_at"].isoformat()

    return jsonify({"orders": orders}), 200
