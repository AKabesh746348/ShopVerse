import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../redux/actions/authActions";
import {
    ShoppingBagIcon, MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon, ArrowRightIcon
} from "../components/Icons";
import "../styles/pages/Auth.scss";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                        <h2>Create your account</h2>
                        <p>Join millions of happy shoppers today</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><UserIcon size={17} /></span>
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
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><LockIcon size={17} /></span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
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
                                <><span className="spinner" /> Creating Account...</>
                            ) : (
                                <>Create Free Account <ArrowRightIcon size={16} /></>
                            )}
                        </button>

                        <p className="auth-terms">
                            By creating an account, you agree to our{" "}
                            <a href="#terms">Terms of Service</a> and{" "}
                            <a href="#privacy">Privacy Policy</a>.
                        </p>

                        <div className="auth-divider"><span>or</span></div>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-visual">
                    <div className="av-orb av-orb--1" />
                    <div className="av-orb av-orb--2" />
                    <div className="av-card">
                        <div className="av-icon av-icon--accent">
                            <ShoppingBagIcon size={32} />
                        </div>
                        <h3>Join ShopVerse</h3>
                        <p>Get access to exclusive deals, early sales, and personalised recommendations.</p>
                        <ul className="av-bullets">
                            <li>✓ 10% off your first order</li>
                            <li>✓ Free shipping on ₹999+</li>
                            <li>✓ Exclusive member deals</li>
                            <li>✓ Easy returns & refunds</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
