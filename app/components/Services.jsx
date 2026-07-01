"use client";

import Link from "next/link";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Scissors, Wrench, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
    {
        title: "Barber & Styling",
        icon: Scissors,
        description: "Premium haircuts, beard trims, and styling services from top stylists.",
        price: "From $30",
        color: "bg-blue-500/10 text-blue-500"
    },
    {
        title: "Plumbing & Repairs",
        icon: Wrench,
        description: "Expert plumbing fixes, installations, and 24/7 emergency repairs.",
        price: "From $80",
        color: "bg-orange-500/10 text-orange-500"
    },
    {
        title: "Consulting",
        icon: Briefcase,
        description: "Professional business advice, tax planning, and strategic guidance.",
        price: "From $150/hr",
        color: "bg-indigo-500/10 text-indigo-500"
    },
];

export default function Services() {
    return (
        <section id="services" className="py-16 md:py-32 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Our Services</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Choose from our curated selection of professional services delivered by vetted experts.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <Card className="h-full border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 group rounded-3xl overflow-hidden glass">
                                <CardHeader className="pt-10 px-8">
                                    <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <service.icon className="w-8 h-8" />
                                    </div>
                                    <CardTitle className="text-2xl font-extrabold tracking-tight group-hover:text-accent transition-colors">
                                        {service.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-8 pb-10">
                                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xl font-black text-primary">{service.price}</span>
                                        <Link
                                            href={`/workers?role=${service.title.includes("Barber") ? "Barber" :
                                                service.title.includes("Plumbing") ? "Plumber" :
                                                    service.title.includes("Consulting") ? "Consultant" : "all"
                                                }`}
                                            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all duration-300"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </Link>
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
