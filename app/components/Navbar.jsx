"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass sticky top-0 z-50 transition-all duration-300"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black tracking-tighter text-primary group">
                    Service<span className="text-accent group-hover:text-primary transition-colors duration-300">Pro</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
                    <Link href="/#services" className="hover:text-accent transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all hover:after:w-full">
                        Services
                    </Link>
                    <Link href="/create-worker" className="hover:text-accent transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all hover:after:w-full">
                        Join as Pro
                    </Link>

                    <div className="flex items-center gap-4 ml-4">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={logout}
                                    className="text-muted-foreground hover:text-red-500 transition-colors text-xs font-bold"
                                >
                                    Log out
                                </button>
                                <Link href="/services">
                                    <Button size="sm" className="rounded-full px-6 shadow-lg shadow-accent/20">
                                        Explorce
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hover:text-accent transition-colors">Log In</Link>
                                <Link href="/signup">
                                    <Button size="sm" className="rounded-full px-6 shadow-lg shadow-accent/20">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

