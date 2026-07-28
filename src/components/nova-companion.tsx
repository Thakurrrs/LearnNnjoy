"use client";

import { getCosmetic } from "@/lib/cosmetics";

export function NovaCompanion({ equippedCosmetic, size = "md", showName = false }: { equippedCosmetic: string; size?: "sm" | "md" | "lg"; showName?: boolean }) {
  const cosmetic = getCosmetic(equippedCosmetic);
  return (
    <span className={`nova-companion nova-${size}`} role="img" title={`Nova is wearing the ${cosmetic.label}`} aria-label={`Nova, wearing the ${cosmetic.label}`}>
      <span className="nova-star" aria-hidden>✨</span>
      <span className="nova-gear" aria-hidden>{cosmetic.emoji}</span>
      {showName && <small>Nova</small>}
    </span>
  );
}
