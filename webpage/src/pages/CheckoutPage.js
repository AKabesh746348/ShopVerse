import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/actions/cartActions";
import { checkout, clearOrderSuccess } from "../redux/actions/orderActions";
import { logout } from "../redux/actions/authActions";
import "../styles/pages/Landing.scss";
import "../styles/pages/Checkout.scss";
const logo = require("../assets/logo.png");

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { loading, error, orderSuccess } = useSelector((state) => state.orders);

    const [form, setForm] = useState({
        name: user?.name || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });

    useEffect(() => {
        dispatch(fetchCart());
        return () => dispatch(clearOrderSuccess());
    }, [dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullAddress = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
        const result = await dispatch(
            checkout({
                name: form.name,
                phone: form.phone,
                address: fullAddress,
            })
        );
        if (result.success) {
            // stays on page to show success modal
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (orderSuccess) {
        return (
            <div className="checkout-page">
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
                            <span className="user-name">{user?.name}</span>
                        </div>
                    </div>
                </nav>
                <div className="order-success-overlay">
                    <div className="order-success-modal">
                        <div className="success-icon">✅</div>
                        <h3>Order Placed Successfully!</h3>
                        <p>Thank you for your purchase, {user?.name}!</p>
                        <div className="order-id">Order #{orderSuccess.order_id?.slice(-8)}</div>
                        <p>Total: <strong>₹{orderSuccess.total?.toFixed(2)}</strong></p>
                        <Link to="/shop" className="btn-back-shop">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
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

            <div className="checkout-content">
                <div className="checkout-header">
                    <Link to="/cart" className="btn-back">
                        ←
                    </Link>
                    <h2>Checkout</h2>
                </div>

                <div className="checkout-layout">
                    {/* Delivery Form */}
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-icon">📦</span>
                                Delivery Information
                            </div>

                            {error && <div className="checkout-error">{error}</div>}

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Street Address</label>
                                <textarea
                                    name="address"
                                    placeholder="Enter your full address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={form.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>ZIP Code</label>
                                <input
                                    type="text"
                                    name="zip"
                                    placeholder="ZIP Code"
                                    value={form.zip}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </form>

                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <div className="summary-card">
                            <h3>Order Summary</h3>

                            <div className="summary-items">
                                {cartItems.map((item) => (
                                    <div key={item.product_id} className="summary-item">
                                        <div className="item-thumb">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="item-details">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-qty">Qty: {item.quantity}</div>
                                        </div>
                                        <span className="item-price">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

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
                            <div className="summary-row total">
                                <span className="label">Total</span>
                                <span className="value">₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                type="button"
                                className={`btn-place-order ${loading ? "loading" : ""}`}
                                onClick={handleSubmit}
                                disabled={loading || cartItems.length === 0}
                            >
                                {loading ? "Processing..." : `Place Order — ₹${total.toFixed(2)}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
