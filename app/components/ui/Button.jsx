import { cn } from "@/app/lib/utils";

export default function Button({ children, className, variant = "primary", ...props }) {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-opacity-90 shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-opacity-80",
        outline: "border-2 border-primary text-primary hover:bg-primary/5",
        ghost: "hover:bg-secondary/50 text-foreground",
        accent: "bg-accent text-accent-foreground hover:bg-opacity-90 shadow-lg hover:shadow-xl transition-all",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
