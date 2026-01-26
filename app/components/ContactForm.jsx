import Button from "./ui/Button";
import Input from "./ui/Input";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactForm() {
    return (
        <section id="contact" className="py-20 bg-secondary">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Have questions about our services? Need a custom quote? Drop us a message and we'll get back to you asap.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold">Call Us</div>
                                    <div className="text-muted-foreground">(555) 123-4567</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold">Email Us</div>
                                    <div className="text-muted-foreground">hello@servicepro.com</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold">Visit Us</div>
                                    <div className="text-muted-foreground">123 Business St, Local City, ST 12345</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Send a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <Input placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input type="email" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Message</label>
                                    <textarea
                                        className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <Button className="w-full">Send Message</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
