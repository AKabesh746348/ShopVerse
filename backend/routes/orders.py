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

    payment_method = data.get("paymentMethod", "cod")
    payment_id = data.get("paymentId")
    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_signature = data.get("razorpay_signature")

    if payment_method == "online":
        if not payment_id or not razorpay_order_id or not razorpay_signature:
             return jsonify({"error": "Payment verification failed: Missing details"}), 400
        
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        if not verify_razorpay_signature(params_dict):
             return jsonify({"error": "Payment verification failed: Invalid signature"}), 400

    order = {
        "user_id": user["user_id"],
        "items": order_items,
        "total": round(total, 2),
        "delivery": {
            "name": name,
            "address": address,
            "phone": phone,
        },
        "payment": {
            "method": payment_method,
            "transaction_id": payment_id,
            "razorpay_order_id": razorpay_order_id,
            "status": "paid" if payment_method == "online" else "pending"
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

    # Prepare order details for response
    response_order = {
        "order_id": str(result.inserted_id),
        "created_at": order["created_at"].isoformat(),
        "total": order["total"],
        "items": order["items"],
        "delivery": order["delivery"],
        "payment": order["payment"]
    }

    return jsonify({
        "message": "Order placed successfully!",
        "order": response_order, 
        "order_id": str(result.inserted_id), # Keep for backward compatibility if needed
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


@orders_bp.route("/razorpay-order", methods=["POST"])
def create_razorpay_order():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        import razorpay
        key_id = os.getenv("RAZORPAY_KEY_ID")
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")

        print(f"DEBUG: Key ID present: {bool(key_id)}")
        print(f"DEBUG: Key Secret present: {bool(key_secret)}")
        
        if not key_id or not key_secret:
             print("Error: Razorpay keys are missing from environment variables.")
             return jsonify({"error": "Server misconfiguration: Missing Payment Keys"}), 500

        client = razorpay.Client(auth=(key_id, key_secret))

        db = get_db()
        user_doc = db.users.find_one({"_id": ObjectId(user["user_id"])})
        cart = user_doc.get("cart", [])

        if not cart:
            return jsonify({"error": "Cart is empty"}), 400

        total = 0
        for item in cart:
            product = db.products.find_one({"_id": ObjectId(item["product_id"])})
            if product:
                total += product["price"] * item["quantity"]

        shipping = 0 if total > 100 else 9.99 # Logic should match frontend or be unified
        final_amount = total + shipping
        amount_in_paise = int(final_amount * 100)
        
        print(f"DEBUG: Creating order for amount: {amount_in_paise}")

        # Shorten receipt to < 40 chars. 
        # rcpt_ + last 6 of user_id + _ + timestamp 
        receipt_id = f"rcpt_{str(user['user_id'])[-6:]}_{int(datetime.datetime.utcnow().timestamp())}"
        data = { "amount": amount_in_paise, "currency": "INR", "receipt": receipt_id }
        payment = client.order.create(data=data)

        return jsonify({
            "order_id": payment["id"],
            "amount": payment["amount"],
            "currency": payment["currency"],
            "key": key_id,
            "name": "ShopVerse",
            "description": "Purchase Payment",
             "prefill": {
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "contact": user.get("phone", "") # Assuming phone is in user profile, otherwise empty
            }
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Razorpay Detailed Error: {str(e)}")
        return jsonify({"error": f"Payment initialization failed: {str(e)}"}), 500


def verify_razorpay_signature(params):
    import razorpay
    client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))
    try:
        client.utility.verify_payment_signature(params)
        return True
    except Exception:
        return False

