from flask import Blueprint, request, jsonify
from bson import ObjectId

products_bp = Blueprint("products", __name__)


def get_db():
    from app import mongo
    return mongo.db


@products_bp.route("/", methods=["GET"])
def get_products():
    db = get_db()
    category = request.args.get("category")
    search = request.args.get("search")

    query = {}
    if category:
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    products = list(db.products.find(query))
    for product in products:
        product["_id"] = str(product["_id"])

    return jsonify({"products": products}), 200


@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    db = get_db()
    try:
        product = db.products.find_one({"_id": ObjectId(product_id)})
    except Exception:
        return jsonify({"error": "Invalid product ID"}), 400

    if not product:
        return jsonify({"error": "Product not found"}), 404

    product["_id"] = str(product["_id"])
    return jsonify({"product": product}), 200


@products_bp.route("/categories", methods=["GET"])
def get_categories():
    db = get_db()
    categories = db.products.distinct("category")
    return jsonify({"categories": categories}), 200
