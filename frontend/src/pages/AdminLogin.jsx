import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

function AdminLogin() {
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { loginAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Mock Admin Login
        setTimeout(() => {
            if (adminId === "admin" && password === "admin123") {
                loginAdmin({ id: adminId, name: "Administrator" });
                navigate("/admin");
            } else {
                setError("Invalid Admin ID or Password.");
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="login-container admin-login-bg">
            <div className="login-card admin-panel">
                <div className="admin-header">
                    <span className="admin-icon">🛡️</span>
                    <h2 className="login-title">Admin Portal</h2>
                </div>
                <p className="login-subtitle">Restricted access for authorized personnel only.</p>

                {error && <div className="login-error admin-error">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Admin ID</label>
                        <input
                            type="text"
                            placeholder="Enter Admin ID"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            required
                            className="login-input admin-input"
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
                            className="login-input admin-input"
                        />
                    </div>

                    <button type="submit" className="btn-primary admin-btn" disabled={loading}>
                        {loading ? "Verifying..." : "Access Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
