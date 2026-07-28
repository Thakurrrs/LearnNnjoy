"use client";

export function WorldHud({ label, step }: { label: string; step: number }) {
  return (
    <div className="world-hud">
      <span>{label}</span>
      <b>{step < 5 ? `SCENE ${step + 1} OF 5` : "ADVENTURE COMPLETE"}</b>
    </div>
  );
}

export function WorldNova({
  label,
  children,
  thinking = false,
}: {
  label: string;
  children: React.ReactNode;
  thinking?: boolean;
}) {
  return (
    <div className="world-nova" aria-live="polite">
      <span className={thinking ? "nova-think" : ""}>✦</span>
      <div>
        <small>NOVA · {label}</small>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function WorldActionDeck({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="world-action-deck">
      <div className="world-action-copy">
        <small>{eyebrow}</small>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="world-action-controls">{children}</div>}
    </div>
  );
}

export function WorldReward({
  replay,
  firstTime,
}: {
  replay: boolean;
  firstTime: boolean;
}) {
  return (
    <div className="world-reward">
      <span>{replay ? "📖" : firstTime ? "🪙" : "✨"}</span>
      <b>{replay ? "Live progress stayed safe" : firstTime ? "+25 Lumina coins" : "Star already lit"}</b>
    </div>
  );
}
