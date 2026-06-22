import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/actions/authActions";
import {
    ShoppingBagIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon
} from "../components/Icons";
import "../styles/pages/Auth.scss";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) navigate("/shop");
        return () => dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");
        if (!email || !password) {
            setLocalError("Please fill in all fields");
            return;
        }
        const result = await dispatch(login(email, password));
        if (result.success) navigate("/shop");
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <Link to="/" className="auth-back-link">
                    ← Back to home
                </Link>
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="logo-icon">
                                <ShoppingBagIcon size={20} />
                            </div>
                            <span>ShopVerse</span>
                        </div>
                        <h2>Welcome back</h2>
                        <p>Sign in to your account to continue shopping</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><MailIcon size={17} /></span>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><LockIcon size={17} /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                                </button>
                            </div>
                        </div>

                        {(error || localError) && (
                            <div className="auth-error">{error || localError}</div>
                        )}

                        <button
                            type="submit"
                            className={`btn-auth ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner" /> Signing In...</>
                            ) : (
                                <>Sign In <ArrowRightIcon size={16} /></>
                            )}
                        </button>

                        <div className="auth-divider"><span>or</span></div>

                        <p className="auth-switch">
                            Don't have an account? <Link to="/signup">Create one free</Link>
                        </p>
                    </form>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-visual">
                    <div className="av-orb av-orb--1" />
                    <div className="av-orb av-orb--2" />
                    <div className="av-card">
                        <div className="av-icon">
                            <LockIcon size={32} />
                        </div>
                        <h3>Secure & Private</h3>
                        <p>Your data is protected with industry-leading encryption. We never share your information.</p>
                        <ul className="av-bullets">
                            <li>✓ Bank-grade security</li>
                            <li>✓ No data sharing</li>
                            <li>✓ Encrypted payments</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
