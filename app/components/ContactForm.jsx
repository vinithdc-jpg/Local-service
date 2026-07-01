"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Label from "./ui/Label";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import Badge from "./ui/Badge";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "./ui/Toast";

const contactInfo = [
  { icon: Phone, label: "Call Us", value: "(555) 123-4567" },
  { icon: Mail, label: "Email Us", value: "hello@servicepro.com" },
  { icon: MapPin, label: "Visit Us", value: "123 Business St, Local City, ST 12345" },
];

export default function ContactForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      showToast({ message: "Message sent successfully!", type: "success" });
    }, 1200);
  };

  return (
    <section id="contact" className="section-padding gradient-mesh">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="accent" className="mb-4">Contact</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              Let&apos;s Start a{" "}
              <span className="gradient-text">Conversation</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Have questions about our services? Need a custom quote? Drop us a message and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="space-y-5">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:gradient-bg group-hover:text-white transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-muted-foreground text-sm">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card glass className="overflow-hidden">
              {sent ? (
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                  <Button variant="outline" onClick={() => setSent(false)}>
                    Send Another
                  </Button>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                    <CardDescription>Fill out the form and we&apos;ll be in touch.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <Label htmlFor="name" required>Name</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div>
                        <Label htmlFor="email" required>Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div>
                        <Label htmlFor="message" required>Message</Label>
                        <Textarea id="message" placeholder="How can we help you?" required />
                      </div>
                      <Button type="submit" className="w-full" loading={loading}>
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
