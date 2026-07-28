"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { SparkleBurst } from "@/components/sparkle-burst";
import {
  altitudeFromPointer,
  appendAltitudeTrail,
  clampAltitude,
  formatAltitude,
  MOUNTAIN_BEACON,
  MOUNTAIN_BOTTOM,
  mountainBriefing,
  mountainDisplayPosition,
  mountainNarration,
  MOUNTAIN_SAFE_LEDGE,
  MOUNTAIN_START,
  MOUNTAIN_TOP,
} from "@/lib/mountain-rescue";
import {
  novaVoiceDelivery,
  prepareNovaSpeech,
  rankNovaVoices,
  type NovaVoiceTone,
} from "@/lib/nova-voice";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import type { MountainState } from "@/lib/grade-seven-progress";

type MountainRescueAdventureProps = {
  state: MountainState;
  onChange: (state: MountainState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  onFinish: () => void;
};

const levels = Array.from(
  { length: MOUNTAIN_TOP - MOUNTAIN_BOTTOM + 1 },
  (_, index) => MOUNTAIN_TOP - index,
);
const NOVA_VOICE_KEY = "learnnjoy-nova-voice";

function NarrationButton({ text, tone }: { text: string; tone: NovaVoiceTone }) {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synthesis = window.speechSynthesis;
    const loadVoices = () => {
      const ranked = rankNovaVoices(synthesis.getVoices());
      setVoices(ranked);
      setVoiceName((current) => {
        if (ranked.some((voice) => voice.name === current)) return current;
        try {
          const saved = window.localStorage.getItem(NOVA_VOICE_KEY);
          if (saved && ranked.some((voice) => voice.name === saved)) return saved;
        } catch {}
        return ranked[0]?.name ?? "";
      });
    };
    loadVoices();
    synthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      synthesis.removeEventListener("voiceschanged", loadVoices);
      synthesis.cancel();
    };
  }, []);

  function speak(voiceOverride?: SpeechSynthesisVoice) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (speaking && !voiceOverride) {
      setSpeaking(false);
      return;
    }
    const selectedVoice = voiceOverride ?? voices.find((voice) => voice.name === voiceName) ?? voices[0];
    const delivery = novaVoiceDelivery(tone);
    const utterance = new SpeechSynthesisUtterance(prepareNovaSpeech(text));
    utterance.voice = selectedVoice ?? null;
    utterance.lang = selectedVoice?.lang ?? "en-IN";
    utterance.rate = delivery.rate;
    utterance.pitch = delivery.pitch;
    utterance.volume = delivery.volume;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function tryAnotherVoice() {
    if (voices.length < 2) return;
    const currentIndex = Math.max(0, voices.findIndex((voice) => voice.name === voiceName));
    const nextVoice = voices[(currentIndex + 1) % voices.length];
    setVoiceName(nextVoice.name);
    try {
      window.localStorage.setItem(NOVA_VOICE_KEY, nextVoice.name);
    } catch {}
    speak(nextVoice);
  }

  return <div className="mountain-listen-row">
    <button className="mountain-listen" type="button" onClick={() => speak()} aria-label="Hear Nova read this">
      {speaking ? "◼ Stop" : "🔊 Hear Nova"}
    </button>
    {voices.length > 1 && <button className="mountain-voice-cycle" type="button" onClick={tryAnotherVoice} aria-label="Try another Nova voice">
      ↻ Try another voice
    </button>}
  </div>;
}

function RescuePod() {
  return <span className="rescue-pod" aria-hidden>
    <i className="pod-rotor" />
    <i className="pod-tail" />
    <i className="pod-body"><b /></i>
    <i className="pod-skid" />
  </span>;
}

function dialogueFor(state: MountainState, heroName: string): string {
  if (state.step === 0) {
    return personalize("{hero}, the pod is holding at +3—but its signal vanished below base camp!", heroName);
  }
  if (state.step === 1 && state.showDemo) return mountainBriefing[state.briefingBeat];
  if (state.step === 1) return mountainNarration(state, heroName);
  if (state.step === 2) {
    if (state.direction === "above") return "The gold line is zero. The −4 beacon flashes below it—look down.";
    if (state.direction === "below") return "Exactly. Minus four means four levels below zero.";
    return "The beacon reads −4. Tap the part of the cliff where the team should search.";
  }
  if (state.step === 3) {
    if (state.equation === "3 + 7 = −4") return "The pod moved down, so the log removes seven from three.";
    if (state.equation === "3 − 7 = −4") return "Route saved: start at +3, move down 7, arrive at −4.";
    return "The flight log needs the number sentence that matches the pod’s path.";
  }
  if (state.step === 4) {
    if (state.returnPosition === MOUNTAIN_SAFE_LEDGE && state.successChoice === "−4 + 6 = +2") {
      return "Both rescue routes check out. The pod is safe at plus two!";
    }
    if (state.successChoice === "−4 − 6 = +2") {
      return "The winch climbed up. Moving up adds six—it does not subtract six.";
    }
    return mountainNarration(state, heroName);
  }
  return personalize("You turned the whole cliff into a number map, {hero}. Rescue complete!", heroName);
}

