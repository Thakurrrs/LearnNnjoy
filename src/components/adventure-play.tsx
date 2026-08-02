"use client";

import { useState } from "react";
import { HeroBadge } from "@/components/hero-badge";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import type { GradeSevenAdventureId } from "@/lib/grade-seven-progress";

export type AdventurePlayBeat = {
  speaker: "nova" | "hero" | "together";
  line: string;
};

export type AdventurePlayScript = {
  symbol: string;
  opening: readonly AdventurePlayBeat[];
  closing: readonly AdventurePlayBeat[];
};

export const adventurePlayScripts: Record<GradeSevenAdventureId, AdventurePlayScript> = {
  moonbase: {
    symbol: "☄️",
    opening: [
      { speaker: "nova", line: "{hero}, Blink followed a rare comet beyond the telescope map!" },
      { speaker: "hero", line: "His signal is blinking through the outer zoom rings." },
      { speaker: "together", line: "We’ll rebuild his coordinate and bring home the comet photograph." },
    ],
    closing: [
      { speaker: "nova", line: "Exact coordinates found Blink, and our estimate aimed the telescope quickly!" },
      { speaker: "hero", line: "Each digit’s place gave the coordinate its value." },
      { speaker: "together", line: "The comet bloom now shines across the moonbase dome." },
    ],
  },
  mountain: {
    symbol: "🚁",
    opening: [
      { speaker: "nova", line: "{hero}! The storm knocked my rescue pod from level plus three!" },
      { speaker: "hero", line: "I see base camp at zero. I’ll track every level." },
      { speaker: "together", line: "Please help me find it—even if it fell below zero." },
    ],
    closing: [
      { speaker: "nova", line: "The signal is back! We found the pod at minus four." },
      { speaker: "hero", line: "Then six levels up brought it safely to plus two." },
      { speaker: "together", line: "Rescue complete! Your integer map brought everyone home." },
    ],
  },
  balance: {
    symbol: "⚖️",
    opening: [
      { speaker: "nova", line: "{hero}, this crate says mystery plus five equals twelve—but it won’t open!" },
      { speaker: "hero", line: "We’ll remove the same amount from both sides." },
      { speaker: "together", line: "Help me keep the scale fair and reveal the mystery." },
    ],
    closing: [
      { speaker: "nova", line: "The beam is level, and the mystery value is seven!" },
      { speaker: "hero", line: "We changed both sides equally, so the equation stayed true." },
      { speaker: "together", line: "You unlocked it with fairness—not guessing!" },
    ],
  },
  shop: {
    symbol: "🎒",
    opening: [
      { speaker: "nova", line: "{hero}, two shops shout “best deal!” I don’t know which to trust." },
      { speaker: "hero", line: "We’ll calculate each discount, then compare final prices." },
      { speaker: "together", line: "Help me buy the kit before the trail closes!" },
    ],
    closing: [
      { speaker: "nova", line: "The twenty-five percent discount removes sixty rupees!" },
      { speaker: "hero", line: "That leaves a final price of one hundred eighty rupees." },
      { speaker: "together", line: "Kit packed! You compared real prices like a smart shopper." },
    ],
  },
  skatepark: {
    symbol: "🛹",
    opening: [
      { speaker: "nova", line: "{hero}, my ramp must meet the ground at sixty degrees, but this plan wobbles!" },
      { speaker: "hero", line: "We’ll measure the turn and check the triangle." },
      { speaker: "together", line: "Help me make the ramp safe before the park opens." },
    ],
    closing: [
      { speaker: "nova", line: "The board rolls smoothly—the ramp is exactly sixty degrees!" },
      { speaker: "hero", line: "And the triangle’s three angles total one hundred eighty degrees." },
      { speaker: "together", line: "The course is open because you measured, tested and proved it." },
    ],
  },
  cricket: {
    symbol: "🏏",
    opening: [
      { speaker: "nova", line: "{hero}, the final starts soon, but choosing only my friends wouldn’t be fair." },
      { speaker: "hero", line: "We’ll read the score bars and use their evidence." },
      { speaker: "together", line: "Help me choose the squad the data supports." },
    ],
    closing: [
      { speaker: "nova", line: "Asha, Kabir and Noor have the three highest bars!" },
      { speaker: "hero", line: "The graph gives evidence for every place on the squad." },
      { speaker: "together", line: "Team ready! You used data to make a fair decision." },
    ],
  },
};

export function AdventurePlay({
  id,
  phase,
  heroName,
  avatar,
  equippedCosmetic,
}: {
  id: GradeSevenAdventureId;
  phase: "opening" | "closing";
  heroName: string;
  avatar: string;
  equippedCosmetic?: string;
}) {
  const [beatIndex, setBeatIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const script = adventurePlayScripts[id];
  const beats = script[phase];
  const beat = beats[beatIndex];
  const lastBeat = beatIndex === beats.length - 1;

  if (dismissed) return null;

  function advance() {
    sound.play(lastBeat ? "success" : "tap");
    if (lastBeat) setDismissed(true);
    else setBeatIndex((current) => current + 1);
  }

  return (
    <div className="adventure-play-backdrop">
      <section
        className={`adventure-play play-${id} play-${phase}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`adventure-play-title-${id}-${phase}`}
      >
        <header>
          <div>
            <p>{phase === "opening" ? "BEFORE THE ADVENTURE" : "AFTER YOUR DISCOVERY"}</p>
            <h2 id={`adventure-play-title-${id}-${phase}`}>
              {phase === "opening" ? "Nova needs your help" : "Look what your idea changed"}
            </h2>
          </div>
          <button className="text-button" type="button" onClick={() => setDismissed(true)}>
            {phase === "opening" ? "Skip intro" : "Continue"}
          </button>
        </header>

        <div className={`adventure-play-stage speaker-${beat.speaker}`}>
          <span className="play-world-symbol" aria-hidden>{script.symbol}</span>
          <span className="play-world-trail" aria-hidden>✦ · ✧ · ✦</span>

          <div className="play-nova-character">
            <span className="nova-mascot" role="img" aria-label="Nova, a small glowing adventure companion">
              <i className="nova-ear nova-ear-left" />
              <i className="nova-ear nova-ear-right" />
              <b className="nova-eye nova-eye-left" />
              <b className="nova-eye nova-eye-right" />
              <em>✦</em>
            </span>
            <small>NOVA</small>
          </div>

          <div className="play-hero-character">
            <HeroBadge
              avatar={avatar}
              name={heroName}
              size="lg"
              equippedCosmetic={equippedCosmetic}
            />
          </div>

          <div className="play-dialogue" key={`${phase}-${beatIndex}`} aria-live="polite">
            <small>{beat.speaker === "nova" ? "NOVA" : beat.speaker === "hero" ? heroName.toUpperCase() : "NOVA + YOU"}</small>
            <p>{personalize(beat.line, heroName)}</p>
          </div>
        </div>

        <footer>
          <div className="play-dots" aria-label={`Scene ${beatIndex + 1} of ${beats.length}`}>
            {beats.map((_, index) => <i key={index} className={index <= beatIndex ? "lit" : ""} />)}
          </div>
          <button className="primary" type="button" onClick={advance}>
            {lastBeat
              ? phase === "opening" ? "I’m ready to help →" : "See the adventure result →"
              : "Next scene →"}
          </button>
        </footer>
      </section>
    </div>
  );
}
