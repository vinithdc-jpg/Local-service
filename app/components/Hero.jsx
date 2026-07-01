"use client"
import { motion } from "framer-motion";

const text = "Premium Services,";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const letter = {
  hidden: {
    opacity: 0,
    color: "#000000",
  },
  visible: {
    opacity: 1,
    color: "#ffffff",
    transition: {
      duration: 0.4,
    },
  },
};

export default function Hero() {
  return (
    <main className="w-screen min-h-screen bg-indigo-950 flex items-center justify-center px-6 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div className="space-y-6">

          {/* Typing Text */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] flex flex-wrap"
          >
            {text.split("").map((char, index) => (
              <motion.span key={index} variants={letter}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Static Highlight Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold"
          >
            <span className="text-orange-600">Exceptional Results</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="text-gray-300 text-lg md:text-xl max-w-xl"
          >
            Book your appointment in seconds. Experience professional service from trusted local experts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="flex gap-4 pt-4"
          >
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
              View Workers
            </button>
            <button className="px-6 py-3 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition">
              Contact Us
            </button>
          </motion.div>

        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center md:justify-end"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
            alt="Professional Service"
            whileHover={{ scale: 1.05 }}
            className="w-full max-w-xl lg:max-w-2xl rounded-3xl shadow-2xl"
          />
        </motion.div>

      </div>
    </main>
  );
}
