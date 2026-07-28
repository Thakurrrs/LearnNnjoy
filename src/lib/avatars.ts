export type AvatarId = "boy" | "girl" | "explorer";
export type Avatar = { id: AvatarId; label: string; image: string; fallbackEmoji: string; alt: string };

export const avatars: readonly Avatar[] = [
  { id: "explorer", label: "Star explorer", image: "/images/avatars/hero-explorer.webp", fallbackEmoji: "🧑‍🚀", alt: "A young explorer in a soft hooded star-cloak, smiling warmly" },
  { id: "boy", label: "Boy explorer", image: "/images/avatars/hero-boy.webp", fallbackEmoji: "👦", alt: "A brave young boy explorer with a backpack, smiling confidently" },
  { id: "girl", label: "Girl explorer", image: "/images/avatars/hero-girl.webp", fallbackEmoji: "👧", alt: "A brave young girl explorer with braided hair, smiling confidently" },
];

export function getAvatar(id: string): Avatar {
  return avatars.find((avatar) => avatar.id === id) ?? avatars[0];
}
