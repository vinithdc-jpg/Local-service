import { cn } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}) {
  const variants = {
    primary:
      "gradient-bg text-white shadow-md hover:shadow-lg hover:brightness-110 border border-transparent",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    outline:
      "border-2 border-border text-foreground hover:border-accent hover:text-accent bg-transparent",
    ghost:
      "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
    accent:
      "bg-accent text-accent-foreground hover:brightness-110 shadow-md hover:shadow-lg",
    destructive:
      "bg-destructive text-destructive-foreground hover:brightness-110",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-lg gap-1.5",
    md: "h-11 px-5 text-sm rounded-xl gap-2",
    lg: "h-13 px-7 text-base rounded-xl gap-2",
    icon: "h-10 w-10 p-0 rounded-xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold",
        "transition-all duration-200 ease-out",
        "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        "focus-ring",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
