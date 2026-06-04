const variants = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({ children, variant = "default", size = "sm", className = "", dot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant === "default" ? "bg-zinc-400" : variant === "success" ? "bg-emerald-400" : variant === "warning" ? "bg-amber-400" : variant === "danger" ? "bg-red-400" : "bg-blue-400"}`} />
      )}
      {children}
    </span>
  );
}
