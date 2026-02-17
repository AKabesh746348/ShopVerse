from flask import Blueprint, request, jsonify
from bson import ObjectId
import jwt
import os

cart_bp = Blueprint("cart", __name__)


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


@cart_bp.route("/", methods=["GET"])
def get_cart():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user["user_id"])})
    if not user_doc:
        return jsonify({"error": "User not found"}), 404

    cart = user_doc.get("cart", [])
    # Populate product details
    populated_cart = []
    for item in cart:
        try:
            product = db.products.find_one({"_id": ObjectId(item["product_id"])})
            if product:
                populated_cart.append({
                    "product_id": str(product["_id"]),
                    "name": product["name"],
                    "price": product["price"],
                    "image": product["image"],
                    "quantity": item["quantity"],
                })
        except Exception:
            continue

    return jsonify({"cart": populated_cart}), 200


@cart_bp.route("/add", methods=["POST"])
def add_to_cart():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    db = get_db()
    # Check if product exists
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        return jsonify({"error": "Product not found"}), 404

    user_doc = db.users.find_one({"_id": ObjectId(user["user_id"])})
    cart = user_doc.get("cart", [])

    # Check if product already in cart
    found = False
    for item in cart:
        if item["product_id"] == product_id:
            item["quantity"] += quantity
            found = True
            break

    if not found:
        cart.append({"product_id": product_id, "quantity": quantity})

    db.users.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$set": {"cart": cart}}
    )

    return jsonify({"message": "Product added to cart", "cart_count": len(cart)}), 200


@cart_bp.route("/update", methods=["PUT"])
def update_cart_item():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or quantity is None:
        return jsonify({"error": "Product ID and quantity are required"}), 400

    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user["user_id"])})
    cart = user_doc.get("cart", [])

    if quantity <= 0:
        cart = [item for item in cart if item["product_id"] != product_id]
    else:
        for item in cart:
            if item["product_id"] == product_id:
                item["quantity"] = quantity
                break

    db.users.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$set": {"cart": cart}}
    )

    return jsonify({"message": "Cart updated"}), 200


@cart_bp.route("/remove", methods=["DELETE"])
def remove_from_cart():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user["user_id"])})
    cart = user_doc.get("cart", [])
    cart = [item for item in cart if item["product_id"] != product_id]

    db.users.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$set": {"cart": cart}}
    )

    return jsonify({"message": "Product removed from cart"}), 200


@cart_bp.route("/clear", methods=["DELETE"])
def clear_cart():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_db()
    db.users.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$set": {"cart": []}}
    )

    return jsonify({"message": "Cart cleared"}), 200
