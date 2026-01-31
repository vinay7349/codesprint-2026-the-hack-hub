import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

function UserLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Mock Login
        setTimeout(() => {
            if (email && password) {
                loginUser({ email, name: email.split("@")[0], isAadhaarVerified: true });
                navigate("/");
            } else {
                setError("Please enter valid credentials.");
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="login-container user-login-bg">
            <div className="login-card glass-panel">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to access community safety features</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>

                    <button type="submit" className="btn-primary login-btn" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account? <span className="link-text">Sign up</span>
                </p>
            </div>
        </div>
    );
}

export default UserLogin;
