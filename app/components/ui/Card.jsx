import { cn } from "@/app/lib/utils";

export default function Card({ children, className, ...props }) {
    return (
        <div
            className={cn(
                "bg-card text-card-foreground rounded-xl border border-border shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }) {
    return (
        <div className={cn("p-6 space-y-1.5", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className, ...props }) {
    return (
        <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className, ...props }) {
    return (
        <div className={cn("p-6 pt-0", className)} {...props}>
            {children}
        </div>
    );
}
