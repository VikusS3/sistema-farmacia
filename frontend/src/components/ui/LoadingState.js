export function LoadingState({ type = "default" }) {
  if (type === "table") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded-full w-1/4" />
            <div className="h-4 bg-zinc-800 rounded-full w-1/3" />
            <div className="h-4 bg-zinc-800 rounded-full w-1/4" />
            <div className="h-4 bg-zinc-800 rounded-full w-1/6" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 space-y-4">
            <div className="h-3 bg-zinc-800 rounded-full w-1/2" />
            <div className="h-8 bg-zinc-800 rounded-full w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-12 justify-center">
      <div className="w-5 h-5 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-sm text-zinc-500">Cargando...</span>
    </div>
  );
}
