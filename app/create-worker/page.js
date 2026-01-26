"use client";

import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Briefcase, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateWorkerPage() {
    const router = useRouter();
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
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create profile");
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/workers");
            }, 2000);
        } catch (err) {
            console.error("Create worker error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                    <h1 className="text-2xl font-bold">Profile Created Successfully!</h1>
                    <p className="text-muted-foreground">Redirecting you to the workers list...</p>
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

