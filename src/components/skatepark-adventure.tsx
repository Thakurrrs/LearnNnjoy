"use client";

import { useState } from "react";
import { HandAngleControl, supportsHandControl } from "@/components/hand-angle-control";
import { SparkleBurst } from "@/components/sparkle-burst";
import {
  WorldActionDeck,
  WorldHud,
  WorldNova,
  WorldReward,
} from "@/components/continuous-adventure-ui";
import { skateSkaterAlong, triangleMissingAngle } from "@/lib/grade-seven-worlds";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import type { SkateparkState } from "@/lib/grade-seven-progress";

type SkateparkAdventureProps = {
  state: SkateparkState;
  onChange: (state: SkateparkState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  onFinish: () => void;
};

const ANGLE_MEANING = "The amount of turn between two lines";
const ANGLE_PROOF = "It measures the turn between the ramp and ground";

function dialogueFor(state: SkateparkState, heroName: string) {
  if (state.step === 0) {
    return personalize("{hero}, the park opens tonight. Help me build one safe sixty-degree ramp!", heroName);
  }
  if (state.step === 1 && state.showDemo && state.angle < 50) {
    return "A flatter plank makes a smaller turn. The board barely rolls.";
  }
  if (state.step === 1 && state.showDemo) {
    return "A steeper plank makes a bigger turn. Gravity pulls the board downward.";
  }
  if (state.step === 1 && state.angle === 60) {
    return "Sixty degrees! The board rolls down the plank and reaches the course.";
  }
  if (state.step === 1) return `The ramp now turns ${state.angle}° away from the ground.`;
  if (state.step === 2 && state.triangleAngle === "60°") {
    return "All three corners are 60°. Together they make the triangle's 180°.";
  }
  if (state.step === 2 && state.triangleAngle) {
    return "Two corners total 120°. The last corner must complete 180°.";
  }
  if (state.step === 2) return "The blueprint reveals 60° + 60° + ? = 180°.";
  if (state.step === 3 && state.meaning === ANGLE_MEANING) {
    return "Yes. The angle describes the turn, even if the plank length changes.";
  }
  if (state.step === 3 && state.meaning) {
    return "The degree symbol measures turning. Metres would describe the plank's length.";
  }
  if (state.step === 3) return "The builders need the meaning of the 60° mark.";
  if (state.step === 4 && state.successChoice === ANGLE_PROOF) {
    return "The plan, ramp and board now tell the same mathematical story.";
  }
  if (state.step === 4 && state.successChoice) {
    return "Watch the wedge between the ground and ramp. That opening is the angle.";
  }
  return personalize("The rooftop course is alive, {hero}. Your sixty-degree turn works!", heroName);
}

function SkateparkStage({
  state,
  heroName,
  onChange,
}: {
  state: SkateparkState;
  heroName: string;
  onChange: (state: SkateparkState) => void;
}) {
  const set = (patch: Partial<SkateparkState>) => onChange({ ...state, ...patch });
  const skaterAlong = skateSkaterAlong(state.angle);
  const complete = state.angle === 60;
  const thinking = (!!state.triangleAngle && state.triangleAngle !== "60°")
    || (!!state.meaning && state.meaning !== ANGLE_MEANING)
    || (!!state.successChoice && state.successChoice !== ANGLE_PROOF);

  return (
    <div className={`skate-world-stage scene-${state.step}${state.step >= 5 ? " open" : ""}`}>
      <WorldHud label="ROOFTOP BUILD SITE" step={state.step} />
      <div className="skate-world-sky" aria-hidden><i /><span>✦</span><span>✧</span></div>
      <div className="skate-world-city" aria-hidden>
        {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
      </div>
      <div className="skate-world-lights" aria-hidden>{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>

      <WorldNova label="BUILD CREW" thinking={thinking}>
        {dialogueFor(state, heroName)}
      </WorldNova>

      <div className={`skate-world-ramp-zone${complete ? " target-angle" : ""}`} aria-label={`Rooftop ramp at ${state.angle} degrees`}>
        <span className="skate-world-ground" />
        <span
          className="skate-world-angle-wedge"
          style={{ ["--skate-angle" as string]: `${state.angle}deg` }}
          aria-hidden
        />
        <div className="skate-world-ramp" style={{ transform: `rotate(${-state.angle}deg)` }}>
          <i className="skate-ramp-rail" />
          <span className="skate-world-rider" style={{ left: `${skaterAlong}%` }} aria-hidden>
            <b>🧑🏽</b><em>🛹</em>
          </span>
        </div>
        <strong>{state.angle}°</strong>
        <small>TURN BETWEEN RAMP + GROUND</small>
      </div>

      {state.step === 2 && (
        <div className="skate-blueprint" aria-label="Triangle angle blueprint">
          <small>TRIANGLE DISCOVERY · TOTAL 180°</small>
          <div className="skate-triangle">
            <i />
            <span className="corner corner-one">60°</span>
            <span className="corner corner-two">60°</span>
            <span className="corner corner-three">{state.triangleAngle ?? "?"}</span>
          </div>
          <strong>60° + 60° + ? = 180°</strong>
          <div>
            {["30°", "60°", "120°"].map((choice) => (
              <button
                key={choice}
                className={state.triangleAngle === choice ? choice === "60°" ? "selected correct" : "selected" : ""}
                onClick={() => { sound.play(choice === "60°" ? "success" : "tap"); set({ triangleAngle: choice }); }}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.step === 3 && (
        <div className="skate-builder-board">
          <small>MESSAGE TO THE BUILDERS</small>
          <strong>“Make the ramp angle 60°.”</strong>
          {[ANGLE_MEANING, "The length of the ramp"].map((choice) => (
            <button
              key={choice}
              className={state.meaning === choice ? choice === ANGLE_MEANING ? "selected correct" : "selected" : ""}
              onClick={() => { sound.play(choice === ANGLE_MEANING ? "success" : "tap"); set({ meaning: choice }); }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {state.step === 4 && (
        <div className="skate-safety-console">
          <small>OPENING-NIGHT SAFETY CHECK</small>
          <strong>What does the 60° label prove?</strong>
          {[ANGLE_PROOF, "It measures the ramp's length", "It counts the board's wheels"].map((choice) => (
            <button
              key={choice}
              className={state.successChoice === choice ? choice === ANGLE_PROOF ? "selected correct" : "selected" : ""}
              onClick={() => {
                sound.play(choice === ANGLE_PROOF ? "success" : "tap");
                set({ successChoice: choice });
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {state.step >= 5 && (
        <div className="skate-world-finale" aria-live="polite">
          <SparkleBurst playKey="skate-world-complete" />
          <span aria-hidden>🛹　🛹　🛹</span>
          <small>ROOFTOP COURSE OPEN</small>
          <h2>The sixty-degree ramp rides smoothly.</h2>
          <p>Every triangle corner helped prove the design.</p>
        </div>
      )}
    </div>
  );
}

export function SkateparkAdventure({
  state,
  onChange,
  firstTime,
  replay,
  heroName,
  onFinish,
}: SkateparkAdventureProps) {
  const [handMode, setHandMode] = useState(false);
  const set = (patch: Partial<SkateparkState>) => onChange({ ...state, ...patch });
  const complete = state.angle === 60;

  return (
    <section className="world-adventure skate-world" aria-label="Skatepark Architect angle adventure">
      <SkateparkStage state={state} heroName={heroName} onChange={onChange} />

      {state.step === 0 && (
        <WorldActionDeck
          eyebrow="OPENING NIGHT BUILD"
          title="The first ramp needs a safe sixty-degree turn."
          description="Too flat barely moves the board. Too steep makes landing harder."
        >
          <button className="primary" onClick={() => set({ step: 1 })}>Join the rooftop crew →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && state.showDemo && (
        <WorldActionDeck
          eyebrow="NOVA SHOWS THE TURN"
          title="Tilt the real ramp and watch the rider."
          description="The rider stays on the plank. Steeper angles pull the board toward the ground."
        >
          <div className="world-button-row">
            <button onClick={() => set({ angle: 10 })}>Show a flat ramp</button>
            <button onClick={() => set({ angle: 60 })}>Show a steep ramp</button>
          </div>
          <button className="primary" onClick={() => set({ showDemo: false, angle: 20 })}>Take the angle controls →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && !state.showDemo && (
        <WorldActionDeck
          eyebrow="YOUR MOVE"
          title="Turn the ramp to exactly 60°."
          description="The rider moves with your ramp and rolls down at the target angle."
        >
          <input
            className="world-range"
            aria-label="Rooftop ramp angle"
            type="range"
            min="0"
            max="120"
            step="10"
            value={state.angle}
            onChange={(event) => set({ angle: Number(event.target.value) })}
          />
          <div className="world-stepper">
            <button onClick={() => set({ angle: Math.max(0, state.angle - 10) })}>Rotate back</button>
            <b>{state.angle}°</b>
            <button onClick={() => set({ angle: Math.min(120, state.angle + 10) })}>Rotate forward</button>
          </div>
          {supportsHandControl() && !handMode && (
            <button className="world-text-button" onClick={() => setHandMode(true)}>
              ✋ Try hand control—ask a grown-up first
            </button>
          )}
          {handMode && <HandAngleControl onAngle={(angle) => set({ angle })} onClose={() => setHandMode(false)} />}
          <button className="primary" disabled={!complete} onClick={() => set({ step: 2 })}>Open the triangle blueprint →</button>
        </WorldActionDeck>
      )}

      {state.step === 2 && (
        <WorldActionDeck
          eyebrow="TRIANGLE SECRET REVEALED"
          title="Every triangle's three angles total 180°."
          description={`60° + 60° leaves ${triangleMissingAngle(60, 60)}° for the final corner.`}
        >
          <button className="primary" disabled={state.triangleAngle !== "60°"} onClick={() => set({ step: 3 })}>Send the builder message →</button>
        </WorldActionDeck>
      )}

      {state.step === 3 && (
        <WorldActionDeck
          eyebrow="SPEAK LIKE AN ARCHITECT"
          title="Tell the builders what an angle measures."
          description="The 60° mark describes turning, not the plank's length."
        >
          <button className="primary" disabled={state.meaning !== ANGLE_MEANING} onClick={() => set({ step: 4 })}>Run the safety check →</button>
        </WorldActionDeck>
      )}

      {state.step === 4 && (
        <WorldActionDeck
          eyebrow="PROVE THE COURSE"
          title="Match the label to the moving ramp."
          description="The angle wedge, plank and ground must all agree."
        >
          <button className="primary" disabled={state.successChoice !== ANGLE_PROOF} onClick={() => set({ step: 5 })}>Open the skatepark →</button>
        </WorldActionDeck>
      )}

      {state.step === 5 && (
        <WorldActionDeck
          eyebrow={replay ? "JOURNAL REPLAY COMPLETE" : "SKATEPARK BUILD COMPLETE"}
          title={personalize("The first riders are rolling, {hero}.", heroName)}
          description="The ramp shows 60°, and the triangle shows a total of 180°."
        >
          <WorldReward replay={replay} firstTime={firstTime} />
          <button className="primary" onClick={onFinish}>
            {replay ? "Return to my journal →" : "Return to the star map →"}
          </button>
        </WorldActionDeck>
      )}
    </section>
  );
}
