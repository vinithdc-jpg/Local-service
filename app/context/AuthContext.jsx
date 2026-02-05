"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasWorkerProfile, setHasWorkerProfile] = useState(false);
    const [workerProfileId, setWorkerProfileId] = useState(null);
    const [checkingProfile, setCheckingProfile] = useState(false);

    // Check if user has a worker profile
    const checkWorkerProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setHasWorkerProfile(false);
            setWorkerProfileId(null);
            return;
        }

        setCheckingProfile(true);
        try {
            const response = await fetch("/api/worker-profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.hasProfile) {
                setHasWorkerProfile(true);
                setWorkerProfileId(data.worker._id);
            } else {
                setHasWorkerProfile(false);
                setWorkerProfileId(null);
            }
        } catch (err) {
            console.error("Error checking worker profile:", err);
            setHasWorkerProfile(false);
            setWorkerProfileId(null);
        } finally {
            setCheckingProfile(false);
        }
    };

    // Update worker profile status
    const setWorkerProfile = (workerId) => {
        setHasWorkerProfile(true);
        setWorkerProfileId(workerId);
    };

    // Clear worker profile status
    const clearWorkerProfile = () => {
        setHasWorkerProfile(false);
        setWorkerProfileId(null);
    };

    // Load user from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    // Check worker profile when user is authenticated
    useEffect(() => {
        if (user && !checkingProfile) {
            checkWorkerProfile();
        }
    }, [user]);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        // Profile check will trigger via useEffect
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        clearWorkerProfile();
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated,
            loading,
            hasWorkerProfile,
            workerProfileId,
            checkWorkerProfile,
            setWorkerProfile,
            checkingProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}
