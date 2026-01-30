import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem("hackhub_user");
        const storedAdmin = localStorage.getItem("hackhub_is_admin");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedAdmin === "true") {
            setIsAdmin(true);
        }
        setLoading(false);
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
        setIsAdmin(false);
        localStorage.setItem("hackhub_user", JSON.stringify(userData));
        localStorage.removeItem("hackhub_is_admin");
    };

    const loginAdmin = (adminData) => {
        setUser(adminData);
        setIsAdmin(true);
        localStorage.setItem("hackhub_user", JSON.stringify(adminData));
        localStorage.setItem("hackhub_is_admin", "true");
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("hackhub_user");
        localStorage.removeItem("hackhub_is_admin");
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loginUser, loginAdmin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
