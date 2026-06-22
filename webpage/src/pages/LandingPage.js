import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories, setCategoryFilter, setSearchQuery } from "../redux/actions/productActions";
import { addToCart, fetchCart } from "../redux/actions/cartActions";
import { logout } from "../redux/actions/authActions";
import {
    ShoppingBagIcon, ShoppingCartIcon, SearchIcon,
    LogOutIcon, PackageIcon, StarIcon, HeartIcon
} from "../components/Icons";
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
        if (e.key === "Enter") handleSearch();
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
                    <div className="brand-icon">
                        <ShoppingBagIcon size={20} />
                    </div>
                    <span>ShopVerse</span>
                </Link>

                <div className="nav-search">
                    <SearchIcon size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for products, brands..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <button className="search-btn" onClick={handleSearch}>Search</button>
                </div>

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
                            <span className="cart-total">₹{cartTotal.toFixed(0)}</span>
                        </div>
                    </Link>

                    <button className="btn-logout" onClick={handleLogout} title="Logout">
                        <LogOutIcon size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Category Bar */}
            {categories.length > 0 && (
                <div className="category-bar">
                    <div className="category-bar-inner">
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
                </div>
            )}

            {/* Products */}
            <section className="products-section">
                <div className="products-header">
                    <div className="products-title">
                        <h2>{selectedCategory === "All" ? "All Products" : selectedCategory}</h2>
                        <span className="products-count">{products.length} products</span>
                    </div>
                </div>

                <div className="products-grid">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="product-skeleton">
                                <div className="skeleton-image" />
                                <div className="skeleton-body">
                                    <div className="skeleton-line skeleton-line--wide" />
                                    <div className="skeleton-line skeleton-line--medium" />
                                    <div className="skeleton-line skeleton-line--short" />
                                </div>
                            </div>
                        ))
                    ) : products.length === 0 ? (
                        <div className="no-products">
                            <PackageIcon size={48} className="empty-icon" />
                            <h3>No products found</h3>
                            <p>Try a different search term or browse all categories.</p>
                            <button
                                className="btn-reset"
                                onClick={() => {
                                    dispatch(setCategoryFilter("All"));
                                    dispatch(setSearchQuery(""));
                                    setSearchInput("");
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product._id}
                                className={`product-card ${addedProduct === product._id ? "added-flash" : ""}`}
                            >
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} loading="lazy" />
                                    <span className="product-category-badge">{product.category}</span>
                                    <button className="product-wishlist" aria-label="Add to wishlist">
                                        <HeartIcon size={16} />
                                    </button>
                                    <div className="product-overlay">
                                        <button
                                            className="btn-quick-add"
                                            onClick={() => handleAddToCart(product._id)}
                                        >
                                            <ShoppingCartIcon size={16} />
                                            {addedProduct === product._id ? "Added!" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    {product.rating && (
                                        <div className="product-rating">
                                            <StarIcon size={12} className="star" />
                                            <span>{product.rating}</span>
                                        </div>
                                    )}
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-desc">{product.description}</p>
                                    <div className="product-footer">
                                        <span className="product-price">₹{product.price.toFixed(0)}</span>
                                        <button
                                            className={`btn-add-cart ${addedProduct === product._id ? "added" : ""}`}
                                            onClick={() => handleAddToCart(product._id)}
                                        >
                                            {addedProduct === product._id ? "Added!" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="lf-brand">
                        <div className="brand-icon">
                            <ShoppingBagIcon size={16} />
                        </div>
                        <span>ShopVerse</span>
                    </div>
                    <div className="lf-links">
                        <a href="#about">About</a>
                        <a href="#help">Help</a>
                        <a href="#returns">Returns</a>
                        <a href="#privacy">Privacy</a>
                        <a href="#terms">Terms</a>
                    </div>
                    <span className="lf-copy">© {new Date().getFullYear()} ShopVerse</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
