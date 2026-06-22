import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/actions/cartActions";
import { checkout, clearOrderSuccess } from "../redux/actions/orderActions";
import { logout } from "../redux/actions/authActions";
import {
    ShoppingBagIcon, ShoppingCartIcon, LogOutIcon,
    PackageIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, FileTextIcon, ShieldIcon
} from "../components/Icons";
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
    "Manipur": ["Imphal"], "Meghalaya": ["Shillong"], "Mizoram": ["Aizawl"],
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
    "Andaman and Nicobar Islands": ["Port Blair"], "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Delhi": ["Delhi", "New Delhi"], "Jammu and Kashmir": ["Srinagar", "Jammu"],
    "Ladakh": ["Leh", "Kargil"], "Lakshadweep": ["Kavaratti"], "Puducherry": ["Puducherry"]
};

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { loading, error, orderSuccess } = useSelector((state) => state.orders);

    const [paymentMethod, setPaymentMethod] = useState("online");
    const [form, setForm] = useState({
        name: user?.name || "", phone: "", address: "", city: "", state: "", zip: "",
    });

    useEffect(() => {
        if (!loading && cartItems.length === 0 && !orderSuccess) navigate("/shop");
    }, [cartItems, loading, navigate, orderSuccess]);

    useEffect(() => {
        dispatch(fetchCart());
        return () => dispatch(clearOrderSuccess());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(name === "state" ? { ...form, state: value, city: "" } : { ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullAddress = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;

        const processCheckout = async (paymentId = null, razorpayOrderId = null, razorpaySignature = null) => {
            await dispatch(checkout({ name: form.name, phone: form.phone, address: fullAddress, paymentMethod, paymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: razorpaySignature }));
        };

        if (paymentMethod === "online") {
            try {
                const response = await fetch("http://localhost:5001/api/orders/razorpay-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (!response.ok) { const e = await response.json(); alert(e.error || "Failed to initiate payment"); return; }
                const orderData = await response.json();
                const options = {
                    key: orderData.key, amount: orderData.amount, currency: orderData.currency,
                    name: orderData.name, description: orderData.description, image: logo,
                    order_id: orderData.order_id,
                    handler: (r) => processCheckout(r.razorpay_payment_id, r.razorpay_order_id, r.razorpay_signature),
                    prefill: orderData.prefill, theme: { color: "#6366f1" }
                };
                if (window.Razorpay) {
                    const rzp = new window.Razorpay(options);
                    rzp.on("payment.failed", (r) => alert("Payment Failed: " + r.error.description));
                    rzp.open();
                } else { alert("Razorpay SDK failed to load."); }
            } catch (err) { console.error("Payment Error:", err); alert("An error occurred while setting up payment."); }
        } else { processCheckout(); }
    };

    const handleLogout = () => { dispatch(logout()); navigate("/"); };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 49;
    const total = subtotal + shipping;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const currentCities = citiesByState[form.state] || [];

    if (orderSuccess) {
        return (
            <div className="checkout-page">
                <nav className="landing-navbar">
                    <Link to="/shop" className="nav-brand">
                        <div className="brand-icon"><ShoppingBagIcon size={20} /></div>
                        <span>ShopVerse</span>
                    </Link>
                    <div className="nav-actions">
                        <div className="nav-user">
                            <div className="user-avatar">{userInitial}</div>
                            <div className="user-info"><span className="user-name">{user?.name}</span></div>
                        </div>
                    </div>
                </nav>
                <div className="order-success-overlay">
                    <div className="order-success-modal">
                        <div className="success-icon"><CheckCircleIcon size={40} /></div>
                        <h3>Order Placed!</h3>
                        <p>Thank you, <strong>{user?.name}</strong>! Your order is confirmed.</p>
                        <div className="order-id-badge">Order #{orderSuccess.order_id?.slice(-8).toUpperCase()}</div>
                        <p className="order-total">Total: <strong>₹{orderSuccess.total?.toFixed(0)}</strong></p>
                        <div className="success-actions">
                            <button className="btn-download-receipt" onClick={() => {
                                const order = orderSuccess.order;
                                if (!order) return;
                                const content = `SHOPVERSE RECEIPT\n------------------\nOrder ID: ${order.order_id}\nDate: ${new Date(order.created_at).toLocaleString()}\n\nCustomer:\n${order.delivery.name}\n${order.delivery.phone}\n${order.delivery.address}\n\nItems:\n${order.items.map(i => `- ${i.name} x${i.quantity} = ₹${i.item_total}`).join('\n')}\n\n------------------\nTotal: ₹${order.total}\nPayment: ${order.payment.method.toUpperCase()}\nStatus: ${order.payment.status.toUpperCase()}\n------------------\nThank you for shopping with ShopVerse!`;
                                const blob = new Blob([content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url; a.download = `ShopVerse_Receipt_${order.order_id.slice(-6)}.txt`; a.click();
                                URL.revokeObjectURL(url);
                            }}>
                                <FileTextIcon size={16} /> Download Receipt
                            </button>
                            <Link to="/shop" className="btn-back-shop">
                                Continue Shopping <ArrowRightIcon size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <nav className="landing-navbar">
                <Link to="/shop" className="nav-brand">
                    <div className="brand-icon"><ShoppingBagIcon size={20} /></div>
                    <span>ShopVerse</span>
                </Link>
                <div className="nav-actions">
                    <div className="nav-user">
                        <div className="user-avatar">{userInitial}</div>
                        <div className="user-info">
                            <span className="user-greeting">Hello,</span>
                            <span className="user-name">{user?.name || "Guest"}</span>
                        </div>
                    </div>
                    <Link to="/cart" className="nav-cart">
                        <ShoppingCartIcon size={20} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        <div className="cart-info">
                            <span className="cart-label">Cart</span>
                            <span className="cart-total">₹{total.toFixed(0)}</span>
                        </div>
                    </Link>
                    <button className="btn-logout" onClick={handleLogout} title="Logout">
                        <LogOutIcon size={16} /><span>Logout</span>
                    </button>
                </div>
            </nav>

            <div className="checkout-content">
                <div className="checkout-header">
                    <Link to="/cart" className="btn-back"><ArrowLeftIcon size={18} /></Link>
                    <div className="checkout-breadcrumb">
                        <span className="bc-done">Cart</span>
                        <span className="bc-sep">›</span>
                        <span className="bc-active">Details</span>
                        <span className="bc-sep">›</span>
                        <span className="bc-future">Payment</span>
                    </div>
                </div>

                <div className="checkout-layout">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="section-title">
                                <div className="section-icon"><PackageIcon size={16} /></div>
                                Delivery Information
                            </div>
                            {error && <div className="checkout-error">{error}</div>}

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Street Address</label>
                                <textarea name="address" placeholder="House/flat no., street, locality" value={form.address} onChange={handleChange} required />
                            </div>

                            <div className="form-grid-3">
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" name="state" placeholder="Select state" value={form.state} onChange={handleChange} required list="state-suggestions" />
                                    <datalist id="state-suggestions">
                                        {indianStates.map((s, i) => <option key={i} value={s} />)}
                                    </datalist>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" placeholder={currentCities.length > 0 ? "Select city" : "Choose state first"} value={form.city} onChange={handleChange} required list="city-suggestions" disabled={currentCities.length === 0} />
                                    <datalist id="city-suggestions">
                                        {currentCities.map((c, i) => <option key={i} value={c} />)}
                                    </datalist>
                                </div>
                                <div className="form-group">
                                    <label>PIN Code</label>
                                    <input type="text" name="zip" placeholder="6-digit PIN" value={form.zip} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="section-title">
                                <div className="section-icon"><ShieldIcon size={16} /></div>
                                Payment Method
                            </div>
                            <div className="payment-options">
                                <div className={`payment-card ${paymentMethod === "online" ? "active" : ""}`} onClick={() => setPaymentMethod("online")}>
                                    <div className="radio-dot" />
                                    <div className="payment-card-content">
                                        <span className="payment-card-title">Online Payment</span>
                                        <span className="payment-card-sub">UPI, Cards, Net Banking via Razorpay</span>
                                    </div>
                                </div>
                                <div className={`payment-card ${paymentMethod === "cod" ? "active" : ""}`} onClick={() => setPaymentMethod("cod")}>
                                    <div className="radio-dot" />
                                    <div className="payment-card-content">
                                        <span className="payment-card-title">Cash on Delivery</span>
                                        <span className="payment-card-sub">Pay when your order arrives</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="checkout-summary">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {cartItems.map((item) => (
                                    <div key={item.product_id} className="summary-item">
                                        <div className="item-thumb">
                                            <img src={item.image} alt={item.name} />
                                            <span className="item-qty-badge">{item.quantity}</span>
                                        </div>
                                        <div className="item-details">
                                            <div className="item-name">{item.name}</div>
                                        </div>
                                        <span className="item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "free" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                                </div>
                            </div>
                            <div className="summary-total">
                                <span>Total</span><span>₹{total.toFixed(0)}</span>
                            </div>
                            <button type="button" className={`btn-place-order ${loading ? "loading" : ""}`} onClick={handleSubmit} disabled={loading || cartItems.length === 0}>
                                {loading ? (
                                    <><span className="spinner" /> Processing...</>
                                ) : paymentMethod === "online" ? (
                                    <>Pay ₹{total.toFixed(0)} <ArrowRightIcon size={16} /></>
                                ) : (
                                    <>Place Order <ArrowRightIcon size={16} /></>
                                )}
                            </button>
                            <div className="summary-secure">
                                <ShieldIcon size={13} /> Secured by 256-bit SSL encryption
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
