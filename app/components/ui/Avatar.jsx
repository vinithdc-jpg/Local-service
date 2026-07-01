import { cn } from "@/app/lib/utils";

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  online,
  className,
}) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-bold",
          "bg-gradient-to-br from-accent to-[var(--gradient-end)] text-white",
          "ring-2 ring-background shadow-sm",
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3",
            online ? "bg-success" : "bg-muted-foreground"
          )}
        >
          {online && (
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
          )}
        </span>
      )}
    </div>
  );
}
