import { cn } from "@/app/lib/utils";

export default function Input({ className, type, ...props }) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}
