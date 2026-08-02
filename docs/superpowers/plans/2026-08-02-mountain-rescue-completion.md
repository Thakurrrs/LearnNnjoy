# Mountain Rescue Completion (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish Mountain Rescue per Phase 1 of the [Core Journey to Benchmark spec](../specs/2026-08-02-core-journey-to-benchmark-design.md): real finale act, enacted continuity (secure → hook → lift once), audible Quest 1 voice with an asset-existence test, and discoverable micro-interactions.

**Architecture:** All quest logic lives in `src/components/mountain-rescue-adventure.tsx` (2,171 lines) with state in `src/lib/grade-seven-progress.ts` (`MountainState` + sanitizer). Voice is mp3 files under `public/audio/mountain-rescue/` generated offline by a Kokoro-ONNX script (pattern: `scripts/generate_night_run_audio.py`). We change copy first, then state/finale, then regenerate audio so recordings match final lines.

**Tech Stack:** Next.js 16 / React 19 / TypeScript, vitest, Python + kokoro_onnx + ffmpeg for TTS.

**Branch/worktree note:** Work directly on the current `working` branch — Phase 1 builds on uncommitted working-tree changes (rebuilt Moonbase etc.), so a fresh worktree from HEAD would miss required context. Do not touch files outside this plan's list.

**Story continuity being enforced (read before Task 1):**
Q1 = find and **secure** the pod at −4 (flag it, never "recover"). Q3 = ride gusts with the **empty winch hook** (the pod stays secured at −4). Q4 = lower the empty hook +2→−4, attach, lift −4→+2, **end at +2**. Finale = dock the cell, shelter warms, Pip uncurls, aurora, postcard + tease.

---

### Task 1: Quest 1 "secure, don't recover" copy

**Files:**
- Modify: `src/components/mountain-rescue-adventure.tsx`
- Test: existing suite (`npm test`)

- [ ] **Step 1: Sweep for the strings**

Run: `grep -n "ecover" src/components/mountain-rescue-adventure.tsx src/components/*.test.ts src/lib/mountain-rescue*.ts`
Expected hits in the component at ~lines 92, 473, 507, 511, 591, 594, 617–621, 1022–1027, 1048–1051, 1141, 1147–1155. Note any test files that assert this copy — their assertions change in Step 3.

- [ ] **Step 2: Apply the copy edits (exact old → new)**

In `src/components/mountain-rescue-adventure.tsx`:

| Location | Old | New |
|---|---|---|
| ~92 (quest card mission) | `Steer the rescue sled below Base Camp and recover the shelter’s energy cell.` | `Steer the rescue sled below Base Camp and secure the shelter’s fallen energy cell.` |
| ~594 (aria) | `aria-label="Recovered pod at minus four"` | `aria-label="Secured pod at minus four"` |
| ~1049 (dialogue) | `We found the cell. Now look at where every part of the rescue happened.` | `We secured the cell right here. Now look at where every part of the search happened.` |
| ~1141 (CTA) | `Recover the pod →` | `Secure the pod →` |
| ~1149 (label) | `RECOVER THE REAL POD` | `SECURE THE REAL POD` |
| ~1155 | `` `${state.podRecoveryProgress}% recovered` `` | `` `${state.podRecoveryProgress}% secured` `` |
| ~1173 (flags step) | `Tap Ridge Shelter at +2 and the recovered pod at −4.` | `Tap Ridge Shelter at +2 and the secured pod at −4.` |

Keep internal state names (`podRecovered`, `podRecoveryProgress`) — renaming state fields would break saves for zero player value. Add this comment above the `podRecovered` usage in `SignalBelowZeroQuest` (~line 1022):

```tsx
// Story language is "secure", not "recover": the pod stays at −4 until the
// Quest 4 winch lifts it. State field names predate this and are kept for
// save compatibility.
```

- [ ] **Step 3: Run the suite; update stale copy assertions**

Run: `npm test`
Expected: any failure only in copy assertions found in Step 1 (e.g. `continuous-adventures.test.ts`, `story-lint.test.ts`). Update those expected strings to the new copy. Re-run until PASS.

- [ ] **Step 4: Commit**

```bash
git add -A src/
git commit -m "fix(mountain): quest 1 secures the pod instead of recovering it"
```

---

### Task 2: Quest 3 rides the empty winch hook, not the pod

**Files:**
- Modify: `src/components/mountain-rescue-adventure.tsx` (Q3_OPENING_LINES ~179–195; StormMovesQuest dialogue ~1519–1531; markers ~1542–1545; gust step copy ~1569–1571)

- [ ] **Step 1: Rewrite the Q3 opening lines**

Replace the three `Q3_OPENING_LINES` entries' `line` values (keep `speaker`/`voice` keys as they are):

```tsx
const Q3_OPENING_LINES = [
  {
    speaker: "SCOUT" as const,
    line: "Wind burst incoming! The winch hook is swinging loose!",
    voice: MOUNTAIN_AUDIO.q3OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "Every gust swings it up or down. Track each move with me.",
    voice: MOUNTAIN_AUDIO.q3OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "Call the gusts. I’ll follow the hook.",
    voice: MOUNTAIN_AUDIO.q3OpeningKid,
  },
] as const;
```

- [ ] **Step 2: Re-point the in-quest copy from pod to hook**

