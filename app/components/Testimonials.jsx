"use client";

import Card, { CardContent } from "./ui/Card";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
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
    content: "Fixed my plumbing emergency in under 2 hours. An absolute lifesaver when I needed it most!",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-secondary/50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="accent" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who trust ServicePro for their daily needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card hover className="h-full relative overflow-hidden">
                <CardContent className="p-7 relative">
                  <Quote className="absolute top-5 right-5 w-10 h-10 text-accent/10" />

                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          j < t.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-foreground/80 mb-8 leading-relaxed relative z-10">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar name={t.name} size="md" />
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
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
