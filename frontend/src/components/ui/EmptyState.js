export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && <div className="mb-4 text-zinc-700">{icon}</div>}
      <h3 className="text-lg font-semibold text-zinc-400 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-600 mb-6 text-center max-w-sm">{description}</p>
      )}
      {action && action}
    </div>
  );
}