In `StormMovesQuest` (~1519–1531), the `dialogue` chain — replace every `pod` with `hook`:

```tsx
  const dialogue = state.questStep === 0
    ? state.stormRunComplete
      ? "We rode every gust. The hook finished at plus one."
      : `Hook at ${formatAltitude(state.stormPosition)}. Next gust: ${currentGust?.label.toLowerCase()}.`
    : state.questStep === 1
      ? state.stormTransferComplete
        ? "New storm, same idea—the final position changed with every move."
        : `Transfer run at ${formatAltitude(state.stormPosition)}. Next gust: ${currentGust?.label.toLowerCase()}.`
      : state.questStep === 2
        ? "Adding a positive move swings the hook up. Adding a negative move swings it down."
        : state.stormRecapPlayed
          ? "The whole storm route is now one movement story."
          : "Replay each gust and watch the running position change.";
```

Markers (~1542–1545): `"STORM START"` → `"HOOK AT START"`, `"CURRENT SIGNAL"` → `"HOOK NOW"`.
Gust step copy (~1571): `The pod and team move before the next gust appears.` → `The hook and team move before the next gust appears.`
Q3 reveal copy (~1623): `The pod’s final height includes every gust.` → `The hook’s final height includes every gust.`
Q3 recap copy (~1639): `The pod never teleports to an answer—the whole route stays visible.` → `The hook never teleports to an answer—the whole route stays visible.`

Also check `MountainRouteStage` (grep `rescue-pod` / `pod` inside it): in Quest 3 usage the stage must render the hook sprite, not `rescue-pod.png`. If the stage hard-codes the pod image, add a prop `traveller?: "pod" | "hook"` defaulting to `"pod"`, pass `traveller="hook"` from `StormMovesQuest`, and render a simple hook glyph (`<span className="mountain-hook-glyph" aria-hidden>⚓</span>` styled in `src/app/world.css` — 28px, cyan glow) when `traveller === "hook"`.

- [ ] **Step 3: Run suite, fix stale assertions, commit**

Run: `npm test` → update any Q3 copy assertions → PASS.

```bash
git add -A src/
git commit -m "fix(mountain): quest 3 gusts swing the empty winch hook, not the pod"
```

---

### Task 3: Quest 4 reorder — lower the hook, attach, lift once, end at +2

**Files:**
- Modify: `src/components/mountain-rescue-adventure.tsx` (`RescueWinchQuest` ~1664–1880; `startQuest`/`finishQuest` q4 resets ~1962–1973 and ~2016–2027)
- Modify: `src/lib/grade-seven-progress.ts` (sanitizer defaults ~635–640)
- Test: `src/lib/grade-seven-progress.test.ts`

New step semantics: `questStep 0` = **lower** the empty hook from +2 to −4 and attach (field: `winchPosition`, start 2, target −4). `questStep 1` = **lift** pod from −4 to +2 (field: `reversePosition`, start −4, target 2). `questStep 2` = inverse reveal. `questStep 3` = recap → finale. The pod never re-descends.

- [ ] **Step 1: Write the failing sanitizer test**

