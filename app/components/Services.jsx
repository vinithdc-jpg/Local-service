"use client";

import Link from "next/link";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/Card";
import Badge from "./ui/Badge";
import { Scissors, Wrench, Briefcase, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Barber & Styling",
    icon: Scissors,
    description: "Premium haircuts, beard trims, and styling services from top stylists.",
    price: "From $30",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-500",
    role: "Barber",
  },
  {
    title: "Plumbing & Repairs",
    icon: Wrench,
    description: "Expert plumbing fixes, installations, and 24/7 emergency repairs.",
    price: "From $80",
    color: "from-orange-500/20 to-amber-500/20 text-orange-500",
    role: "Plumber",
  },
  {
    title: "Consulting",
    icon: Briefcase,
    description: "Professional business advice, tax planning, and strategic guidance.",
    price: "From $150/hr",
    color: "from-indigo-500/20 to-purple-500/20 text-indigo-500",
    role: "Consultant",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding relative overflow-hidden gradient-mesh">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="accent" className="mb-4">Our Services</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
            Everything You Need,{" "}
            <span className="gradient-text">Done Right</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our curated selection of professional services delivered by vetted experts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                hover
                glass
                className="h-full group overflow-hidden border-border/50"
              >
                <CardHeader className="pt-8 px-7">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-7 pb-8">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">{service.price}</span>
                    <Link
                      href={`/workers?role=${service.role}`}
                      className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:gradient-bg group-hover:text-white transition-all duration-300 shadow-sm"
                      aria-label={`Browse ${service.title}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            View all services
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
