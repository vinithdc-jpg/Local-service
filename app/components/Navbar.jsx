"use client";

import Link from "next/link";
import Button from "./ui/Button";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/workers", label: "Workers" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const { isAuthenticated, logout, hasWorkerProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong sticky top-0 z-50 border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground group z-50"
        >
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Service<span className="gradient-text">Pro</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/create-worker"
            className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors px-3"
          >
            {hasWorkerProfile ? "My Profile" : "Join as Pro"}
          </Link>

          {isAuthenticated ? (
            <>
              <button
                onClick={logout}
                className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors px-3"
              >
                Log out
              </button>
              <Link href="/services">
                <Button size="sm">Explore</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2 z-50">
          <ThemeToggle />
          <button
            className="p-2 text-foreground rounded-xl hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/create-worker"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-colors"
              >
                {hasWorkerProfile ? "My Profile" : "Join as Pro"}
              </Link>
              <div className="h-px bg-border my-3" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link href="/services" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Explore Services</Button>
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="text-center text-destructive font-semibold py-2"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
