import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Home.scss";
const logo = require("../assets/logo.png");

const HomePage = () => {
    return (
        <div className="home-page">
            <nav className="home-navbar">
                <div className="brand">
                    <div className="brand-icon">
                        <img src={logo} alt="ShopVerse" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <h1>ShopVerse</h1>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="btn-login">
                        Log In
                    </Link>
                    <Link to="/signup" className="btn-signup">
                        Sign Up
                    </Link>
                </div>
            </nav>

            <section className="home-hero">
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    Welcome to the future of shopping
                </div>
                <h2>
                    Discover Products
                    <br />
                    <span className="gradient-text">That Define You</span>
                </h2>
                <p className="hero-subtitle">
                    Curated collections, premium quality, and seamless shopping experience.
                    Join thousands of happy customers worldwide.
                </p>
                <div className="hero-actions">
                    <Link to="/signup" className="btn-get-started">
                        Get Started <span className="arrow">→</span>
                    </Link>
                    <Link to="/login" className="btn-explore">
                        Explore Now
                    </Link>
                </div>
            </section>

            <section className="home-features">
                <div className="feature-card" style={{ "--i": 0 }}>
                    <div className="feature-icon icon-1">🚀</div>
                    <h3>Lightning Fast</h3>
                    <p>Get your orders delivered with our express shipping network</p>
                </div>
                <div className="feature-card" style={{ "--i": 1 }}>
                    <div className="feature-icon icon-2">🔒</div>
                    <h3>Secure Payments</h3>
                    <p>Your transactions are protected with bank-grade security</p>
                </div>
                <div className="feature-card" style={{ "--i": 2 }}>
                    <div className="feature-icon icon-3">💎</div>
                    <h3>Premium Quality</h3>
                    <p>Every product is handpicked and quality-verified for you</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
