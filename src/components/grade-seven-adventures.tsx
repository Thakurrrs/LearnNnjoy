"use client";

import { AdventurePlay } from "@/components/adventure-play";
import { BalanceLabAdventure } from "@/components/balance-lab-adventure";
import { CricketDataAdventure } from "@/components/cricket-data-adventure";
import { MountainRescueAdventure } from "@/components/mountain-rescue-adventure";
import { MoonbaseTenfoldAdventure } from "@/components/moonbase-tenfold-adventure";
import { SkateparkAdventure } from "@/components/skatepark-adventure";
import { SmartShopperAdventure } from "@/components/smart-shopper-adventure";
import {
  isGradeSevenAdventureReady,
  type GradeSevenActivityMode,
  type GradeSevenAdventureId,
  type GradeSevenInteractionState,
} from "@/lib/grade-seven-progress";

export type { GradeSevenAdventureId } from "@/lib/grade-seven-progress";

export type GradeSevenChapter = {
  id: GradeSevenAdventureId;
  icon: string;
  title: string;
  topic: string;
  subtopics: string[];
  intro: string;
  // Shown instead of `intro` once the star is lit, so a completed adventure
  // stops inviting the child to a problem they already solved.
  revisitIntro: string;
  action: string;
  // Present (always "soon") only for adventures gated by
  // NOT_READY_ADVENTURE_IDS; absent entirely for ready ones. The map/detail
  // card and ConstellationMap both key off `"status" in chapter`, matching
  // the pattern already used for gradeSevenComingSoonChapters below.
  status?: "soon";
};

const REAL_ADVENTURES: Omit<GradeSevenChapter, "status">[] = [
  { id: "moonbase", icon: "🌙", title: "Moonbase Tenfold", topic: "Large Numbers", subtopics: ["Place value and tenfold relationships", "Indian and international grouping", "Comparison and estimation"], intro: "{hero}, Blink followed a rare comet beyond our telescope map. Help Nova rebuild the enormous coordinate?", revisitIntro: "Visit the moonbase again →", action: "Launch the comet mission" },
  { id: "mountain", icon: "🏔️", title: "Mountain Rescue", topic: "Integers", subtopics: ["Positive and negative positions", "Number-line movement", "Addition and subtraction"], intro: "{hero}! A storm knocked my rescue pod off the cliff. Help me find it?", revisitIntro: "Visit the mountain again →", action: "Explore integers" },
  { id: "balance", icon: "⚖️", title: "Balance Lab", topic: "Simple Equations", subtopics: ["Equality", "Inverse operations", "Solving for an unknown"], intro: "A locked capsule is waiting for steady hands…", revisitIntro: "Visit Balance Lab again →", action: "Explore equations" },
  { id: "shop", icon: "🛍️", title: "Smart Shopper", topic: "Comparing Quantities", subtopics: ["Percentages as fractions", "Discounts", "Comparing final prices"], intro: "The night market is still setting up its stalls…", revisitIntro: "Visit the market again →", action: "Explore percentages" },
  { id: "skatepark", icon: "🛹", title: "Nova’s Night Run", topic: "Lines and Angles", subtopics: ["Intersecting lines", "Vertically opposite angles", "Linear pairs"], intro: "{hero}! Two riders want to perform a mirrored glow trick. Help me map their crossing paths?", revisitIntro: "Visit the skatepark again →", action: "Plan the glow trick" },
  { id: "cricket", icon: "🏏", title: "Cricket Data Room", topic: "Data Handling", subtopics: ["Reading bar graphs", "Comparing values", "Making evidence-based choices"], intro: "The scoreboard is still warming up…", revisitIntro: "Visit the stadium again →", action: "Explore data" },
];

export const gradeSevenAdventures: GradeSevenChapter[] = REAL_ADVENTURES.map((chapter): GradeSevenChapter =>
  isGradeSevenAdventureReady(chapter.id) ? chapter : { ...chapter, status: "soon" as const },
);

