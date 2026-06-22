import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../redux/actions/cartActions";
import { logout } from "../redux/actions/authActions";
import {
    ShoppingBagIcon, ShoppingCartIcon, LogOutIcon,
    PlusIcon, MinusIcon, XIcon, ArrowLeftIcon, ArrowRightIcon, PackageIcon
} from "../components/Icons";
import "../styles/pages/Landing.scss";
import "../styles/pages/Cart.scss";

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
    const shipping = subtotal > 999 ? 0 : 49;
    const total = subtotal + shipping;
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="cart-page">
            {/* Navbar */}
            <nav className="landing-navbar">
                <Link to="/shop" className="nav-brand">
                    <div className="brand-icon">
                        <ShoppingBagIcon size={20} />
                    </div>
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
                        <LogOutIcon size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            <div className="cart-content">
                <div className="cart-header">
                    <div className="cart-header-left">
                        <Link to="/shop" className="btn-back-shop">
                            <ArrowLeftIcon size={16} /> Continue Shopping
                        </Link>
                        <h2>
                            Shopping Cart
                            <span className="cart-count-label">({cartCount} {cartCount === 1 ? "item" : "items"})</span>
                        </h2>
                    </div>
                </div>

                {loading ? (
                    <div className="cart-loading">
                        <div className="loading-spinner" />
                        <span>Loading your cart...</span>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <PackageIcon size={64} className="empty-icon" />
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven't added anything yet. Start shopping!</p>
                        <Link to="/shop" className="btn-start-shopping">
                            Browse Products <ArrowRightIcon size={16} />
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
                                        <span className="item-unit-price">₹{item.price.toFixed(0)} each</span>
                                    </div>
                                    <div className="item-quantity">
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item.product_id, item.quantity, -1)}
                                        >
                                            <MinusIcon size={14} />
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item.product_id, item.quantity, 1)}
                                        >
                                            <PlusIcon size={14} />
                                        </button>
                                    </div>
                                    <span className="item-total">
                                        ₹{(item.price * item.quantity).toFixed(0)}
                                    </span>
                                    <button
                                        className="item-remove"
                                        onClick={() => handleRemove(item.product_id)}
                                        aria-label="Remove item"
                                    >
                                        <XIcon size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Order Summary</h3>

                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>₹{subtotal.toFixed(0)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "free" : ""}>
                                        {shipping === 0 ? "Free" : `₹${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <div className="summary-note">
                                        Add ₹{(999 - subtotal).toFixed(0)} more for free shipping
                                    </div>
                                )}
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{total.toFixed(0)}</span>
                            </div>

                            <button
                                className="btn-checkout"
                                onClick={() => navigate("/checkout")}
                            >
                                Proceed to Checkout <ArrowRightIcon size={16} />
                            </button>

                            <div className="summary-trust">
                                <span>🔒 Secure checkout</span>
                                <span>·</span>
                                <span>Easy returns</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
