import React from "react";
import { Link } from "react-router-dom";
import {
    ShoppingBagIcon, TruckIcon, ShieldIcon, HeadphonesIcon,
    ArrowRightIcon, AwardIcon, ZapIcon, GlobeIcon, ChevronRightIcon
} from "../components/Icons";
import "../styles/pages/Home.scss";

const stats = [
    { value: "2M+", label: "Happy Customers" },
    { value: "50K+", label: "Products Listed" },
    { value: "4.9★", label: "Average Rating" },
    { value: "24/7", label: "Customer Support" },
];

const features = [
    {
        icon: <TruckIcon size={24} />,
        title: "Express Delivery",
        desc: "Same-day and next-day delivery available across 500+ cities in India.",
        color: "indigo",
    },
    {
        icon: <ShieldIcon size={24} />,
        title: "Secure Payments",
        desc: "Bank-grade encryption protects every transaction you make with us.",
        color: "emerald",
    },
    {
        icon: <AwardIcon size={24} />,
        title: "Premium Quality",
        desc: "Every product is hand-picked, quality-checked, and authenticity-verified.",
        color: "amber",
    },
    {
        icon: <HeadphonesIcon size={24} />,
        title: "24/7 Support",
        desc: "Our dedicated support team is always here to help you, day or night.",
        color: "cyan",
    },
];

const categories = [
    { name: "Electronics", icon: "⚡", bg: "#1a1a40" },
    { name: "Fashion", icon: "👗", bg: "#1a2830" },
    { name: "Home & Living", icon: "🏠", bg: "#1a2020" },
    { name: "Beauty", icon: "✨", bg: "#2a1a30" },
    { name: "Sports", icon: "🏃", bg: "#1a2810" },
    { name: "Books", icon: "📚", bg: "#201820" },
];

const HomePage = () => {
    return (
        <div className="home-page">
            {/* Announcement Bar */}
            <div className="home-announcement">
                <span className="announcement-dot" />
                <span>Free shipping on orders over ₹999 &nbsp;·&nbsp; Use code <strong>FIRST10</strong> for 10% off your first order</span>
                <Link to="/signup" className="announcement-cta">
                    Shop Now <ChevronRightIcon size={14} />
                </Link>
            </div>

            {/* Navbar */}
            <nav className="home-navbar">
                <div className="brand">
                    <div className="brand-icon">
                        <ShoppingBagIcon size={22} />
                    </div>
                    <h1>ShopVerse</h1>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="btn-login">
                        Log In
                    </Link>
                    <Link to="/signup" className="btn-signup">
                        Get Started <ArrowRightIcon size={16} />
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="home-hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot" />
                        Trusted by 2 million+ shoppers
                    </div>
                    <h2>
                        Your Premium
                        <br />
                        <span className="gradient-text">Shopping Destination</span>
                    </h2>
                    <p className="hero-subtitle">
                        Discover curated collections across fashion, electronics, home décor and more.
                        World-class quality delivered straight to your door.
                    </p>
                    <div className="hero-actions">
                        <Link to="/signup" className="btn-hero-primary">
                            Start Shopping <ArrowRightIcon size={18} />
                        </Link>
                        <Link to="/login" className="btn-hero-ghost">
                            Sign In
                        </Link>
                    </div>
                    <div className="hero-trust">
                        <div className="trust-avatars">
                            {["A", "R", "S", "M", "K"].map((l, i) => (
                                <div key={i} className="trust-avatar" style={{ "--d": i }}>
                                    {l}
                                </div>
                            ))}
                        </div>
                        <span>Join <strong>2M+</strong> happy customers</span>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-card hero-card--main">
                        <div className="hcard-image" />
                        <div className="hcard-content">
                            <div className="hcard-tag">New Arrival</div>
                            <div className="hcard-name">Premium Collection</div>
                            <div className="hcard-price">
                                <span className="hcard-current">₹1,299</span>
                                <span className="hcard-old">₹2,499</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-card hero-card--sm hero-card--top">
                        <div className="hcard-sm-icon"><ZapIcon size={16} /></div>
                        <div>
                            <div className="hcard-sm-title">Flash Sale</div>
                            <div className="hcard-sm-sub">Up to 60% off</div>
                        </div>
                    </div>
                    <div className="hero-card hero-card--sm hero-card--bottom">
                        <div className="hcard-sm-icon hcard-sm-icon--green"><TruckIcon size={16} /></div>
                        <div>
                            <div className="hcard-sm-title">Fast Delivery</div>
                            <div className="hcard-sm-sub">Same day available</div>
                        </div>
                    </div>
                    <div className="hero-orb hero-orb--1" />
                    <div className="hero-orb hero-orb--2" />
                </div>
            </section>

            {/* Stats */}
            <section className="home-stats">
                {stats.map((s, i) => (
                    <div key={i} className="stat-item">
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </section>

            {/* Features */}
            <section className="home-features">
                <div className="section-header">
                    <h3>Why Choose ShopVerse?</h3>
                    <p>Everything you need for a world-class shopping experience</p>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className={`feature-card feature-card--${f.color}`} style={{ "--i": i }}>
                            <div className="feature-icon">{f.icon}</div>
                            <h4>{f.title}</h4>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="home-categories">
                <div className="section-header">
                    <h3>Shop by Category</h3>
                    <p>Explore our wide range of product categories</p>
                </div>
                <div className="categories-grid">
                    {categories.map((cat, i) => (
                        <Link key={i} to="/signup" className="category-card">
                            <div className="category-icon" style={{ background: cat.bg }}>
                                <span>{cat.icon}</span>
                            </div>
                            <span className="category-name">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="home-cta">
                <div className="cta-content">
                    <div className="cta-badge">
                        <GlobeIcon size={14} />
                        Pan-India Delivery
                    </div>
                    <h3>Ready to start shopping?</h3>
                    <p>Create your free account and get 10% off your first order.</p>
                    <div className="cta-actions">
                        <Link to="/signup" className="btn-cta-primary">
                            Create Free Account
                        </Link>
                        <Link to="/login" className="btn-cta-ghost">
                            Already a member? Sign in
                        </Link>
                    </div>
                </div>
                <div className="cta-orb cta-orb--1" />
                <div className="cta-orb cta-orb--2" />
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <div className="brand-icon brand-icon--sm">
                            <ShoppingBagIcon size={16} />
                        </div>
                        <span>ShopVerse</span>
                    </div>
                    <p>India's premium e-commerce destination.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h5>Company</h5>
                        <a href="#about">About Us</a>
                        <a href="#careers">Careers</a>
                        <a href="#blog">Blog</a>
                    </div>
                    <div className="footer-col">
                        <h5>Support</h5>
                        <a href="#help">Help Centre</a>
                        <a href="#returns">Returns</a>
                        <a href="#track">Track Order</a>
                    </div>
                    <div className="footer-col">
                        <h5>Legal</h5>
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#cookies">Cookies</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} ShopVerse. All rights reserved.</span>
                    <div className="footer-badges">
                        <span className="footer-badge">
                            <ShieldIcon size={12} /> Secure Payments
                        </span>
                        <span className="footer-badge">
                            <TruckIcon size={12} /> Fast Delivery
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
