export function Table({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-zinc-800 ${className}`}>
      <table className="w-full">{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead>
      <tr className="bg-zinc-800/50">{children}</tr>
    </thead>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-zinc-800/50">{children}</tbody>;
}

export function TableRow({ children, className = "", href }) {
  const Component = href ? "a" : "tr";
  return (
    <Component
      className={`transition-colors duration-150 hover:bg-zinc-800/30 ${className}`}
      {...(href ? { href } : {})}
    >
      {children}
    </Component>
  );
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-5 py-4 text-sm ${className}`}>{children}</td>;
}
