"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import Button from "./ui/Button";
import Link from "next/link";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import RoleFilter from "./RoleFilter";
import { useRouter, useSearchParams } from "next/navigation";

export default function WorkerProfiles() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState('all');

    // Sync selectedRole with URL query parameter
    useEffect(() => {
        const roleFromUrl = searchParams.get('role') || 'all';
        setSelectedRole(roleFromUrl);
    }, [searchParams]);

    // Fetch workers when selectedRole changes
    useEffect(() => {
        fetchWorkers(selectedRole);
    }, [selectedRole]);

    const fetchWorkers = async (role) => {
        setLoading(true);
        setError(null);

        try {
            const url = role === 'all'
                ? '/api/createpro'
                : `/api/createpro?role=${encodeURIComponent(role)}`;

            const res = await axios.get(url);
            setWorkers(res.data.workers);
        } catch (err) {
            setError("Failed to load workers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (role) => {
        // Update URL without scrolling
        const url = role === 'all' ? '/workers' : `/workers?role=${role}`;
        router.push(url, { scroll: false });
    };

    return (
        <section id="workers" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Meet Our Local Experts
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Connect with top-rated professionals in your area.
                    </p>
                </div>

                {/* Role Filter */}
                <RoleFilter
                    selectedRole={selectedRole}
                    onRoleChange={handleRoleChange}
                />

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-muted-foreground">Loading workers...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <p className="p-4 text-center text-red-500">{error}</p>
                )}

                {/* Empty State */}
                {!loading && !error && workers.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Workers Found</h3>
                            <p className="text-muted-foreground mb-6">
                                {selectedRole !== 'all'
                                    ? `No ${selectedRole}s available at the moment.`
                                    : 'No workers available at the moment.'}
                            </p>
                            {selectedRole !== 'all' && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleRoleChange('all')}
                                >
                                    View All Workers
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Worker Grid with Transition */}
                <div
                    className={`
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6
                        transition-opacity duration-300
                        ${loading ? 'opacity-50' : 'opacity-100'}
                    `}
                >
                    {!loading && !error && workers.map((worker) => (
                        <Card
                            key={worker._id}
                            className="hover:shadow-lg transition-shadow bg-card overflow-hidden"
                        >
                            <CardHeader className="p-0">
                                <div className="h-32 bg-primary/10 relative">
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                        <img
                                            src={worker.image}
                                            alt={worker.displayName}
                                            className="w-24 h-24 rounded-full border-4 border-card bg-white object-cover"
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-16 text-center">
                                <CardTitle className="mb-1">
                                    {worker.displayName}
                                </CardTitle>
                                <p className="text-primary font-medium text-sm mb-3">
                                    {worker.role}
                                </p>

                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{worker.location}</span>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-[54px] overflow-auto">
                                    {worker.aboutService}
                                </p>

                                <div className="space-y-2">

                                    <Button className="w-full" size="sm">
                                        
                                        Book Now
                                    </Button>

                                    <Link href={`/chatbox?workerId=${worker._id}`}>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            size="sm"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Message
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
