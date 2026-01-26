"use client";

import Card, { CardContent } from "./ui/Card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "John Doe",
        role: "Regular Customer",
        content: "The best service I've ever had. Booking was super easy and the staff was professional beyond expectations.",
        rating: 5,
    },
    {
        name: "Sarah Smith",
        role: "Local Business Owner",
        content: "I rely on them for all my consulting needs. Highly recommended for their efficiency and deep expertise.",
        rating: 5,
    },
    {
        name: "Mike Johnson",
        role: "Homeowner",
        content: "Fixed my plumbing emergency in under 2 hours. A absolute lifesaver when I needed it most!",
        rating: 4,
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6">What Our Customers Say</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Real stories from real people who trust ServicePro for their daily needs.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Card className="h-full border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl p-4 group hover:-translate-y-2 transition-transform duration-500">
                                <CardContent className="pt-8 px-6 pb-10 relative">
                                    <Quote className="absolute top-4 right-6 w-12 h-12 text-slate-100 group-hover:text-accent/10 transition-colors duration-500" />

                                    <div className="flex mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < t.rating ? "text-accent fill-accent" : "text-slate-200"}`} />
                                        ))}
                                    </div>

                                    <p className="text-lg text-slate-600 mb-8 italic leading-relaxed relative z-10">
                                        "{t.content}"
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-primary">{t.name}</div>
                                            <div className="text-sm text-muted-foreground font-medium">{t.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
