export function Card({ children, className = "", variant = "default", hover = false }) {
  const variants = {
    default: "bg-zinc-900/80 border-zinc-800",
    primary: "bg-zinc-900/80 border-zinc-800",
    glass: "bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm",
  };

  return (
    <div
      className={`rounded-2xl border ${variants[variant]} transition-all duration-300 ${hover ? "hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`px-6 py-5 border-b border-zinc-800/50 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}
