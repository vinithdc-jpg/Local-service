"use client";

import Button from "./ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary px-4 selection:bg-accent/30">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] bg-accent/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -70, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] bg-indigo-500/10 blur-[100px] rounded-full"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto relative z-10 text-center"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-bold mb-8 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Trusted by 10,000+ local clients</span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-8xl font-black tracking-tight mb-8 max-w-4xl mx-auto leading-[0.9]"
                >
                    <span className="text-white">
                        Expert Help for Your{" "}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400">
                        Daily Hustle
                    </span>
                </motion.h1>



                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium"
                >
                    The smartest way to book top-rated local professionals. Quality service, guaranteed at your doorstep.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="accent" className="h-16 px-10 text-xl rounded-full shadow-2xl shadow-accent/40 font-bold group">
                            Book Now
                            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="h-16 px-10 text-xl text-white border-white/20 hover:bg-white/10 rounded-full font-bold backdrop-blur-sm transition-all">
                            Browse Pros
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
            >
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto relative">
                    <motion.div
                        animate={{ top: ["0%", "80%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-2 h-2 bg-accent rounded-full -left-[3px]"
                    />
                </div>
            </motion.div>
        </section>
    );
}
