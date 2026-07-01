"use client";

import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Textarea from "../components/ui/Textarea";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Card, { CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PageLoader } from "../components/ui/Skeleton";
import { Briefcase, Upload, CheckCircle2, MapPin, DollarSign, Mail, Calendar, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function CreateWorkerPage() {
    const router = useRouter();
    const { setWorkerProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        location: "",
        rate: "",
        description: ""
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);
    const [existingWorker, setExistingWorker] = useState(null); // Store existing profile

    // Check authentication and existing profile on mount
    useEffect(() => {
        const checkProfileStatus = async () => {
            // Import auth utilities dynamically
            const { getToken, isAuthenticated } = await import("../lib/authUtils");

            if (!isAuthenticated()) {
                router.push("/login");
                return;
            }

            try {
                const token = getToken();
                const response = await fetch("/api/worker-profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok && data.hasProfile) {
                    // User already has a profile, store it to display
                    setExistingWorker(data.worker);
                    setIsCheckingProfile(false);
                } else {
                    // No profile exists, allow user to create one
                    setIsCheckingProfile(false);
                }
            } catch (err) {
                console.error("Error checking profile:", err);
                setIsCheckingProfile(false);
            }
        };

        checkProfileStatus();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const { getToken } = await import("../lib/authUtils");
            const token = getToken();

            if (!token) {
                setError("You must be logged in to create a profile.");
                setIsSubmitting(false);
                router.push("/login");
                return;
            }

            const data = new FormData();
            data.append("displayName", formData.name);
            data.append("role", formData.role);
            data.append("location", formData.location);
            data.append("hourlyRate", formData.rate);
            data.append("aboutService", formData.description);

            if (image) {
                data.append("image", image);
            } else {
                setError("Please upload a profile photo.");
                setIsSubmitting(false);
                return;
            }

            const response = await fetch("/api/createpro", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create profile");
            }

            const result = await response.json();

            setIsSuccess(true);
            // Update global auth state with worker profile
            setWorkerProfile(result.worker._id);
            // Wait 2 seconds, then load the newly created profile
            setTimeout(async () => {
                setIsSuccess(false);
                setExistingWorker(result.worker); // Display the newly created profile
            }, 2000);
        } catch (err) {
            console.error("Create worker error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingProfile) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <PageLoader message="Checking your profile status..." />
            </main>
        );
    }

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex items-center justify-center p-4"
                >
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-success" />
                        </div>
                        <h1 className="text-2xl font-bold">Profile Created Successfully!</h1>
                        <p className="text-muted-foreground">Reloading your profile...</p>
                    </div>
                </motion.div>
            </main>
        );
    }

    // Display existing worker profile instead of the form
    if (existingWorker) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="section-padding px-4 gradient-mesh">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-10">
                        <Badge variant="accent" className="mb-3">Your Profile</Badge>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h1 className="text-3xl font-extrabold tracking-tight">Worker Profile</h1>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => router.push("/workers")}
                            >
                                View All Workers
                            </Button>
                        </div>
                        <p className="text-muted-foreground">Your professional service profile is active and visible to clients</p>
                    </div>

                    <Card glass className="overflow-hidden">
                        <div className="h-36 bg-gradient-to-r from-accent/30 via-purple-500/20 to-accent/10"></div>

                        {/* Profile Content */}
                        <div className="p-8 -mt-16">
                            {/* Profile Image and Basic Info */}
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
                                <Avatar
                                    src={existingWorker.image}
                                    name={existingWorker.displayName}
                                    size="xl"
                                    className="!w-32 !h-32 !text-3xl ring-4 ring-card"
                                />

                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-1">{existingWorker.displayName}</h2>
                                    <p className="text-xl text-primary mb-2">{existingWorker.role}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{existingWorker.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Member since {new Date(existingWorker.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-center">
                                        <div className="text-sm text-muted-foreground mb-1">Hourly Rate</div>
                                        <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                                            <DollarSign className="w-5 h-5" />
                                            {existingWorker.hourlyRate}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border my-6"></div>

                            {/* About Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    About My Services
                                </h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {existingWorker.aboutService}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border my-6"></div>

                            {/* Profile Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">{existingWorker.hourlyRate > 30 ? "Premium" : "Standard"}</div>
                                    <div className="text-sm text-muted-foreground">Service Tier</div>
                                </div>
                                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">Active</div>
                                    <div className="text-sm text-muted-foreground">Profile Status</div>
                                </div>
                                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">{existingWorker.location.split(',')[0]}</div>
                                    <div className="text-sm text-muted-foreground">Service Area</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-border flex gap-4">
                                <Button className="flex-1 flex items-center justify-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Contact Me
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 flex items-center justify-center gap-2"
                                    onClick={() => alert("Edit functionality coming soon!")}
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="mt-6 p-5 glass rounded-2xl text-center">
                        <p className="text-sm text-muted-foreground">
                            Your profile is visible to potential clients. Keep your information up-to-date to attract more opportunities.
                        </p>
                    </div>
                </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="section-padding px-4 gradient-mesh">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-10 text-center">
                    <Badge variant="accent" className="mb-4">Join Us</Badge>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
                        Become a <span className="gradient-text">ServicePro</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Create your professional profile and start getting booked.</p>
                </div>

                <Card glass className="overflow-hidden">
                    <CardHeader className="border-b border-border bg-secondary/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-md">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>Professional Details</CardTitle>
                                <CardDescription>Tell us about your services</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label required>Display Name</Label>
                                <Input
                                    required
                                    placeholder="e.g. Alex Johnson"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label required>Role / Title</Label>
                                <Input
                                    required
                                    placeholder="e.g. Senior Barber"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label required>Location</Label>
                                <Input
                                    required
                                    placeholder="e.g. New York, NY"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label required>Hourly Rate ($)</Label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="e.g. 50"
                                    value={formData.rate}
                                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label required>About Your Services</Label>
                            <Textarea
                                placeholder="Describe your experience and what you offer..."
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label required>Profile Photo</Label>
                            <label className="block">
                                <span className="sr-only">Choose profile photo</span>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview ? (
                                        <div className="relative w-32 h-32 mx-auto">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-full border-2 border-primary"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full"
                                size="lg"
                                loading={isSubmitting}
                            >
                                Create Profile
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
            </div>
            <Footer />
        </main>
    );
}

