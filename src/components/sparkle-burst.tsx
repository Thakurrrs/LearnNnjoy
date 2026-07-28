"use client";

export function SparkleBurst({ playKey }: { playKey: string | number | null }) {
  if (playKey === null) return null;
  return (
    <span key={String(playKey)} className="sparkle-burst" aria-hidden>
      {Array.from({ length: 6 }, (_, index) => (
        <i key={index} style={{ ["--angle" as string]: `${index * 60}deg` }}>✦</i>
      ))}
    </span>
  );
}
