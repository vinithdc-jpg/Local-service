"use client";

import { useState } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/Card";
import Input from "./ui/Input";
import { cn } from "@/app/lib/utils";

const TIME_SLOTS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
];

export default function BookingWidget() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [selectedTime, setSelectedTime] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });

    // Generate next 14 days
    const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
        setStep(2);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setStep(3);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => setStep(4), 1000);
    };

    return (
        <section id="book" className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Book Your Appointment</h2>
                    <p className="text-muted-foreground">Select a time that works best for you.</p>
                </div>

                <Card className="min-h-[500px] overflow-hidden">
                    <CardHeader className="bg-secondary/30 border-b border-border">
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                {step === 1 && "Select Date"}
                                {step === 2 && "Select Time"}
                                {step === 3 && "Enter Details"}
                                {step === 4 && "Confirmation"}
                            </CardTitle>
                            {step > 1 && step < 4 && (
                                <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                                    Back
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Step 1: Date Selection */}
                        {step === 1 && (
                            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                                {days.map((date, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleDateSelect(date)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:border-primary hover:shadow-md",
                                            isSameDay(date, selectedDate)
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card text-card-foreground border-border"
                                        )}
                                    >
                                        <span className="text-xs font-medium uppercase opacity-70">
                                            {format(date, "EEE")}
                                        </span>
                                        <span className="text-2xl font-bold">{format(date, "d")}</span>
                                        <span className="text-xs opacity-70">{format(date, "MMM")}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Time Selection */}
                        {step === 2 && (
                            <div className="p-6">
                                <div className="mb-6 flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-semibold text-foreground">{format(selectedDate, "EEEE, MMMM do, yyyy")}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {TIME_SLOTS.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelect(time)}
                                            className={cn(
                                                "p-4 rounded-lg border text-center transition-all hover:border-primary",
                                                selectedTime === time
                                                    ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2"
                                                    : "bg-secondary/50 hover:bg-secondary"
                                            )}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Form */}
                        {step === 3 && (
                            <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto space-y-4">
                                <div className="bg-secondary/30 p-4 rounded-lg mb-6 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Calendar className="w-4 h-4" /> {format(selectedDate, "MMM do")}
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Clock className="w-4 h-4" /> {selectedTime}
                                        </div>
                                    </div>
                                    <Button variant="ghost" type="button" onClick={() => setStep(2)}>Change</Button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <Input
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email Address</label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                                        <Input
                                            required
                                            type="tel"
                                            placeholder="(555) 123-4567"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
                                        <Input
                                            placeholder="Any specific needs?"
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" className="w-full" size="lg">Confirm Booking</Button>
                                </div>
                            </form>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                                <p className="text-muted-foreground mb-8 max-w-md">
                                    We have sent a confirmation email to <strong>{formData.email}</strong>. We look forward to seeing you on <strong>{format(selectedDate, "MMMM do")} at {selectedTime}</strong>.
                                </p>
                                <Button onClick={() => setStep(1)} variant="outline">Book Another</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