// Shows the pre-play invite until the star is lit, then switches to a short
// revisit line — fixes the stale "help me!" invite that used to linger on
// completed adventures' detail cards (kid-lens finding #12/#30).
export function adventureIntroLine(chapter: GradeSevenChapter, completed: boolean): string {
  return completed ? chapter.revisitIntro : chapter.intro;
}

export type GradeSevenComingSoonChapter = Omit<GradeSevenChapter, "id" | "action" | "status" | "revisitIntro"> & { id: string; status: "coming" };

export const gradeSevenComingSoonChapters: GradeSevenComingSoonChapter[] = [
  { id: "fractions-decimals", status: "coming", icon: "🍲", title: "Recipe Lab", topic: "Fractions and Decimals", subtopics: ["Equivalent parts", "Decimal place value", "Comparing quantities"], intro: "Mix ingredients precisely enough to power Nova’s portable kitchen." },
  { id: "rational-numbers", status: "coming", icon: "🪐", title: "Portal Coordinates", topic: "Rational Numbers", subtopics: ["Number-line positions", "Positive and negative fractions", "Comparing rational numbers"], intro: "Plot safe portal coordinates across Nova’s sky map." },
  { id: "triangles", status: "coming", icon: "🌉", title: "Skybridge Survey", topic: "The Triangle and Its Properties", subtopics: ["Angle sums", "Kinds of triangles", "Side and angle relationships"], intro: "Design a skybridge that stays strong from every direction." },
  { id: "congruence", status: "coming", icon: "🧩", title: "Twin Temple", topic: "Congruence of Triangles", subtopics: ["Matching parts", "Congruence rules", "Proof through construction"], intro: "Match ancient temple pieces that are exactly the same shape and size." },
  { id: "practical-geometry", status: "coming", icon: "🧭", title: "Compass Forge", topic: "Practical Geometry", subtopics: ["Constructing angles", "Triangles", "Accurate measurements"], intro: "Forge precise map tools for Nova’s next expedition." },
  { id: "mensuration", status: "coming", icon: "🌿", title: "Garden Builder", topic: "Perimeter and Area", subtopics: ["Boundary length", "Area", "Composite shapes"], intro: "Build a community garden using exactly the space and fence available." },
  { id: "algebraic-expressions", status: "coming", icon: "🔐", title: "Code Garden", topic: "Algebraic Expressions", subtopics: ["Variables", "Terms and coefficients", "Simplifying expressions"], intro: "Decode a growing pattern that unlocks a hidden garden." },
  { id: "exponents", status: "coming", icon: "⚡", title: "Power Station", topic: "Exponents and Powers", subtopics: ["Repeated multiplication", "Powers of ten", "Large-number patterns"], intro: "Charge Lumina’s station with compact power codes." },
  { id: "symmetry", status: "coming", icon: "🪞", title: "Mirror Maze", topic: "Symmetry", subtopics: ["Lines of symmetry", "Rotational symmetry", "Pattern design"], intro: "Use reflections to find the true path through a shifting maze." },
  { id: "solid-shapes", status: "coming", icon: "🔭", title: "Starlight Observatory", topic: "Visualising Solid Shapes", subtopics: ["Faces, edges and vertices", "Views of solids", "Nets"], intro: "Build an observatory from 3D modules that fit together perfectly." },
];

export const conceptBeats: Record<GradeSevenAdventureId, readonly string[]> = {
  moonbase: ["Watch the telescope!", "The same digit can sit in different places.", "One place left makes its value ten times greater.", "Commas can group one number in different ways.", "Exact finds the comet; rounded helps us aim."],
  mountain: ["Watch me first!", "Base camp is ZERO.", "I fly UP one level. That is plus 1.", "I drop DOWN two. Past zero—minus 1!", "Down means MINUS. Up means PLUS."],
  balance: ["Watch the scale!", "I take a block from ONE side only.", "Crash—the beam tips! That is not fair.", "Same from BOTH sides keeps it level.", "Fair moves keep the balance true."],
  shop: ["Watch the price!", "₹240 is the WHOLE bar.", "25% means one of four equal parts.", "I shade one part—₹60 falls away!", "The rest is what we pay."],
  skatepark: ["Choose any direction and make one straight skating trail.", "Tilt one crossing trail and all four openings change.", "Mirror riders use matching openings across the X.", "A straight exit uses the openings side by side.", "The same patterns plan a new crossing."],
  cricket: ["Watch me read a bar!", "Ira’s bar stops at 21.", "Asha’s bar climbs to 42—twice as tall!", "Taller bar means a bigger number.", "The chart never guesses."],
};