function dialogueToneFor(state: MountainState): NovaVoiceTone {
  if (state.step === 0) return "alert";
  if (state.direction === "above" || state.equation === "3 + 7 = −4" || state.successChoice === "−4 − 6 = +2") return "retry";
  if (state.step === 5) return "celebrate";
  if (
    state.direction === "below"
    || state.equation === "3 − 7 = −4"
    || state.position === MOUNTAIN_BEACON
    || state.returnPosition === MOUNTAIN_SAFE_LEDGE
  ) return "success";
  return "explain";
}

function MountainStage({
  state,
  heroName,
  onMove,
  onDirection,
  onEquation,
}: {
  state: MountainState;
  heroName: string;
  onMove: (position: number) => void;
  onDirection: (direction: string) => void;
  onEquation: (equation: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const displayPosition = mountainDisplayPosition(state);
  const interactive = (state.step === 1 && !state.showDemo) || state.step === 4;
  const dialogue = dialogueFor(state, heroName);
  const dialogueTone = dialogueToneFor(state);
  const visited = new Set(state.flightPath);

  function moveFromPointer(clientY: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    onMove(altitudeFromPointer(clientY, rect.top, rect.height));
  }

  function beginDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!interactive) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setDragging(true);
    moveFromPointer(event.clientY);
  }

  function drag(event: ReactPointerEvent<HTMLDivElement>) {
    if (draggingRef.current) moveFromPointer(event.clientY);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    moveFromPointer(event.clientY);
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function beginMouseDrag(event: ReactMouseEvent<HTMLDivElement>) {
    if (!interactive || draggingRef.current) return;
    draggingRef.current = true;
    setDragging(true);
    moveFromPointer(event.clientY);
  }

  function mouseDrag(event: ReactMouseEvent<HTMLDivElement>) {
    if (draggingRef.current) moveFromPointer(event.clientY);
  }

  function endMouseDrag(event: ReactMouseEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    moveFromPointer(event.clientY);
    draggingRef.current = false;
    setDragging(false);
  }

  return <div className={`mountain-stage scene-${state.step}${state.showDemo ? " briefing" : ""}${state.step >= 5 ? " sunrise" : ""}`}>
    <div className="mountain-hud">
      <span>INTEGER RESCUE</span>
      <b>{state.step < 5 ? `SCENE ${state.step + 1} OF 5` : "MISSION COMPLETE"}</b>
    </div>

    <div className="mountain-weather" aria-hidden>
      <i className="storm-cloud cloud-a" />
      <i className="storm-cloud cloud-b" />
      <i className="lightning">ϟ</i>
      <span className="rain rain-a">╲ ╲ ╲ ╲ ╲</span>
      <span className="rain rain-b">╲ ╲ ╲ ╲</span>
      <i className="mountain-sun" />
    </div>
    <div className="ridge ridge-far" aria-hidden />
    <div className="ridge ridge-near" aria-hidden />
    <div className="mountain-fog" aria-hidden />

    <div className="nova-radio" aria-live="polite">
      <span className={state.direction === "above" || state.equation === "3 + 7 = −4" || state.successChoice === "−4 − 6 = +2" ? "nova-think" : ""}>✦</span>
      <div><small>NOVA · RESCUE RADIO</small><p>{dialogue}</p><NarrationButton text={dialogue} tone={dialogueTone} /></div>
    </div>

    <div className="base-camp" aria-label="Base camp is level zero">
      <span aria-hidden>⛺</span><b>BASE CAMP</b><small>ZERO</small>
    </div>
    <div className="safe-ledge" aria-label="Safe ledge at plus two"><span>SAFE LEDGE</span><b>+2</b></div>
    <div className={`rescue-beacon${state.step >= 2 ? " found" : ""}`} aria-label="Rescue beacon at minus four">
      <i /><span>SIGNAL</span><b>−4</b>
    </div>

    <div
      className={`mountain-altitude-track${interactive ? " interactive" : ""}`}
      ref={trackRef}
      aria-label="Vertical integer cliff from plus eight to minus eight"
      onPointerDown={beginDrag}
      onPointerMove={drag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseDown={beginMouseDrag}
      onMouseMove={mouseDrag}
      onMouseUp={endMouseDrag}
    >
      {levels.map((level) => <span
        key={level}
        className={`altitude-tick${level === 0 ? " zero" : ""}${visited.has(level) ? " visited" : ""}${level === displayPosition ? " current" : ""}`}
        style={{ top: `${((MOUNTAIN_TOP - level) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 100}%` }}
      ><b>{formatAltitude(level)}</b></span>)}
      <button
        type="button"
        className={`mountain-pod-control${dragging ? " dragging" : ""}${interactive ? " interactive" : ""}`}
        style={{ top: `${((MOUNTAIN_TOP - displayPosition) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 100}%` }}
        disabled={!interactive}
        aria-label={interactive ? `Drag the rescue pod. Current level ${formatAltitude(displayPosition)}` : `Rescue pod at ${formatAltitude(displayPosition)}`}
      ><RescuePod /><strong>{formatAltitude(displayPosition)}</strong></button>
    </div>

    {state.step === 2 && <div className="mountain-zone-picks" aria-label="Choose where minus four is">
      <button className={state.direction === "above" ? "selected" : ""} onClick={() => onDirection("above")}>Search above zero</button>
      <button className={state.direction === "below" ? "selected correct" : ""} onClick={() => onDirection("below")}>Search below zero</button>
    </div>}

    {state.step === 3 && <div className="mountain-logbook">
      <small>FLIGHT LOG · START +3 · MOVE DOWN 7</small>
      <strong>Which entry matches the path?</strong>
      {["3 − 7 = −4", "3 + 7 = −4"].map((equation) => <button
        key={equation}
        className={state.equation === equation ? equation === "3 − 7 = −4" ? "selected correct" : "selected" : ""}
        onClick={() => onEquation(equation)}
      >{equation}</button>)}
    </div>}

    {state.step === 5 && <div className="mountain-finale" aria-live="polite">
      <SparkleBurst playKey="mountain-rescue-complete" />
      <span className="finale-team" aria-hidden>🧑🏽‍🚒 ✦ 🧑🏻‍🚒</span>
      <small>MISSION COMPLETE</small>
      <h2>Pod safe. Maths proven.</h2>
      <p>+3 down 7 reached −4. Then −4 up 6 reached +2.</p>
    </div>}
  </div>;
}

export function MountainRescueAdventure({
  state,
  onChange,
  firstTime,
  replay,
  heroName,
  onFinish,
}: MountainRescueAdventureProps) {
  const set = (patch: Partial<MountainState>) => onChange({ ...state, ...patch });
  const firstRouteComplete = state.position === MOUNTAIN_BEACON;
  const returnRouteComplete = state.returnPosition === MOUNTAIN_SAFE_LEDGE;
  const movedDown = Math.max(0, Math.min(7, MOUNTAIN_START - state.position));
  const liftedUp = Math.max(0, Math.min(6, state.returnPosition - MOUNTAIN_BEACON));

  function movePod(nextPosition: number) {
    const next = clampAltitude(nextPosition);
    if (state.step === 1 && !state.showDemo && next !== state.position) {
      sound.play("tap");
      set({
        position: next,
        flightPath: appendAltitudeTrail(state.flightPath, state.position, next),
      });
    } else if (state.step === 4 && next !== state.returnPosition) {
      sound.play("tap");
      set({ returnPosition: next, successChoice: null });
    }
  }

  function nudge(amount: number) {
    movePod((state.step === 4 ? state.returnPosition : state.position) + amount);
  }

  return <section className="mountain-adventure" aria-label="Mountain Rescue integer adventure">
    <MountainStage
      state={state}
      heroName={heroName}
      onMove={movePod}
      onDirection={(direction) => {
        sound.play(direction === "below" ? "success" : "tap");
        set({ direction });
      }}
      onEquation={(equation) => {
        sound.play(equation === "3 − 7 = −4" ? "success" : "tap");
        set({ equation });
      }}
    />

    <div className="mountain-action-deck">
      {state.step === 0 && <>
        <div><small>STORM ALERT</small><h2>The signal fell off the map.</h2><p>The pod starts three levels above base camp. Follow it before the storm closes in.</p></div>
        <button className="primary" onClick={() => set({ step: 1 })}>Join the rescue →</button>
      </>}

      {state.step === 1 && state.showDemo && <>
        <div className="briefing-progress" aria-label={`Nova explanation ${state.briefingBeat + 1} of ${mountainBriefing.length}`}>
          {mountainBriefing.map((_, index) => <i key={index} className={index <= state.briefingBeat ? "lit" : ""} />)}
        </div>
        <div><small>NOVA SHOWS THE CLIFF CODE</small><h2>{mountainBriefing[state.briefingBeat]}</h2><p>Watch the pod and the highlighted number move together.</p></div>
        <button className="primary" onClick={() => state.briefingBeat < mountainBriefing.length - 1
          ? set({ briefingBeat: state.briefingBeat + 1 })
          : set({ showDemo: false, position: MOUNTAIN_START, flightPath: [MOUNTAIN_START] })
        }>{state.briefingBeat < mountainBriefing.length - 1 ? "Show the next move →" : "Take the controls →"}</button>
      </>}

      {state.step === 1 && !state.showDemo && <>
        <div className="route-meter">
          <span><small>START</small><b>+3</b></span>
          <div>{Array.from({ length: 7 }, (_, index) => <i key={index} className={index < movedDown ? "lit" : ""} />)}</div>
          <span><small>DOWN</small><b>{movedDown}/7</b></span>
        </div>
        <div><small>YOUR MOVE</small><h2>Drag the pod down seven levels.</h2><p>Pull the pod itself, or use the one-level controls. Watch what happens at zero.</p></div>
        <div className="mountain-step-controls">
          <button onClick={() => nudge(-1)} disabled={state.position <= MOUNTAIN_BOTTOM}>↓ Down 1</button>
          <b>{formatAltitude(state.position)}</b>
          <button onClick={() => nudge(1)} disabled={state.position >= MOUNTAIN_TOP}>Up 1 ↑</button>
        </div>
        <button className="primary" disabled={!firstRouteComplete} onClick={() => set({ step: 2 })}>Lock onto the −4 signal →</button>
      </>}

      {state.step === 2 && <>
        <div><small>READ THE WORLD</small><h2>What does the minus sign tell the team?</h2><p>Answer by searching above or below the gold zero line inside the scene.</p></div>
        <button className="primary" disabled={state.direction !== "below"} onClick={() => set({ step: 3 })}>Send the search team →</button>
      </>}

      {state.step === 3 && <>
        <div><small>TURN THE FLIGHT INTO MATHS</small><h2>The scene and the equation must tell the same story.</h2><p>The logbook is open inside the rescue world.</p></div>
        <button className="primary" disabled={state.equation !== "3 − 7 = −4"} onClick={() => set({ step: 4, returnPosition: MOUNTAIN_BEACON, successChoice: null })}>Start the rescue winch →</button>
      </>}

      {state.step === 4 && <>
        <div className="route-meter return-meter">
          <span><small>FOUND</small><b>−4</b></span>
          <div>{Array.from({ length: 6 }, (_, index) => <i key={index} className={index < liftedUp ? "lit" : ""} />)}</div>
          <span><small>UP</small><b>{liftedUp}/6</b></span>
        </div>
        <div><small>BRING THE POD HOME</small><h2>Lift six levels from −4 to the +2 ledge.</h2><p>Drag the pod upward. Then choose the equation that proves your rescue route.</p></div>
        <div className="mountain-step-controls">
          <button onClick={() => nudge(-1)} disabled={state.returnPosition <= MOUNTAIN_BOTTOM}>↓ Down 1</button>
          <b>{formatAltitude(state.returnPosition)}</b>
          <button onClick={() => nudge(1)} disabled={state.returnPosition >= MOUNTAIN_TOP}>Up 1 ↑</button>
        </div>
        {returnRouteComplete && <div className="mountain-proof">
          <strong>Which equation matches the climb?</strong>
          {["−4 + 6 = +2", "−4 − 6 = +2"].map((choice) => <button
            key={choice}
            className={state.successChoice === choice ? choice === "−4 + 6 = +2" ? "selected correct" : "selected" : ""}
            onClick={() => {
              sound.play(choice === "−4 + 6 = +2" ? "success" : "tap");
              set({ successChoice: choice });
            }}
          >{choice}</button>)}
        </div>}
        <button className="primary" disabled={state.successChoice !== "−4 + 6 = +2"} onClick={() => set({ step: 5 })}>Complete the rescue →</button>
      </>}

      {state.step === 5 && <>
        <div><small>{replay ? "JOURNAL REPLAY COMPLETE" : "INTEGER RESCUE COMPLETE"}</small><h2>{personalize("You made every move mean something, {hero}.", heroName)}</h2><p>Negative positions, subtraction and addition all lived on the same cliff.</p></div>
        <div className="mountain-reward">
          <span>{replay ? "📖" : firstTime ? "🪙" : "✨"}</span>
          <b>{replay ? "Live progress stayed safe" : firstTime ? "+25 Lumina coins" : "Star already lit"}</b>
        </div>
        <button className="primary" onClick={onFinish}>{replay ? "Return to my journal →" : "Return to the star map →"}</button>
      </>}
    </div>
  </section>;
}
