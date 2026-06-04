const variants = {
  primary: "bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20",
  secondary: "bg-zinc-800 hover:bg-zinc-700 text-white font-medium",
  ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white font-medium",
  outline: "border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
