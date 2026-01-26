"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LogIn } from "lucide-react";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/api/login", formData);

            // Check if login was successful (API returns status 200 and user object)
            if (response.status === 200 && response.data.user) {
                // Update global auth state
                login(response.data.user, response.data.token);

                showToast({
                    message: "Login successful! Redirecting...",
                    type: "success",
                    duration: 2000,
                });

                // Redirect after a short delay to show the success toast
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid credentials. Please try again.";

            showToast({
                message: errorMessage,
                type: "error",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-secondary/30">
            <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md border border-border">
                <div className="text-center mb-8">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <Input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <Input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <Button className="w-full" size="lg" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