// mountain's copy below is a separate hand-written match for the finale in
// mountain-rescue-adventure.tsx (docked cell, warm shelter, Pip, aurora) —
// this module can't import that file's own copy without a circular import.
// Phase 5's journal work should extract a single shared, import-free copy
// module so the two can't drift apart.
export const finaleCopy: Record<GradeSevenAdventureId, { title: string; detail: string; art: string }> = {
  moonbase: { title: "Comet captured!", detail: "\"Exact found Blink, {hero}, and your estimate aimed the telescope fast. Look at that dome photo!\"", art: "🌙📷☄️" },
  mountain: { title: "Ridge Shelter is warm!", detail: "\"The energy cell is docked, {hero}! Pip found his cosy corner, and the aurora came out to watch.\"", art: "🦊🌌🏔️" },
  balance: { title: "Crate open!", detail: "\"Seven glowing blocks, {hero}! It worked because you kept both sides fair!\"", art: "📦✨⚖️" },
  shop: { title: "Deal done!", detail: "\"₹60 off, ₹180 paid—you saved us real coins, {hero}! Kit packed!\"", art: "🎒🏮🪙" },
  skatepark: { title: "Night run complete!", detail: "\"We cracked it, {hero}! The mirror riders matched across, and the exit stayed straight.\"", art: "🛹🌆✨" },
  cricket: { title: "Squad picked!", detail: "\"Asha, Kabir and Noor—chosen by your data, {hero}! Listen to that crowd!\"", art: "🏏🏟️🎉" },
};

export function GradeSevenActivity({
  id,
  state,
  mode,
  firstTime,
  heroName,
  avatar,
  equippedCosmetic,
  onChange,
  onFinish,
}: {
  id: GradeSevenAdventureId;
  state: GradeSevenInteractionState;
  mode: GradeSevenActivityMode;
  firstTime: boolean;
  heroName: string;
  avatar: string;
  equippedCosmetic?: string;
  onChange: (state: GradeSevenInteractionState) => void;
  onFinish: (finalState?: GradeSevenInteractionState) => void;
}) {
  const characterPlay = id !== "skatepark" && id !== "mountain" && id !== "moonbase" && id !== "balance" && (state.step === 0 || state.step === 5) && (
    <AdventurePlay
      key={`${id}-${state.step}`}
      id={id}
      phase={state.step === 0 ? "opening" : "closing"}
      heroName={heroName}
      avatar={avatar}
      equippedCosmetic={equippedCosmetic}
    />
  );
  const shared = {
    firstTime,
    replay: mode === "replay",
    heroName,
    onFinish,
  };

  if (id === "mountain" && state.kind === "mountain") {
    return (
      <section className="activity-panel mountain-benchmark-panel">
        {characterPlay}
        <MountainRescueAdventure state={state} onChange={onChange} avatar={avatar} {...shared} />
      </section>
    );
  }

  if (id === "moonbase" && state.kind === "moonbase") {
    return (
      <section className="activity-panel moonbase-benchmark-panel">
        <MoonbaseTenfoldAdventure state={state} onChange={onChange} avatar={avatar} {...shared} />
      </section>
    );
  }

  return (
    <section className="activity-panel continuous-world-panel">
      {characterPlay}
      {id === "balance" && state.kind === "balance" && <BalanceLabAdventure state={state} onChange={onChange} avatar={avatar} {...shared} />}
      {id === "shop" && state.kind === "shop" && <SmartShopperAdventure state={state} onChange={onChange} {...shared} />}
      {id === "skatepark" && state.kind === "skatepark" && <SkateparkAdventure state={state} onChange={onChange} avatar={avatar} {...shared} />}
      {id === "cricket" && state.kind === "cricket" && <CricketDataAdventure state={state} onChange={onChange} {...shared} />}
    </section>
  );
}
