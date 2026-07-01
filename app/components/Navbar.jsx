"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { isAuthenticated, logout, hasWorkerProfile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass sticky top-0 z-50 transition-all duration-300"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black tracking-tighter text-primary group z-50">
                    Service<span className="text-accent group-hover:text-primary transition-colors duration-300">Pro</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
                    <Link href="/#services" className="hover:text-accent transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all hover:after:w-full">
                        Services
                    </Link>
                    <Link href="/create-worker" className="hover:text-accent transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all hover:after:w-full">
                        {hasWorkerProfile ? "Profile" : "Join as Pro"}
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

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden z-50 p-2 text-primary"
                    onClick={toggleMenu}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col gap-6 font-semibold text-lg text-muted-foreground">
                            <Link
                                href="/#services"
                                onClick={() => setIsOpen(false)}
                                className="hover:text-accent transition-colors"
                            >
                                Services
                            </Link>
                            <Link
                                href="/create-worker"
                                onClick={() => setIsOpen(false)}
                                className="hover:text-accent transition-colors"
                            >
                                {hasWorkerProfile ? "Profile" : "Join as Pro"}
                            </Link>
                            <div className="h-[1px] bg-slate-100 w-full" />
                            <div className="flex flex-col gap-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/services"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Button className="w-full rounded-2xl py-6">
                                                Explore
                                            </Button>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="text-center text-red-500 font-bold"
                                        >
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="text-center py-2"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Button className="w-full rounded-2xl py-6">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

