const variants = {
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  error: "bg-red-500/10 border-red-500/20 text-red-300",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-300",
};

const icons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export function AlertBanner({ variant = "info", message, onDismiss }) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${variants[variant]}`}>
      <span className="text-base shrink-0">{icons[variant]}</span>
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          ✕
        </button>
      )}
    </div>
  );
}
