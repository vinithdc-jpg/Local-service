import Link from "next/link";
import { Facebook, Twitter, Instagram, Sparkles, ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const quickLinks = [
  { href: "#services", label: "Services" },
  { href: "/workers", label: "Workers" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Cookie Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-black mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Service<span className="text-accent">Pro</span>
            </Link>
            <p className="text-background/60 max-w-sm leading-relaxed mb-6">
              Your trusted partner for local professional services. Quality, reliability, and convenience — guaranteed.
            </p>
            <ThemeToggle className="border-background/20 bg-background/10 hover:bg-background/20 text-background" />
          </div>

          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-background/40">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-background/40">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} ServicePro. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="p-2.5 hover:bg-background/10 rounded-xl transition-colors text-background/60 hover:text-background"
                aria-label="Social link"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
