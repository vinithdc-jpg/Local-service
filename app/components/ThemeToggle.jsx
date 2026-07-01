"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative w-10 h-10 rounded-xl flex items-center justify-center",
        "bg-secondary/80 hover:bg-secondary border border-border",
        "text-muted-foreground hover:text-foreground",
        "transition-all duration-300 hover:scale-105 active:scale-95",
        "focus-ring",
        className
      )}
    >
      <Sun
        className={cn(
          "w-[18px] h-[18px] absolute transition-all duration-300",
          theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "w-[18px] h-[18px] absolute transition-all duration-300",
          theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
        )}
      />
    </button>
  );
}
