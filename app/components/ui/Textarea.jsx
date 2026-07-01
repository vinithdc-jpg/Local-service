import { cn } from "@/app/lib/utils";

export default function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(
        "flex w-full min-h-[120px] rounded-xl border bg-background/50 px-4 py-3 text-sm",
        "shadow-sm transition-all duration-200 resize-y",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-destructive focus-visible:ring-destructive/40" : "border-input hover:border-muted-foreground/40",
        className
      )}
      {...props}
    />
  );
}
