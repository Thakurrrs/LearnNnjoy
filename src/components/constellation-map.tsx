"use client";

import { getTrailPositions } from "@/lib/constellation-layout";
import type { GradeSevenAdventureId, GradeSevenChapter, GradeSevenComingSoonChapter } from "@/components/grade-seven-adventures";

export function ConstellationMap({ chapters, completedIds, selectedId, onSelect }: {
  chapters: ReadonlyArray<GradeSevenChapter | GradeSevenComingSoonChapter>;
  completedIds: readonly GradeSevenAdventureId[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const positions = getTrailPositions(chapters.length);
  return (
    <div className="constellation" role="group" aria-label="Grade 7 topic constellation. Bright stars are playable; dim stars are coming soon.">
      <svg className="constellation-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <polyline points={positions.map((p) => `${p.x},${p.y}`).join(" ")} />
      </svg>
      {chapters.map((chapter, index) => {
        const comingSoon = "status" in chapter;
        const completed = !comingSoon && completedIds.includes(chapter.id as GradeSevenAdventureId);
        const p = positions[index];
        const state = comingSoon ? "dim" : completed ? "lit" : "ready";
        return (
          <button
            key={chapter.id}
            type="button"
            className={`star-node ${state}${selectedId === chapter.id ? " selected" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            aria-pressed={selectedId === chapter.id}
            aria-label={`${chapter.topic} — ${comingSoon ? "coming soon" : completed ? "star lit, play again" : "ready to play"}`}
            onClick={() => onSelect(chapter.id)}
          >
            <i aria-hidden>✦</i>
            <small>{chapter.topic}</small>
          </button>
        );
      })}
    </div>
  );
}
