import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories, setCategoryFilter, setSearchQuery } from "../redux/actions/productActions";
import { addToCart, fetchCart } from "../redux/actions/cartActions";
import { logout } from "../redux/actions/authActions";
import "../styles/pages/Landing.scss";

const LandingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, categories, selectedCategory, searchQuery, loading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.cart);
    const [addedProduct, setAddedProduct] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        dispatch(fetchProducts(selectedCategory, searchQuery));
        dispatch(fetchCategories());
        dispatch(fetchCart());
    }, [dispatch, selectedCategory, searchQuery]);

    const handleCategoryChange = (category) => {
        dispatch(setCategoryFilter(category));
    };

    const handleSearch = useCallback(() => {
        dispatch(setSearchQuery(searchInput));
    }, [dispatch, searchInput]);

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleAddToCart = async (productId) => {
        await dispatch(addToCart(productId));
        setAddedProduct(productId);
        setTimeout(() => setAddedProduct(null), 1500);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-navbar">
                <Link to="/shop" className="nav-brand">
                    <div className="brand-icon">🛍️</div>
                    <span>ShopVerse</span>
                </Link>

                <div className="nav-search">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                </div>

                <div className="nav-actions">
                    <div className="nav-user">
                        <div className="user-avatar">{userInitial}</div>
                        <span className="user-name">{user?.name || "Guest"}</span>
                    </div>

                    <Link to="/cart" className="nav-cart">
                        <span className="cart-icon">🛒</span>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        <span className="cart-total">₹{cartTotal.toFixed(2)}</span>
                    </Link>

                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="category-bar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Products */}
            <section className="products-section">
                <div className="products-header">
                    <h2>
                        {selectedCategory === "All" ? "All Products" : selectedCategory}
                    </h2>
                    <span className="products-count">{products.length} products</span>
                </div>

                <div className="products-grid">
                    {loading ? (
                        <div className="products-loading">
                            <div className="loading-spinner"></div>
                            Loading amazing products...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="no-products">
                            <div className="empty-icon">📦</div>
                            <p>No products found. Try a different search or category.</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className={`product-card ${addedProduct === product._id ? "added-flash" : ""}`}>
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    <span className="product-category">{product.category}</span>
                                    {product.rating && (
                                        <span className="product-rating">
                                            <span className="star">★</span> {product.rating}
                                        </span>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-desc">{product.description}</p>
                                    <div className="product-footer">
                                        <span className="product-price">₹{product.price.toFixed(2)}</span>
                                        <button
                                            className="btn-add-cart"
                                            onClick={() => handleAddToCart(product._id)}
                                        >
                                            <span className="cart-icon">🛒</span> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
