import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold tracking-tight mb-4 inline-block">
                            Service<span className="text-accent">Pro</span>
                        </Link>
                        <p className="text-primary-foreground/70 max-w-sm">
                            Your trusted partner for local professional services. Quality, reliability, and convenience guaranteed.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-primary-foreground/70">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
                            <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-primary-foreground/70">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-primary-foreground/50">
                        © {new Date().getFullYear()} ServicePro. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Facebook className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Instagram className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
