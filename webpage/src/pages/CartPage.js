import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../redux/actions/cartActions";
import { logout } from "../redux/actions/authActions";
import "../styles/pages/Landing.scss";
import "../styles/pages/Cart.scss";
const logo = require("../assets/logo.png");

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: cartItems, loading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleQuantityChange = (productId, currentQty, change) => {
        const newQty = currentQty + change;
        if (newQty <= 0) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateCartItem(productId, newQty));
        }
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="cart-page">
            {/* Navbar */}
            <nav className="landing-navbar">
                <Link to="/shop" className="nav-brand">
                    <div className="brand-icon">
                        <img src={logo} alt="ShopVerse" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <span>ShopVerse</span>
                </Link>

                <div className="nav-actions">
                    <div className="nav-user">
                        <div className="user-avatar">{userInitial}</div>
                        <span className="user-name">{user?.name || "Guest"}</span>
                    </div>

                    <Link to="/cart" className="nav-cart">
                        <span className="cart-icon">🛒</span>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="cart-content">
                <div className="cart-header">
                    <h2>
                        Shopping Cart
                        <span className="cart-count">({cartCount} items)</span>
                    </h2>
                    <Link to="/shop" className="btn-continue">
                        ← Continue Shopping
                    </Link>
                </div>

                {loading ? (
                    <div className="products-loading" style={{ padding: "80px 0" }}>
                        <div className="loading-spinner"></div>
                        Loading your cart...
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <div className="empty-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven't added anything yet</p>
                        <Link to="/shop" className="btn-shop">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.product_id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-info">
                                        <h4 className="item-name">{item.name}</h4>
                                        <span className="item-price">₹{item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="item-quantity">
                                        <button onClick={() => handleQuantityChange(item.product_id, item.quantity, -1)}>
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.product_id, item.quantity, 1)}>
                                            +
                                        </button>
                                    </div>
                                    <span className="item-total">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                    <button className="item-remove" onClick={() => handleRemove(item.product_id)}>
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span className="label">Subtotal</span>
                                <span className="value">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Shipping</span>
                                <span className="value">
                                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <div className="summary-row">
                                    <span className="label" style={{ fontSize: "0.8rem", color: "#6c5ce7" }}>
                                        Free shipping on orders over ₹100
                                    </span>
                                </div>
                            )}
                            <div className="summary-row total">
                                <span className="label">Total</span>
                                <span className="value">₹{total.toFixed(2)}</span>
                            </div>
                            <button
                                className="btn-checkout"
                                onClick={() => navigate("/checkout")}
                            >
                                Proceed to Checkout →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
