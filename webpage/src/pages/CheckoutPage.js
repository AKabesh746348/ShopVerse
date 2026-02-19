import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/actions/cartActions";
import { checkout, clearOrderSuccess } from "../redux/actions/orderActions";
import { logout } from "../redux/actions/authActions";
import "../styles/pages/Landing.scss";
import "../styles/pages/Checkout.scss";
const logo = require("../assets/logo.png");

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
    "Lakshadweep", "Puducherry"
];

const citiesByState = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Solan", "Mandi"],
    "Jharkhand": ["Dhanbad", "Ranchi", "Jamshedpur", "Bokaro", "Hazaribagh", "Deoghar"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kannur", "Kollam"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Navi Mumbai", "Amravati", "Jalgaon", "Akola", "Latur"],
    "Manipur": ["Imphal"],
    "Meghalaya": ["Shillong"],
    "Mizoram": ["Aizawl"],
    "Nagaland": ["Kohima", "Dimapur"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar"],
    "Sikkim": ["Gangtok"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Tirunelveli", "Thoothukudi"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam"],
    "Tripura": ["Agartala"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Noida", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Delhi": ["Delhi", "New Delhi"],
    "Jammu and Kashmir": ["Srinagar", "Jammu"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti"],
    "Puducherry": ["Puducherry"]
};

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { loading, error, orderSuccess } = useSelector((state) => state.orders);

    const [paymentMethod, setPaymentMethod] = useState("online");
    const [form, setForm] = useState({
        name: user?.name || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });

    useEffect(() => {
        if (!loading && cartItems.length === 0 && !orderSuccess) {
            navigate("/shop");
        }
    }, [cartItems, loading, navigate, orderSuccess]);

    useEffect(() => {
        dispatch(fetchCart());
        return () => dispatch(clearOrderSuccess());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "state") {
            setForm({ ...form, state: value, city: "" });
        } else {
            setForm({ ...form, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullAddress = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;

        const processCheckout = async (paymentId = null, razorpayOrderId = null, razorpaySignature = null) => {
            const result = await dispatch(
                checkout({
                    name: form.name,
                    phone: form.phone,
                    address: fullAddress,
                    paymentMethod,
                    paymentId,
                    razorpay_order_id: razorpayOrderId,
                    razorpay_signature: razorpaySignature
                })
            );
            if (result.success) {
                // Success modal handles navigation
            }
        };

        if (paymentMethod === "online") {
            try {
                // 1. Create Order on Server
                const response = await fetch("http://localhost:5001/api/orders/razorpay-order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}` // Assuming token is here
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error || "Failed to initiate payment");
                    return;
                }

                const orderData = await response.json();

                const options = {
                    key: orderData.key,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: orderData.name,
                    description: orderData.description,
                    image: logo,
                    order_id: orderData.order_id,
                    handler: function (response) {
                        // 2. Verify Payment on Server
                        processCheckout(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature
                        );
                    },
                    prefill: orderData.prefill,
                    theme: {
                        color: "#6c5ce7"
                    }
                };

                if (window.Razorpay) {
                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        alert("Payment Failed: " + response.error.description);
                    });
                    rzp.open();
                } else {
                    alert("Razorpay SDK failed to load. Please check your internet connection.");
                }
            } catch (err) {
                console.error("Payment Error:", err);
                alert("An error occurred while setting up payment.");
            }
        } else {
            // Cash on Delivery
            processCheckout();
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
    const currentCities = citiesByState[form.state] || [];

    if (orderSuccess) {
        return (
            <div className="checkout-page">
                <nav className="landing-navbar">
                    <Link to="/shop" className="nav-brand">
                        <div className="brand-icon">🛍️</div>
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

                        <div className="success-actions">
                            <button className="btn-download-receipt" onClick={() => {
                                const order = orderSuccess.order;
                                if (!order) return;

                                const receiptContent = `SHOPVERSE RECEIPT\n------------------\nOrder ID: ${order.order_id}\nDate: ${new Date(order.created_at).toLocaleString()}\n\nCustomer:\n${order.delivery.name}\n${order.delivery.phone}\n${order.delivery.address}\n\nItems:\n${order.items.map(item => `- ${item.name} x${item.quantity} = ₹${item.item_total}`).join('\n')}\n\n------------------\nTotal Amount: ₹${order.total}\nPayment Method: ${order.payment.method.toUpperCase()}\nStatus: ${order.payment.status.toUpperCase()}\n------------------\nThank you for shopping with ShopVerse!`;

                                const blob = new Blob([receiptContent], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `ShopVerse_Receipt_${order.order_id.slice(-6)}.txt`;
                                a.click();
                                window.URL.revokeObjectURL(url);
                            }}>
                                📄 Download Receipt
                            </button>
                            <Link to="/shop" className="btn-back-shop">
                                Continue Shopping
                            </Link>
                        </div>
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
                    <div className="brand-icon">🛍️</div>
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
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="Select State"
                                        value={form.state}
                                        onChange={handleChange}
                                        required
                                        list="state-suggestions"
                                    />
                                    <datalist id="state-suggestions">
                                        {indianStates.map((state, index) => (
                                            <option key={index} value={state} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder={currentCities.length > 0 ? "Select City" : "Select State first"}
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        list="city-suggestions"
                                        disabled={currentCities.length === 0}
                                        title={currentCities.length === 0 ? "Please select a valid state first" : "Select your city"}
                                        style={{ cursor: currentCities.length === 0 ? 'not-allowed' : 'text', opacity: currentCities.length === 0 ? 0.7 : 1 }}
                                    />
                                    <datalist id="city-suggestions">
                                        {currentCities.map((city, index) => (
                                            <option key={index} value={city} />
                                        ))}
                                    </datalist>
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
                            <div className="form-group">
                                <label>Payment Method</label>
                                <div className="payment-options">
                                    <div
                                        className={`payment-card ${paymentMethod === "online" ? "active" : ""}`}
                                        onClick={() => setPaymentMethod("online")}
                                    >
                                        <div className="radio-circle"></div>
                                        <span>Online Payment (Razorpay)</span>
                                    </div>
                                    <div
                                        className={`payment-card ${paymentMethod === "cod" ? "active" : ""}`}
                                        onClick={() => setPaymentMethod("cod")}
                                    >
                                        <div className="radio-circle"></div>
                                        <span>Cash on Delivery</span>
                                    </div>
                                </div>
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
                                {loading ? "Processing..." : (
                                    paymentMethod === "online" ? `Pay Now — ₹${total.toFixed(2)}` :
                                        `Place Order — ₹${total.toFixed(2)}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
