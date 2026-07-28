"use client";

import { useState } from "react";
import Image from "next/image";
import { getAvatar } from "@/lib/avatars";
import { getCosmetic } from "@/lib/cosmetics";
import { getPet, getPetStage } from "@/lib/pets";

export function HeroBadge({ avatar, name, size = "md", level, equippedCosmetic }: { avatar: string; name?: string; size?: "sm" | "md" | "lg"; level?: number; equippedCosmetic?: string }) {
  const hero = getAvatar(avatar);
  const [imgFailed, setImgFailed] = useState(false);
  const cosmetic = equippedCosmetic ? getCosmetic(equippedCosmetic) : null;
  const ring = cosmetic?.id === "aurora" ? "ring-aurora" : cosmetic?.id === "starglow" ? "ring-starglow" : "ring-gold";
  return (
    <span className={`hero-badge hero-${size} ${ring}`} role="img" aria-label={name ? `${name} the explorer` : hero.alt}>
      <span className="hero-portrait" aria-hidden>
        {imgFailed ? <span className="hero-fallback">{hero.fallbackEmoji}</span> : <Image src={hero.image} alt="" width={128} height={128} onError={() => setImgFailed(true)} />}
      </span>
      {cosmetic && <span className="hero-gear" aria-hidden>{cosmetic.emoji}</span>}
      {typeof level === "number" && <span className="hero-level">Lv {level}</span>}
      {name && <small className="hero-name">{name}</small>}
    </span>
  );
}

export function HeroDuo({ avatar, name, equippedCosmetic, level, pet, size = "md" }: { avatar: string; name?: string; equippedCosmetic?: string; level?: number; pet?: string | null; size?: "sm" | "md" | "lg" }) {
  const chosen = getPet(pet ?? null);
  const stage = typeof level === "number" ? getPetStage(level) : 0;
  return (
    <span className={`hero-duo hero-duo-${size}`}>
      <HeroBadge avatar={avatar} name={name} size={size} level={level} equippedCosmetic={equippedCosmetic} />
      <span className="duo-nova" role="img" aria-label="Nova, your star friend">✨</span>
      {chosen && stage > 0 && <span className={`duo-pet pet-stage-${stage}`} role="img" aria-label={`${chosen.name} the ${chosen.species}`}>{chosen.emoji}</span>}
    </span>
  );
}
