import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../redux/actions/authActions";
import "../styles/pages/Auth.scss";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        if (!name || !email || !password) {
            setLocalError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        const result = await dispatch(signup(name, email, password));
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
                        <h2>Create Account</h2>
                        <p>Start your shopping journey today</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a password (min 6 chars)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login">Log in</Link>
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
                                <div className="center-icon">🛒</div>
                            </div>
                        </div>
                    </div>
                    <h3>Join Our Community</h3>
                    <p>Get access to exclusive deals, early sales, and personalized recommendations</p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
