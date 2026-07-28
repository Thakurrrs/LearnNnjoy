"use client";

export function NovaShows({ lines, cta = "My turn! →", onDone, children }: {
  lines: readonly string[];
  cta?: string;
  onDone: () => void;
  children?: React.ReactNode;
}) {
  return (
    <aside className="nova-shows" aria-label="Nova shows you first">
      <div className="nova-shows-head"><span aria-hidden>✨</span><b>NOVA SHOWS YOU</b></div>
      {children}
      {lines.map((line) => <p key={line}>{line}</p>)}
      <button className="primary" onClick={onDone}>{cta}</button>
    </aside>
  );
}
