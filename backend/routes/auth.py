from flask import Blueprint, request, jsonify
from bson import ObjectId
import bcrypt
import jwt
import datetime
import os

auth_bp = Blueprint("auth", __name__)


def get_db():
    from app import mongo
    return mongo.db


def generate_token(user_id, name):
    payload = {
        "user_id": str(user_id),
        "name": name,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    token = jwt.encode(payload, os.getenv("SECRET_KEY", "your-super-secret-key"), algorithm="HS256")
    return token


def decode_token(token):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY", "your-super-secret-key"), algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    db = get_db()
    existing_user = db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "cart": [],
        "created_at": datetime.datetime.utcnow(),
    }
    result = db.users.insert_one(user)
    token = generate_token(result.inserted_id, name)

    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": {"id": str(result.inserted_id), "name": name, "email": email},
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    user = db.users.find_one({"email": email})

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(user["_id"], user["name"])

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]},
    }), 200


@auth_bp.route("/me", methods=["GET"])
def get_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    payload = decode_token(token)

    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    db = get_db()
    user = db.users.find_one({"_id": ObjectId(payload["user_id"])})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
        }
    }), 200