In `src/lib/grade-seven-progress.test.ts`, add (match the file's existing describe/import style):

```ts
describe("mountain rescue winch defaults (lower-then-lift)", () => {
  it("starts the winch hook at +2 for lowering and the lift at −4", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [], lastEvent: 0, completed: false,
        interactionState: { kind: "mountain", storyVersion: 2 },
      },
    });
    const s = progress.mountain!.interactionState as MountainState;
    expect(s.winchPosition).toBe(2);
    expect(s.reversePosition).toBe(-4);
  });
});
```

Run: `npm test -- grade-seven-progress` → Expected: FAIL (`winchPosition` defaults to −4, `reversePosition` to 2).

- [ ] **Step 2: Flip sanitizer defaults**

`src/lib/grade-seven-progress.ts` (~635, ~638):

```ts
      winchPosition: numberOr(raw.winchPosition, 2, -4, 2),
      ...
      reversePosition: numberOr(raw.reversePosition, -4, -4, 2),
```

Run: `npm test -- grade-seven-progress` → PASS.

- [ ] **Step 3: Rework `RescueWinchQuest`**

In `moveWinch` (~1693–1716) swap targets — step 0 completes at **−4** (attach), step 1 completes at **+2**:

```tsx
  function moveWinch(value: number) {
    if (!interactive) return;
    if (state.questStep === 0) {
      const next = Math.max(-4, Math.min(2, value));
      const reached = next === -4;
      onChange({
        winchPosition: next,
        winchRunStarted: true,
        winchReached: reached,
      });
      sound.play(reached ? "success" : "tap");
      if (reached) playVoice(MOUNTAIN_AUDIO.q4LowerKid);
      return;
    }
    const next = Math.max(-4, Math.min(2, value));
    const complete = next === 2;
    onChange({
      reversePosition: next,
      reverseRunStarted: true,
      reverseComplete: complete,
    });
    sound.play(complete ? "success" : "tap");
    if (complete) playVoice(MOUNTAIN_AUDIO.q4LiftNova);
  }
```

(`q4LowerKid` / `q4LiftNova` are added to `MOUNTAIN_AUDIO` in Task 6; until then alias them to the existing `q4LiftKid` / `q4ReverseNova` keys so TypeScript stays green: add `q4LowerKid: `${MOUNTAIN_AUDIO_ROOT}/q4-stage-01-kid.mp3`, q4LiftNova: `${MOUNTAIN_AUDIO_ROOT}/q4-stage-02-nova.mp3`,` now; Task 6 renames the files/paths.)

Dialogue chain (~1734–1746):

```tsx
  const dialogue = state.questStep === 0
    ? state.winchReached
      ? "Hooked on! Six levels below the ledge."
      : "Lower the empty hook from plus two down to the pod at minus four."
    : state.questStep === 1
      ? state.reverseComplete
        ? "Plus two! The climb undid the whole fall—six levels up."
        : "Winch up! Lift the pod from minus four to the safe ledge."
      : state.questStep === 2
        ? "Down six and up six are inverse moves—they undo each other."
        : state.q4RecapPlayed
          ? "Every route is secure. Bring the cell home!"
          : "Replay the drop and the climb before we open the shelter.";
```

Trail + markers (~1755–1762): step 0 trail `integerPath(2, state.winchPosition)`, step 1 trail `integerPath(-4, state.reversePosition)`; markers become:

```tsx
        markers={[
          { value: -4, label: "SECURED POD", complete: state.winchReached },
          { value: 2, label: "SAFE LEDGE", active: state.reverseComplete, complete: state.reverseComplete },
        ]}
```

Action-deck copy (~1787–1789): step 0 → `<small>LOWER THE EMPTY HOOK</small>` / `<h2>Drop +2 down to the pod at −4.</h2>`; step 1 → `<small>YOUR RESCUE WINCH</small>` / `<h2>Lift −4 up to the +2 safe ledge.</h2>`.

Nudge buttons (~1791–1807): step 0 enables **Down** (disable Down when `position <= -4 || state.winchReached`; disable Up entirely on step 0); step 1 enables **Up** (disable Up when `position >= 2 || state.reverseComplete`; disable Down entirely on step 1). Swap the two `disabled` expressions accordingly:

```tsx
              <button
                type="button"
                onClick={() => moveWinch(position - 1)}
                disabled={state.questStep === 1 || position <= -4 || state.winchReached}
              >
                Down 1
              </button>
              <b>{formatAltitude(position)}</b>
              <button
                type="button"
                onClick={() => moveWinch(position + 1)}
                disabled={state.questStep === 0 || position >= 2 || state.reverseComplete}
              >
                Up 1
              </button>
```

Step-advance button (~1808–1827): step 0 label `Attach and start the lift →` (sets `questStep: 1, reversePosition: -4, reverseRunStarted: false, reverseComplete: false`); step 1 label `Show why the moves undo →`. `position` selector (~1685): `state.questStep === 1 ? state.reversePosition : state.winchPosition` (unchanged). Update `interactive` (~1686–1687): step 0 gate on `!state.winchReached`, step 1 on `!state.reverseComplete` (unchanged logic, verify only).

Inverse proof (~1838–1842) — order now matches play order:

```tsx
            <div className="mountain-inverse-proof">
              <span>+2 − 6 = −4</span>
              <b>reverse</b>
              <span>−4 + 6 = +2</span>
            </div>
```

`startQuest`/`finishQuest` q4 resets (~1962–1973, ~2016–2027) — both blocks become:

```tsx
        q4OpeningBeat: 0,
        q4OpeningComplete: false,
        winchPosition: 2,
        winchRunStarted: false,
        winchReached: false,
        reversePosition: -4,
        reverseRunStarted: false,
        reverseComplete: false,
        q4RecapPlayed: false,
```

- [ ] **Step 4: Run suite, fix stale assertions, commit**

Run: `npm test` → update any assertions on old q4 copy/defaults → PASS.

```bash
git add -A src/
git commit -m "fix(mountain): quest 4 lowers the empty hook, attaches, lifts once to +2"
```

---

### Task 4: Finale state fields

**Files:**
- Modify: `src/lib/grade-seven-progress.ts` (MountainState type ~47–98; sanitizer ~590–645)
- Test: `src/lib/grade-seven-progress.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
describe("mountain finale state", () => {
  it("defaults finale fields safely for old saves", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [], lastEvent: 0, completed: false,
        interactionState: { kind: "mountain", storyVersion: 2 },
      },
    });
    const s = progress.mountain!.interactionState as MountainState;
    expect(s.finaleBeat).toBe(0);
    expect(s.finaleCellDocked).toBe(false);
    expect(s.finaleComplete).toBe(false);
  });
});
```

Run: `npm test -- grade-seven-progress` → FAIL (fields missing).

- [ ] **Step 2: Add fields**

Type (after `q4RecapPlayed: boolean;` ~line 91):

```ts
  finaleBeat: number;
  finaleCellDocked: boolean;
  finaleComplete: boolean;
```

Sanitizer (after the `q4RecapPlayed` line ~640):

```ts
      finaleBeat: numberOr(raw.finaleBeat, 0, 0, 4),
      finaleCellDocked: boolOr(raw.finaleCellDocked, false),
      finaleComplete: boolOr(raw.finaleComplete, false),
```

Run: `npm test -- grade-seven-progress` → PASS. Fix any TypeScript errors where `MountainState` literals are built in tests (add the three fields with defaults).

- [ ] **Step 3: Commit**

```bash
git add src/lib/grade-seven-progress.ts src/lib/grade-seven-progress.test.ts
git commit -m "feat(mountain): add finale state fields with save-safe defaults"
```

---

### Task 5: The finale act — dock the cell, warm the shelter, Pip, aurora, postcard

**Files:**
- Modify: `src/components/mountain-rescue-adventure.tsx` (new `MountainFinale` component; wiring in `RescueWinchQuest` ~1867–1874 and `MountainRescueAdventure` ~2043–2157)
- Modify: `src/app/world.css` (finale styles, append at end)
- Test: `src/components/continuous-adventures.test.ts` (or the file's existing mountain describe block)

Beats (each one voiced, advanced by a single clear action; assets already exist: `public/images/mountain-rescue/pip-snow-fox.png`, `rescue-pod.png`; postcard copy comes from `finaleCopy.mountain` in `src/components/grade-seven-adventures.tsx:61`):

| finaleBeat | On screen | Child action | Voice (Task 6 files) |
|---|---|---|---|
| 0 | Cliff at dusk; pod hangs at +2 beside a dark shelter with an empty dock slot | Drag/press the pod into the dock (`Dock the energy cell →` button alternative) | `finale-01-scout`: "Cell docked! Power is back at Ridge Shelter!" |
| 1 | Windows glow warm, one by one; Pip sprite moves to the mat and curls → uncurls | `Watch the shelter wake →` | `finale-02-nova`: "Look—the windows are warming. Pip found the cosy corner." |
| 2 | Aurora bands sweep the sky; the full route +3→0→−4→+2 traces once on the cliff | `Trace our whole rescue →` | `finale-03-kid`: "And the sky… the aurora came to watch." |
| 3 | Postcard card: `finaleCopy.mountain.title` / `.detail` (personalized) over the aurora scene | `Save the postcard →` | `finale-04-nova`: "One postcard for your journal. Tomorrow, a new star starts glowing." |
| 4 | Tease line + `Back to the star map →` | button → `finishMountainChapter()` | — |

- [ ] **Step 1: Write the failing test**

In the existing mountain describe block of `src/components/continuous-adventures.test.ts` (follow its import style):

```ts
it("mountain finale beats gate chapter completion", () => {
  // finale component exists and exposes the 5-beat sequence
  expect(MOUNTAIN_FINALE_BEATS).toHaveLength(5);
  expect(MOUNTAIN_FINALE_BEATS[0].action).toMatch(/Dock the energy cell/);
  expect(MOUNTAIN_FINALE_BEATS[3].action).toMatch(/Save the postcard/);
});
```

Export `MOUNTAIN_FINALE_BEATS` from `mountain-rescue-adventure.tsx`. Run: `npm test -- continuous-adventures` → FAIL (not exported).

- [ ] **Step 2: Implement `MountainFinale`**

In `mountain-rescue-adventure.tsx`, above `MountainRescueAdventure`:

```tsx
export const MOUNTAIN_FINALE_BEATS = [
  { action: "Dock the energy cell →", voice: () => MOUNTAIN_AUDIO.finale01Scout },
  { action: "Watch the shelter wake →", voice: () => MOUNTAIN_AUDIO.finale02Nova },
  { action: "Trace our whole rescue →", voice: () => MOUNTAIN_AUDIO.finale03Kid },
  { action: "Save the postcard →", voice: () => MOUNTAIN_AUDIO.finale04Nova },
  { action: "Back to the star map →", voice: null },
] as const;

function MountainFinale({
  state,
  onChange,
  heroName,
  playVoice,
  onChapterComplete,
}: {
  state: MountainState;
  onChange: (patch: Partial<MountainState>) => void;
  heroName: string;
  playVoice: (source: string) => void;
  onChapterComplete: () => void;
}) {
  const beat = state.finaleBeat;
  const postcard = finaleCopy.mountain;

  function advance() {
    const next = Math.min(beat + 1, MOUNTAIN_FINALE_BEATS.length - 1);
    const voice = MOUNTAIN_FINALE_BEATS[beat].voice;
    if (voice) playVoice(voice());
    sound.play(beat === 0 ? "finale" : "success");
    onChange(beat === 0
      ? { finaleCellDocked: true, finaleBeat: next }
      : { finaleBeat: next });
  }

  return (
    <section
      className={`mountain-finale beat-${beat}${state.finaleCellDocked ? " cell-docked" : ""}`}
      aria-label="Mountain Rescue finale"
    >
      <div className="mountain-finale-scene" aria-hidden>
        <i className="finale-aurora band-one" />
        <i className="finale-aurora band-two" />
        <div className="finale-shelter">
          <span className="finale-window w1" />
          <span className="finale-window w2" />
          <span className="finale-dock" />
        </div>
        <img
          className="finale-pod"
          src="/images/mountain-rescue/rescue-pod.png"
          alt=""
        />
        <img
          className="finale-pip"
          src="/images/mountain-rescue/pip-snow-fox.png"
          alt=""
        />
        {beat >= 2 && (
          <svg className="finale-route" viewBox="0 0 100 100" aria-hidden>
            <polyline points="20,20 20,50 20,86 78,32" fill="none" />
          </svg>
        )}
      </div>

      <div className="signal-action-deck">
        <MountainComicLine
          speaker={beat <= 0 ? "SCOUT" : beat === 2 ? "YOU" : "NOVA"}
          line={
            beat === 0 ? "The dock is open. Bring the cell home!"
            : beat === 1 ? "Cell docked! Power is back at Ridge Shelter!"
            : beat === 2 ? "Look—the windows are warming. Pip found the cosy corner."
            : beat === 3 ? "And the sky… the aurora came to watch."
            : "One postcard for your journal. Tomorrow, a new star starts glowing."
          }
          onHear={() => {
            const voice = MOUNTAIN_FINALE_BEATS[Math.max(0, beat - 1)].voice;
            if (voice) playVoice(voice());
          }}
        />
        {beat === 3 && (
          <div className="mountain-postcard" role="img" aria-label={postcard.title}>
            <b>{postcard.title}</b>
            <p>{personalize(postcard.detail, heroName)}</p>
          </div>
        )}
        <button
          className="signal-primary"
          type="button"
          onClick={beat >= MOUNTAIN_FINALE_BEATS.length - 1 ? onChapterComplete : advance}
        >
          {personalize(MOUNTAIN_FINALE_BEATS[beat].action, heroName)}
        </button>
      </div>
    </section>
  );
}
```

Import `finaleCopy` at the top of the file: `import { finaleCopy } from "./grade-seven-adventures";` (check for import cycles: `grade-seven-adventures.tsx` must not import from `mountain-rescue-adventure.tsx`; it doesn't today — it is a data/config module).

- [ ] **Step 3: Wire it in**

In `RescueWinchQuest` (~1867–1874) the completion button no longer completes the chapter — it opens the finale:

```tsx
            <button
              className="signal-primary"
              type="button"
              disabled={!state.q4RecapPlayed}
              onClick={replay ? onReplayComplete : onEnterFinale}
            >
              {replay ? "Return to my journal →" : personalize("Open the shelter, {hero} →", heroName)}
            </button>
```

Add `onEnterFinale: () => void` to `RescueWinchQuest` props. In `MountainRescueAdventure`:

```tsx
  if (activeQuest === "rescue-winch" && state.questStep === 4) {
    return (
      <MountainFinale
        state={state}
        onChange={set}
        heroName={heroName}
        playVoice={playVoice}
        onChapterComplete={finishMountainChapter}
      />
    );
  }
```

…placed above the `activeQuest === "rescue-winch"` branch (~2144), and pass `onEnterFinale={() => set({ questStep: 4, finaleBeat: 0, finaleCellDocked: false })}` to `RescueWinchQuest`. Widen the mountain sanitizer's `questStep` clamp from `0..3` to `0..4` in `grade-seven-progress.ts` (~597) and set `finaleComplete: true` inside `finishMountainChapter`.

- [ ] **Step 4: Finale styles**

Append to `src/app/world.css` (theme tokens follow the file's existing custom properties; keep it to state-driven transitions, no keyframe spam — reduced-motion users get instant state changes because everything is class-toggled):

```css
/* Mountain Rescue finale */
.mountain-finale { position: relative; display: grid; gap: 16px; }
.mountain-finale-scene { position: relative; min-height: 300px; border-radius: 18px; overflow: hidden; background: linear-gradient(#0e1a33, #1d2c4d); }
.finale-aurora { position: absolute; inset: -20% -10% auto; height: 55%; opacity: 0; filter: blur(24px); transition: opacity 1.2s ease; }
.finale-aurora.band-one { background: linear-gradient(100deg, #3ef2b0, transparent 70%); }
.finale-aurora.band-two { background: linear-gradient(80deg, transparent 30%, #7f7bffa8); }
.mountain-finale.beat-2 .finale-aurora, .mountain-finale.beat-3 .finale-aurora, .mountain-finale.beat-4 .finale-aurora { opacity: 1; }
.finale-shelter { position: absolute; right: 12%; bottom: 14%; width: 180px; height: 120px; border-radius: 12px 12px 4px 4px; background: #223154; }
.finale-window { position: absolute; width: 34px; height: 30px; border-radius: 4px; background: #2c3c63; transition: background .9s ease, box-shadow .9s ease; }
.finale-window.w1 { left: 18px; top: 24px; } .finale-window.w2 { right: 18px; top: 24px; }
.mountain-finale.beat-1 .finale-window, .mountain-finale.beat-2 .finale-window, .mountain-finale.beat-3 .finale-window, .mountain-finale.beat-4 .finale-window { background: #ffd98a; box-shadow: 0 0 22px #ffd98a88; }
.finale-dock { position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%); width: 56px; height: 26px; border: 2px dashed #6fd4ff; border-radius: 6px; }
.finale-pod { position: absolute; right: calc(12% + 62px); bottom: 34%; width: 54px; transition: bottom .9s ease, filter .9s ease; }
.mountain-finale.cell-docked .finale-pod { bottom: 15%; filter: drop-shadow(0 0 14px #6fd4ff); }
.mountain-finale.cell-docked .finale-dock { border-style: solid; }
.finale-pip { position: absolute; right: 6%; bottom: 10%; width: 64px; transition: transform 1s ease; transform: scale(.92) rotate(6deg); }
.mountain-finale.beat-1 .finale-pip, .mountain-finale.beat-2 .finale-pip, .mountain-finale.beat-3 .finale-pip, .mountain-finale.beat-4 .finale-pip { transform: scale(1) rotate(0deg); }
.finale-route polyline { stroke: #ffd75e; stroke-width: 2; stroke-dasharray: 240; stroke-dashoffset: 240; animation: finale-route-trace 2.4s ease forwards; }
@media (prefers-reduced-motion: reduce) { .finale-route polyline { animation: none; stroke-dashoffset: 0; } }
@keyframes finale-route-trace { to { stroke-dashoffset: 0; } }
.mountain-postcard { border: 2px solid #ffd98a; border-radius: 14px; padding: 14px 16px; background: #14203ccc; }
```

- [ ] **Step 5: Run tests, then verify live**

Run: `npm test` → PASS.
Run the dev server, seed a save at Q4 recap (or play through), click `Open the shelter →`, and step all five beats. Verify: pod docks, windows warm, Pip straightens, aurora appears, route traces, postcard shows, final button returns to the quest map with all four quests complete.

- [ ] **Step 6: Commit**

```bash
git add -A src/
git commit -m "feat(mountain): real finale act with dock, warm shelter, Pip, aurora, postcard"
```

---

### Task 6: Audio — asset-existence test, regenerate every changed line, fix silent q1

**Files:**
- Create: `src/lib/audio-assets.test.ts`
- Create: `scripts/generate_mountain_rescue_audio.py`
- Modify: `src/components/mountain-rescue-adventure.tsx` (`MOUNTAIN_AUDIO` map ~40–80; export it)
- Delete: 8 stale `public/audio/mountain-rescue/q1-*.mp3` files (old 3-line script)

- [ ] **Step 1: Export the audio map and write the failing asset test**

In `mountain-rescue-adventure.tsx` change `const MOUNTAIN_AUDIO = {` to `export const MOUNTAIN_AUDIO = {`.

Create `src/lib/audio-assets.test.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MOUNTAIN_AUDIO } from "@/components/mountain-rescue-adventure";

describe("referenced audio assets exist on disk", () => {
  for (const [key, publicPath] of Object.entries(MOUNTAIN_AUDIO)) {
    it(`mountain: ${key} → ${publicPath}`, () => {
      expect(existsSync(join(process.cwd(), "public", publicPath))).toBe(true);
    });
  }
});
```

Run: `npm test -- audio-assets` → Expected: FAIL for all 17 `q1-v3-*` entries (and any finale keys once added). This test is the permanent guard the spec requires; Phase 5 extends it to the other adventures.

- [ ] **Step 2: Rename the q1 references to the plain convention and add new keys**

In `MOUNTAIN_AUDIO` replace the 17 `q1-v3-*` paths with convention names (`q1-opening-01-nova.mp3` … matching each key's speaker), e.g. `q1Opening01Nova: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-01-nova.mp3``, `q1LatchNova: `${MOUNTAIN_AUDIO_ROOT}/q1-latch-nova.mp3``, etc. Add the new keys used by Tasks 3/5:

```ts
  q1BrushNova: `${MOUNTAIN_AUDIO_ROOT}/q1-brush-nova.mp3`,
  q4LowerKid: `${MOUNTAIN_AUDIO_ROOT}/q4-lower-kid.mp3`,
  q4LiftNova: `${MOUNTAIN_AUDIO_ROOT}/q4-lift-nova.mp3`,
  finale01Scout: `${MOUNTAIN_AUDIO_ROOT}/finale-01-scout.mp3`,
  finale02Nova: `${MOUNTAIN_AUDIO_ROOT}/finale-02-nova.mp3`,
  finale03Kid: `${MOUNTAIN_AUDIO_ROOT}/finale-03-kid.mp3`,
  finale04Nova: `${MOUNTAIN_AUDIO_ROOT}/finale-04-nova.mp3`,
```

Point step-2 brush dialogue's `onHear` (~1087) at `q1BrushNova` instead of reusing `q1FoundNova`. Remove the Task 3 aliases for `q4LowerKid`/`q4LiftNova`. Delete now-unused keys `q4LiftKid`/`q4ReverseNova` and their remaining references (grep `q4LiftKid\|q4ReverseNova` — replace with the new keys). Also regenerate stale-content files whose lines changed (all q3 openings + q3/q4 stage lines): keep their existing filenames so only content changes.

- [ ] **Step 3: Write the generation script**

Create `scripts/generate_mountain_rescue_audio.py`, modeled exactly on `scripts/generate_night_run_audio.py` (same `encode()` ffmpeg chain, same normalization; copy those helpers verbatim). Voices per speaker:

```python
def voice_for(speaker: str, kokoro: Kokoro) -> np.ndarray:
    if speaker == "nova":
        blend = kokoro.get_voice_style("af_heart") * 0.58 + kokoro.get_voice_style("af_sky") * 0.42
    elif speaker == "kid":
        blend = kokoro.get_voice_style("af_sarah") * 0.7 + kokoro.get_voice_style("af_sky") * 0.3
    else:  # scout
        blend = kokoro.get_voice_style("am_michael")
    return np.asarray(blend, dtype=np.float32)
```

`STORY_LINES` — every entry is `{"filename", "speaker", "text", "speed", "pitch"}` (nova speed 1.04 pitch 1.16; kid 1.06/1.22; scout 0.98/1.0). Files and exact texts (texts must match the component copy after Tasks 1–5 — verify each against the source before running):

```text
q1-opening-01-nova  nova  "Pip! The ribbon goes on the shelter—not your tail!"
q1-opening-02-kid   kid   "He thinks he is the decoration."
q1-opening-03-scout scout "The storm drained our energy cell. The shelter is getting cold."
q1-opening-04-nova  nova  "Hang on, Pip. We’ll get the warmth back."
q1-opening-05-scout scout "Replacement cell launching from the Service Deck!"
q1-opening-06-kid   kid   "The pod went past us—and past Base Camp!"
q1-opening-07-scout scout "The cell is safe, but its signal is fading in the ravine."
q1-opening-08-nova  nova  "You steer the rescue sled. I’ll watch the signal!"
q1-latch-nova       nova  "The pod crossed Base Camp and vanished below it. Pull the safety latch—we’re going after it."
q1-signal-nova      nova  "Stay with it. Pull the pod down toward base camp."
q1-zero-kid         kid   "That gold line is zero—our halfway marker."
q1-found-nova       nova  "Found it—four levels below zero!"
q1-brush-nova       nova  "The signal is under this drift. Brush the snow away."
q1-recovered-kid    kid   "We secured the cell right here. Now look at where every part of the search happened."
q1-reveal-nova      nova  "Positions above zero are positive. Positions below zero are negative. Zero is the reference point between them."
q1-flag-nova        nova  "Tap Ridge Shelter at plus two and the secured pod at minus four."
q1-handoff-scout    scout "Cell secured and marked. The checkpoint lights are next."
q1-handoff-nova     nova  "Nice work. The climb route needs us."
q3-opening-01-scout scout "Wind burst incoming! The winch hook is swinging loose!"
q3-opening-02-nova  nova  "Every gust swings it up or down. Track each move with me."
q3-opening-03-kid   kid   "Call the gusts. I’ll follow the hook."
q3-stage-01-nova    nova  "Release one gust at a time and keep the running position."
q3-stage-02-kid     kid   "New storm, same idea—the final position changed with every move."
q3-stage-03-nova    nova  "Adding a positive move swings the hook up. Adding a negative move swings it down."
q3-stage-04-scout   scout "One movement story—the hook rode every gust."
q4-lower-kid        kid   "Hooked on! Six levels below the ledge."
q4-lift-nova        nova  "Plus two! The climb undid the whole fall—six levels up."
q4-stage-03-nova    nova  "Down six and up six are inverse moves—they undo each other."
q4-stage-04-scout   scout "Every route is secure. Bring the cell home!"
finale-01-scout     scout "Cell docked! Power is back at Ridge Shelter!"
finale-02-nova      nova  "Look—the windows are warming. Pip found the cosy corner."
finale-03-kid       kid   "And the sky… the aurora came to watch."
finale-04-nova      nova  "One postcard for your journal. Tomorrow, a new star starts glowing."
```

Before running, grep the component for `q1HandoffScout`/`q1HandoffNova` usage; if they are wired into a Q1 closing beat, keep them — if truly unreferenced, delete both keys and skip those two files.

- [ ] **Step 4: Generate and clean up**

Run (same model/voices bundle used for `generate_night_run_audio.py` — ask the owner for the local paths if not found beside the other generated audio):

```bash
python3 scripts/generate_mountain_rescue_audio.py \
  --model <path-to-kokoro.onnx> --voices <path-to-voices.bin> \
  --output public/audio/mountain-rescue
```

Then delete the 8 stale old-script files if their names are no longer referenced (verify first):

```bash
grep -o 'q1-[a-z0-9-]*\.mp3' src/components/mountain-rescue-adventure.tsx | sort -u
ls public/audio/mountain-rescue/ | grep '^q1-'
```

Remove any `q1-*.mp3` on disk that is absent from the grep output (expected: the old `q1-stage-*` files and any opening files whose speaker suffix doesn't match the new map).

- [ ] **Step 5: Asset test green + listen check**

Run: `npm test -- audio-assets` → PASS (every referenced file exists).
Spot-listen 3 files (one per speaker) with `afplay public/audio/mountain-rescue/finale-02-nova.mp3` etc. — confirm audible, right words, no clipping.

- [ ] **Step 6: Commit**

```bash
git add -A src/ scripts/generate_mountain_rescue_audio.py public/audio/mountain-rescue/
git commit -m "fix(mountain): audible quest 1 + finale voice, permanent asset-existence test"
```

---

### Task 7: Replace the silent audio catch with a logged fallback

**Files:**
- Modify: `src/components/mountain-rescue-adventure.tsx` (~1892–1899)

- [ ] **Step 1: Patch `playVoice`**

```tsx
  const playVoice = useCallback((source: string) => {
    audioRef.current?.pause();
    const audio = new Audio(source);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.muted = sound.isMuted();
    void audio.play().catch((error) => {
      // Autoplay refusals are expected before first user gesture; a missing
      // file is not. Either way the captioned line keeps the scene readable.
      console.warn(`[mountain-rescue] voice failed for ${source}`, error);
    });
  }, []);
```

- [ ] **Step 2: Verify + commit**

Run: `npm test` → PASS. In the dev server with DevTools open, confirm no warnings during a normal Q1 run.

```bash
git add src/components/mountain-rescue-adventure.tsx
git commit -m "fix(mountain): log voice playback failures instead of swallowing them"
```

---

### Task 8: Discoverable strap and brush interactions

**Files:**
- Modify: `src/components/mountain-rescue-adventure.tsx` (`SignalCliffStage` strap ~617–622; `SignalBelowZeroQuest` step-2 deck ~1146–1166)
- Modify: `src/app/world.css` (append)

- [ ] **Step 1: Pulse + label the strap, add a deck button alternative**

Strap button (~617–622) gains a visible verb and pulse class:

```tsx
      {state.questStep === 2 && state.snowCleared >= 100 && !state.podRecovered && (
        <button type="button" className="signal-recovery-strap pulse" onClick={onPull}>
          <b>PULL</b>
          <small>{state.podRecoveryProgress}%</small>
        </button>
      )}
```

In the step-2 action deck (inside the `state.questStep === 2 && !state.podRecovered` branch), add below the copy a mirrored control so the action never depends on finding the in-scene element:

```tsx
              {state.snowCleared >= 100 && (
                <button className="signal-primary" type="button" onClick={onPull}>
                  Pull the strap together →
                </button>
              )}
```

(`onPull` is already threaded into `SignalCliffStage`; thread the same handler into this deck via existing props — `SignalBelowZeroQuest` defines `pullPod`, use it directly.)

- [ ] **Step 2: Idle hint after two failed seconds-long silences**

In `SignalBelowZeroQuest`, add a hint that appears when the child has been on the strap step without progress for 6 seconds:

```tsx
  const [strapHint, setStrapHint] = useState(false);
  useEffect(() => {
    if (state.questStep !== 2 || state.snowCleared < 100 || state.podRecovered) {
      setStrapHint(false);
      return;
    }
    const timer = setTimeout(() => setStrapHint(true), 6000);
    return () => clearTimeout(timer);
  }, [state.questStep, state.snowCleared, state.podRecoveryProgress, state.podRecovered]);
```

Render inside the step-2 deck: `{strapHint && <p className="signal-hint">Tap the glowing PULL strap—four pulls frees the cell.</p>}`. The same pattern applies to the brush step if `snowCleared` sits at 0 for 6 seconds: hint text `Rub the snowdrift near the ravine to clear it.`

- [ ] **Step 3: Styles**

```css
.signal-recovery-strap.pulse { animation: strap-pulse 1.6s ease-in-out infinite; }
@keyframes strap-pulse { 50% { transform: scale(1.12); box-shadow: 0 0 18px #6fd4ffb0; } }
@media (prefers-reduced-motion: reduce) { .signal-recovery-strap.pulse { animation: none; outline: 3px solid #6fd4ff; } }
.signal-hint { color: #ffd98a; font-size: 14px; }
```

- [ ] **Step 4: Verify + commit**

Run: `npm test` → PASS. Live: complete the brush, wait 6s, see the hint; pull via the deck button; keyboard: Tab reaches both controls, Enter activates.

```bash
git add -A src/
git commit -m "fix(mountain): discoverable brush/strap with pulse, hint, and deck alternative"
```

---

### Task 9: Phase acceptance verification

- [ ] **Step 1: Full suite + lint**

Run: `npm test` → all PASS. Run: `npm run lint` → clean (fix anything introduced by this plan).

- [ ] **Step 2: Full live playthrough (desktop)**

Fresh profile (clear `learnnjoy-pilot-progress` in localStorage). Play Mountain Rescue start → finale. Checklist:
- Q1 secures (never "recovers"); voice audible on every beat including openings.
- Q3 speaks and shows the hook, not the pod.
- Q4 lowers +2→−4, attaches, lifts to +2, ends at +2.
- Finale: dock → warm windows → Pip → aurora → route trace → postcard → tease → quest map shows 4/4.
- Old-save check: restore a pre-change save JSON (any mid-quest step), reload — resumes without crash at a sensible step.

- [ ] **Step 3: Phone + reduced motion**

375×812 viewport: critical object and controls visible on every step; no horizontal scroll. Enable reduced motion: finale states still readable (windows warm, route visible without animation).

- [ ] **Step 4: Commit any fixes; final commit**

```bash
git add -A
git commit -m "feat(mountain): complete Phase 1 — Mountain Rescue to benchmark"
```

---

## Self-review (done at planning time)

- **Spec coverage:** finale act (Task 5), continuity Q1/Q3/Q4 (Tasks 1–3), voice + asset test (Tasks 6–7), ergonomics (Task 8), acceptance incl. 375px/reduced-motion/save-compat (Task 9). Postcard + tease beats debut the come-back loop (Task 5, beats 3–4). ✔
- **Placeholders:** none; every step has exact strings/code. TTS model/voices paths are runtime CLI arguments, supplied by the owner. ✔
- **Type consistency:** new keys `q1BrushNova`, `q4LowerKid`, `q4LiftNova`, `finale01Scout`–`finale04Nova` are defined in Task 6 Step 2 and referenced in Tasks 3/5 (with temporary aliases noted in Task 3); `MOUNTAIN_FINALE_BEATS` exported in Task 5 and asserted in its test; finale state fields defined in Task 4 before use in Task 5. ✔
