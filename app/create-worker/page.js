"use client";

import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Briefcase, Upload, Loader2, CheckCircle2, MapPin, DollarSign, Mail, Calendar, Edit } from "lucide-react";
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
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                    <p className="text-muted-foreground">Checking your profile status...</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                    <h1 className="text-2xl font-bold">Profile Created Successfully!</h1>
                    <p className="text-muted-foreground">Reloading your profile...</p>
                </div>
            </div>
        );
    }

    // Display existing worker profile instead of the form
    if (existingWorker) {
        return (
            <div className="min-h-screen py-20 px-4 bg-background">
                <div className="container mx-auto max-w-4xl">
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold">Your Worker Profile</h1>
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

                    {/* Profile Card */}
                    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                        {/* Cover Header */}
                        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 h-32"></div>

                        {/* Profile Content */}
                        <div className="p-8 -mt-16">
                            {/* Profile Image and Basic Info */}
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-card shadow-xl overflow-hidden bg-muted">
                                        {existingWorker.image ? (
                                            <img
                                                src={existingWorker.image}
                                                alt={existingWorker.displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                                                {existingWorker.displayName?.[0]?.toUpperCase() || "W"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                </div>

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
                    </div>

                    {/* Additional Information */}
                    <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground text-center">
                            Your profile is visible to potential clients browsing local services.
                            Keep your information up-to-date to attract more opportunities.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4 bg-background">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold mb-4">Become a ServicePro</h1>
                    <p className="text-muted-foreground">Create your professional profile and start getting booked.</p>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-primary/5 p-6 border-b border-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Professional Details</h2>
                            <p className="text-sm text-muted-foreground">Tell us about your services</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Name</label>
                                <Input
                                    required
                                    placeholder="e.g. Alex Johnson"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role / Title</label>
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
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <Input
                                    required
                                    placeholder="e.g. New York, NY"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Hourly Rate ($)</label>
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
                            <label className="block text-sm font-medium mb-1">About Your Services</label>
                            <textarea
                                className="w-full min-h-[120px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe your experience and what you offer..."
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Profile Photo</label>
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
                                className="w-full flex items-center justify-center gap-2"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating Profile...
                                    </>
                                ) : (
                                    "Create Profile"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

