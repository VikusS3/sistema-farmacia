export function StatusDot({ active = true, variant = "success", pulse = true }) {
  const colors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <span className="relative flex h-2.5 w-2.5">
      {pulse && active && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[variant]} opacity-75`} />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[variant]}`} />
    </span>
  );
}
