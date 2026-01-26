"use client";

import { MapPin, Star, Phone, Mail } from "lucide-react";
import Button from "./ui/Button";
import Link from "next/link";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/Card";

const WORKERS = [
    {
        id: 1,
        name: "Alex Johnson",
        role: "Professional Barber",
        rating: 4.9,
        reviews: 128,
        location: "Downtown Area",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        specialties: ["Haircuts", "Beard Trims", "Styling"]
    },
    {
        id: 2,
        name: "Sarah Smith",
        role: "Master Plumber",
        rating: 5.0,
        reviews: 84,
        location: "Westside",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        specialties: ["Repairs", "Installations", "Emergency"]
    },
    {
        id: 3,
        name: "Michael Chen",
        role: "Business Consultant",
        rating: 4.8,
        reviews: 56,
        location: "Remote / Hybrid",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        specialties: ["Strategy", "Finance", "Growth"]
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "Interior Designer",
        rating: 4.9,
        reviews: 92,
        location: "North Hills",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        specialties: ["Residential", "Commercial", "Color Theory"]
    }
];

export default function WorkerProfiles() {
    return (
        <section id="workers" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Meet Our Local Experts</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Connect with top-rated professionals in your area ready to help you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WORKERS.map((worker) => (
                        <Card key={worker.id} className="hover:shadow-lg transition-shadow bg-card overflow-hidden">
                            <CardHeader className="p-0">
                                <div className="h-32 bg-primary/10 relative">
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                        <img
                                            src={worker.image}
                                            alt={worker.name}
                                            className="w-24 h-24 rounded-full border-4 border-card bg-white"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-16 text-center">
                                <CardTitle className="mb-1">{worker.name}</CardTitle>
                                <p className="text-primary font-medium text-sm mb-3">{worker.role}</p>

                                <div className="flex items-center justify-center gap-1 mb-4 text-amber-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-bold text-foreground">{worker.rating}</span>
                                    <span className="text-muted-foreground text-sm">({worker.reviews})</span>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                                    <MapPin className="w-4 h-4" />
                                    <span>{worker.location}</span>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {worker.specialties.map((spec, i) => (
                                        <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full">
                                            {spec}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Button className="w-full" size="sm">
                                        <Phone className="w-4 h-4 mr-2" /> Contact
                                    </Button>
                                    <Link href={`/chatbox?workerId=${worker.id}`}>
                                        <Button variant="outline" className="w-full" size="sm">
                                            <Mail className="w-4 h-4 mr-2" /> Message
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
