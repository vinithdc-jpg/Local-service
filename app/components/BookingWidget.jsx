"use client";

import { useState } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/Card";
import Input from "./ui/Input";
import Label from "./ui/Label";
import Badge from "./ui/Badge";
import { cn } from "@/app/lib/utils";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];

const steps = ["Select Date", "Select Time", "Your Details", "Confirmed"];

export default function BookingWidget() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1000);
  };

  return (
    <section id="book" className="section-padding gradient-mesh">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-10">
          <Badge variant="accent" className="mb-4">Booking</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Book Your <span className="gradient-text">Appointment</span>
          </h2>
          <p className="text-muted-foreground text-lg">Select a time that works best for you.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step > i + 1
                    ? "gradient-bg text-white"
                    : step === i + 1
                    ? "gradient-bg text-white ring-4 ring-accent/20"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 rounded-full transition-colors",
                    step > i + 1 ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card glass className="min-h-[420px] overflow-hidden">
          <CardHeader className="border-b border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <CardTitle>{steps[step - 1]}</CardTitle>
              {step > 1 && step < 4 && (
                <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3"
                >
                  {days.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => handleDateSelect(date)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 hover:scale-105",
                        isSameDay(date, selectedDate)
                          ? "gradient-bg text-white border-transparent shadow-md"
                          : "bg-card border-border hover:border-accent/50"
                      )}
                    >
                      <span className="text-[10px] font-medium uppercase opacity-70">
                        {format(date, "EEE")}
                      </span>
                      <span className="text-xl font-bold">{format(date, "d")}</span>
                      <span className="text-[10px] opacity-70">{format(date, "MMM")}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <div className="mb-5 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-foreground">
                      {format(selectedDate, "EEEE, MMMM do, yyyy")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={cn(
                          "p-3 rounded-xl border text-sm font-medium transition-all hover:scale-105",
                          selectedTime === time
                            ? "gradient-bg text-white border-transparent shadow-md"
                            : "bg-secondary/50 border-border hover:border-accent/50"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="p-6 max-w-lg mx-auto space-y-4"
                >
                  <div className="bg-secondary/50 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" /> {format(selectedDate, "MMM do, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <Clock className="w-4 h-4 text-accent" /> {selectedTime}
                      </div>
                    </div>
                    <Button variant="ghost" type="button" size="sm" onClick={() => setStep(2)}>
                      Change
                    </Button>
                  </div>

                  <div>
                    <Label required>Full Name</Label>
                    <Input required placeholder="John Doe" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <Label required>Email Address</Label>
                    <Input required type="email" placeholder="john@example.com" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <Label required>Phone Number</Label>
                    <Input required type="tel" placeholder="(555) 123-4567" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Special Requests</Label>
                    <Input placeholder="Any specific needs?" value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                  </div>

                  <Button type="submit" className="w-full" size="lg" loading={loading}>
                    Confirm Booking
                  </Button>
                </motion.form>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-success/15 text-success rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                  <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                    Confirmation sent to <strong>{formData.email}</strong>. See you on{" "}
                    <strong>{format(selectedDate, "MMMM do")} at {selectedTime}</strong>.
                  </p>
                  <Button onClick={() => setStep(1)} variant="outline">
                    Book Another
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
