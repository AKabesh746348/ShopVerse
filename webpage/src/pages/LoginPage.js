import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/actions/authActions";
import "../styles/pages/Auth.scss";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/shop");
        }
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
        if (result.success) {
            navigate("/shop");
        }
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
                            <div className="logo-icon">🛍️</div>
                            <span>ShopVerse</span>
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Sign in to your account to continue</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
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
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {(error || localError) && (
                            <div className="auth-error">{error || localError}</div>
                        )}

                        <button type="submit" className={`btn-auth ${loading ? "loading" : ""}`} disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        <p className="auth-switch">
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-illustration">
                    <div className="illustration-graphic">
                        <div className="floating-dot"></div>
                        <div className="floating-dot"></div>
                        <div className="floating-dot"></div>
                        <div className="circle-outer">
                            <div className="circle-inner">
                                <div className="center-icon">🔐</div>
                            </div>
                        </div>
                    </div>
                    <h3>Secure Access</h3>
                    <p>Your account is protected with enterprise-grade security</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
