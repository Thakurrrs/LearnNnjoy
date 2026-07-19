"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import "./world.css";
import { chooseLearningTrail, diagnostic, recommendNextSkill, type Grade, type VisualKind } from "@/lib/learning";
import { getQuestsForGrade } from "@/lib/grade-quests";
import { getGradeRoadmap } from "@/lib/curriculum-map";
import { recordDailyQuest } from "@/lib/streak";
import { loadOrCreateHostedLearner, saveHostedLearnerState } from "@/lib/hosted-progress";
import { getSupabaseBrowserClient, isHostedPilotConfigured } from "@/lib/supabase";

type Screen = "welcome" | "story" | "diagnostic" | "path" | "chapter" | "quest" | "outcome" | "parent" | "world" | "map";

const PILOT_PROGRESS_KEY = "learnnjoy-pilot-progress";

type SavedProgress = {
  name: string;
  grade: Grade;
  screen: Screen;
  diagnosticIndex: number;
  diagnosticCorrect: number;
  storyBeat: number;
  storyCells: number[];
  fruitSplit: boolean;
  fruitShared: boolean;
  questIndex: number;
  coins: number;
  correct: number;
  attempts: number;
  guardianAcknowledged: boolean;
  parentPulse: "lighter" | "steady" | "hard" | null;
  ownedCosmetics: string[];
  equippedCosmetic: string;
  dailyStreak: number;
  lastCompletedDate: string | null;
};

const cosmetics = [
  { id: "trailblazer", label: "Trailblazer pack", emoji: "🎒", cost: 0, detail: "Your first expedition companion." },
  { id: "aurora", label: "Aurora cape", emoji: "🧥", cost: 50, detail: "A warm glow for brave problem-solvers." },
  { id: "starglow", label: "Starglow companion", emoji: "🌟", cost: 75, detail: "A tiny light for the next trail." },
] as const;

function FractionVisual({ chargedPieces, onCharge }: { chargedPieces: number; onCharge: () => void }) {
  return <div className="visual-play"><div className="pizza interactive-pizza" aria-label="A four-part energy disc. Tap a piece to charge it.">{[0, 1, 2, 3].map((piece) => <button key={piece} type="button" className={piece < chargedPieces ? "charged" : ""} aria-label={`Charge piece ${piece + 1}`} onClick={onCharge} />)}</div><p>Tap the energy pieces to explore equal parts.</p></div>;
}

function NumberLineVisual({ steps, onExplore }: { steps: number; onExplore: () => void }) {
  const markerOffset = Math.min(80, steps * 26);
  return <div className="visual-play"><div className="number-line interactive-line" aria-label="A number line showing a movable explorer marker"><span>0</span><i /><b style={{ transform: `translateX(${markerOffset}px)` }}>✦</b><i /><span>12</span></div><button className="visual-action" type="button" onClick={onExplore}>Move Nova along the path</button><p>Trace the direction before you decide.</p></div>;
}

function RatioVisual({ groups, onExplore }: { groups: number; onExplore: () => void }) {
  const doubled = groups > 0;
  return <div className="visual-play"><div className="ratio-visual" aria-label="Equal groups that can be doubled"><div>🥣🥣<small>4 explorers</small></div><strong>→</strong><div>{doubled ? "🥣🥣🥣🥣" : "🥣🥣"}<small>{doubled ? "8 explorers" : "4 explorers"}</small></div></div><button className="visual-action" type="button" onClick={onExplore}>{doubled ? "Notice what doubled together" : "Double the explorer group"}</button><p>Keep matching groups in step.</p></div>;
}

function Visual({ kind, chargedPieces, onCharge }: { kind: VisualKind; chargedPieces: number; onCharge: () => void }) {
  if (kind === "fraction") return <FractionVisual chargedPieces={chargedPieces} onCharge={onCharge} />;
  if (kind === "number-line") return <NumberLineVisual steps={chargedPieces} onExplore={onCharge} />;
  return <RatioVisual groups={chargedPieces} onExplore={onCharge} />;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade>(4);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
  const [diagnosticCorrect, setDiagnosticCorrect] = useState(0);
  const [storyBeat, setStoryBeat] = useState(0);
  const [storyCells, setStoryCells] = useState<number[]>([]);
  const [fruitSplit, setFruitSplit] = useState(false);
  const [fruitShared, setFruitShared] = useState(false);
  const [questIndex, setQuestIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const [coins, setCoins] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const pet = "Nova";
  const [hydrated, setHydrated] = useState(false);
  const [guardianAcknowledged, setGuardianAcknowledged] = useState(false);
  const [parentPulse, setParentPulse] = useState<SavedProgress["parentPulse"]>(null);
  const [ownedCosmetics, setOwnedCosmetics] = useState<string[]>(["trailblazer"]);
  const [equippedCosmetic, setEquippedCosmetic] = useState("trailblazer");
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [guardianEmail, setGuardianEmail] = useState("");
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [hostedLearnerId, setHostedLearnerId] = useState<string | null>(null);
  const [cloudMessage, setCloudMessage] = useState("");
  const cloudLoadStarted = useRef(false);
  const [chargedPieces, setChargedPieces] = useState(0);
  const [wrongAttemptsOnQuestion, setWrongAttemptsOnQuestion] = useState(0);

  function applySavedProgress(saved: Partial<SavedProgress>) {
    if (saved.name) setName(saved.name);
    if (saved.grade && saved.grade >= 4 && saved.grade <= 12) setGrade(saved.grade as Grade);
    if (saved.screen && saved.screen !== "welcome") setScreen(saved.screen);
    if (typeof saved.diagnosticIndex === "number") setDiagnosticIndex(Math.min(saved.diagnosticIndex, diagnostic.length - 1));
    if (typeof saved.diagnosticCorrect === "number") setDiagnosticCorrect(Math.max(0, Math.min(diagnostic.length, saved.diagnosticCorrect)));
    if (typeof saved.storyBeat === "number") setStoryBeat(Math.max(0, Math.min(3, saved.storyBeat)));
    if (Array.isArray(saved.storyCells) && saved.storyCells.every((cell) => typeof cell === "number" && cell >= 0 && cell < 4)) setStoryCells(saved.storyCells);
    if (typeof saved.fruitSplit === "boolean") setFruitSplit(saved.fruitSplit);
    if (typeof saved.fruitShared === "boolean") setFruitShared(saved.fruitShared);
    if (typeof saved.questIndex === "number") setQuestIndex(Math.max(0, saved.questIndex));
    if (typeof saved.coins === "number") setCoins(saved.coins);
    if (typeof saved.correct === "number") setCorrect(saved.correct);
    if (typeof saved.attempts === "number") setAttempts(saved.attempts);
    if (typeof saved.guardianAcknowledged === "boolean") setGuardianAcknowledged(saved.guardianAcknowledged);
    if (saved.parentPulse === "lighter" || saved.parentPulse === "steady" || saved.parentPulse === "hard") setParentPulse(saved.parentPulse);
    if (Array.isArray(saved.ownedCosmetics) && saved.ownedCosmetics.every((item) => typeof item === "string")) setOwnedCosmetics(saved.ownedCosmetics);
    if (typeof saved.equippedCosmetic === "string") setEquippedCosmetic(saved.equippedCosmetic);
    if (typeof saved.dailyStreak === "number") setDailyStreak(saved.dailyStreak);
    if (typeof saved.lastCompletedDate === "string") setLastCompletedDate(saved.lastCompletedDate);
  }

  const gradeQuests = getQuestsForGrade(grade);
  const gradeRoadmap = getGradeRoadmap(grade);
  const current = screen === "diagnostic" ? diagnostic[diagnosticIndex] : gradeQuests[questIndex];
  const completed = questIndex >= gradeQuests.length;
  const confidence = useMemo(() => Math.min(92, 58 + correct * 11), [correct]);
  const learningTrail = chooseLearningTrail(diagnosticCorrect);
  const missionTitle = screen === "diagnostic" ? "Nova's signal is fading" : questIndex === 0 ? "Restore the first beacon" : questIndex === 1 ? "Clear the mist trail" : "Open the starlight bridge";
  const missionMoment = screen === "diagnostic" ? "Your choices help Nova find the trail that feels right for you." : `One idea at a time. Each discovery brings Lumina back to life.`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(PILOT_PROGRESS_KEY);
      if (stored) {
        try {
          const saved = JSON.parse(stored) as Partial<SavedProgress>;
          applySavedProgress(saved);
        } catch {
          window.localStorage.removeItem(PILOT_PROGRESS_KEY);
        }
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    void client.auth.getUser().then(({ data }) => setAuthUser(data.user));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => setAuthUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!hydrated || !name.trim()) return;
    const progress: SavedProgress = { name, grade, screen, diagnosticIndex, diagnosticCorrect, storyBeat, storyCells, fruitSplit, fruitShared, questIndex, coins, correct, attempts, guardianAcknowledged, parentPulse, ownedCosmetics, equippedCosmetic, dailyStreak, lastCompletedDate };
    window.localStorage.setItem(PILOT_PROGRESS_KEY, JSON.stringify(progress));
  }, [attempts, coins, correct, dailyStreak, diagnosticCorrect, diagnosticIndex, equippedCosmetic, fruitShared, fruitSplit, grade, guardianAcknowledged, hydrated, lastCompletedDate, name, ownedCosmetics, parentPulse, questIndex, screen, storyBeat, storyCells]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client || !hydrated || !authUser || !name.trim() || !guardianAcknowledged || cloudLoadStarted.current) return;
    cloudLoadStarted.current = true;

    void loadOrCreateHostedLearner(client, authUser, { name, grade, state: { name, grade, screen, diagnosticIndex, diagnosticCorrect, storyBeat, storyCells, fruitSplit, fruitShared, questIndex, coins, correct, attempts, guardianAcknowledged, parentPulse, ownedCosmetics, equippedCosmetic, dailyStreak, lastCompletedDate } })
      .then((hosted) => {
        applySavedProgress(hosted.state as Partial<SavedProgress>);
        setHostedLearnerId(hosted.learnerId);
        setCloudMessage("Cloud saving is on for this guardian account.");
      })
      .catch((error: unknown) => {
        cloudLoadStarted.current = false;
        setCloudMessage(error instanceof Error ? error.message : "Cloud saving could not start yet. Your progress remains on this device.");
      });
  }, [attempts, authUser, coins, correct, dailyStreak, diagnosticCorrect, diagnosticIndex, equippedCosmetic, fruitShared, fruitSplit, grade, guardianAcknowledged, hydrated, lastCompletedDate, name, ownedCosmetics, parentPulse, questIndex, screen, storyBeat, storyCells]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client || !hostedLearnerId || !hydrated) return;
    const timer = window.setTimeout(() => {
      void saveHostedLearnerState(client, hostedLearnerId, { name, grade, screen, diagnosticIndex, diagnosticCorrect, storyBeat, storyCells, fruitSplit, fruitShared, questIndex, coins, correct, attempts, guardianAcknowledged, parentPulse, ownedCosmetics, equippedCosmetic, dailyStreak, lastCompletedDate }).catch(() => {
        setCloudMessage("Your latest progress is still safe on this device; cloud saving will retry next time.");
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [attempts, coins, correct, dailyStreak, diagnosticCorrect, diagnosticIndex, equippedCosmetic, fruitShared, fruitSplit, grade, guardianAcknowledged, hostedLearnerId, hydrated, lastCompletedDate, name, ownedCosmetics, parentPulse, questIndex, screen, storyBeat, storyCells]);

  async function sendMagicLink() {
    const client = getSupabaseBrowserClient();
    if (!client || !guardianEmail.trim()) return;
    setCloudMessage("Sending your secure sign-in link…");
    const { error } = await client.auth.signInWithOtp({
      email: guardianEmail.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setCloudMessage(error ? error.message : "Check the guardian inbox for the secure sign-in link.");
  }

  function answer() {
    if (!selected || !current) return;
    setAttempts((value) => value + 1);
    if (selected === current.answer) {
      setFeedback("correct");
      setCorrect((value) => value + 1);
      if (screen === "diagnostic") setDiagnosticCorrect((value) => value + 1);
      setCoins((value) => value + 25);
      const streak = recordDailyQuest({ dailyStreak, lastCompletedDate }, new Date().toISOString().slice(0, 10));
      setDailyStreak(streak.dailyStreak);
      setLastCompletedDate(streak.lastCompletedDate);
      if (screen === "quest") setScreen("outcome");
      return;
    }
    setWrongAttemptsOnQuestion((value) => value + 1);
    setFeedback("retry");
    setShowHint(true);
  }

  function continueLearning() {
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    setChargedPieces(0);
    setWrongAttemptsOnQuestion(0);
    if (screen === "diagnostic") {
      if (diagnosticIndex < diagnostic.length - 1) setDiagnosticIndex((value) => value + 1);
      else setScreen("path");
      return;
    }
    if (questIndex < gradeQuests.length - 1) {
      setQuestIndex((value) => value + 1);
      setScreen("chapter");
    } else setQuestIndex(gradeQuests.length);
  }

  function retryCurrentQuestion() {
    setSelected(null);
    setFeedback(null);
    setShowHint(true);
  }

  function recoveryPrompt() {
    if (current.visual === "fraction") return "Start with equal pieces. Count how many pieces are being used, then compare that with the whole.";
    if (current.visual === "number-line") return "Place yourself at the starting number, then move one small step at a time. The direction matters.";
    return "Build one equal group first. When the group changes, make the matching group change in the same way.";
  }

  function chargePiece() {
    setChargedPieces((value) => Math.min(4, value + 1));
  }

  function toggleStoryCell(cell: number) {
    setStoryCells((cells) => cells.includes(cell) ? cells.filter((item) => item !== cell) : cells.length < 2 ? [...cells, cell] : cells);
  }

  function eraseLocalPilotData() {
    if (!window.confirm("Remove this learner's local pilot progress from this browser? This cannot be undone.")) return;
    window.localStorage.removeItem(PILOT_PROGRESS_KEY);
    setScreen("welcome");
    setName("");
    setGrade(4);
    setDiagnosticIndex(0);
    setDiagnosticCorrect(0);
    setStoryBeat(0);
    setStoryCells([]);
    setFruitSplit(false);
    setFruitShared(false);
    setQuestIndex(0);
    setSelected(null);
    setShowHint(false);
    setFeedback(null);
    setCoins(60);
    setCorrect(0);
    setAttempts(0);
    setGuardianAcknowledged(false);
    setParentPulse(null);
    setOwnedCosmetics(["trailblazer"]);
    setEquippedCosmetic("trailblazer");
    setDailyStreak(0);
    setLastCompletedDate(null);
    setWrongAttemptsOnQuestion(0);
  }

  function exportLocalPilotData() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      learner: { nickname: name, grade },
      progress: { diagnosticIndex, questIndex, correct, attempts, dailyStreak, lastCompletedDate },
      rewards: { coins, ownedCosmetics, equippedCosmetic },
      parentPulse,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "learnnjoy-pilot-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function chooseCosmetic(id: string, cost: number) {
    if (ownedCosmetics.includes(id)) return setEquippedCosmetic(id);
    if (coins < cost) return;
    setCoins((value) => value - cost);
    setOwnedCosmetics((items) => [...items, id]);
    setEquippedCosmetic(id);
  }

  if (screen === "welcome") {
    return <main className="shell welcome-shell">
      <nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="pill">Parent-supervised pilot</div></nav>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE NUMBER SENSE EXPEDITION</p>
          <h1>Maths becomes a world your child wants to explore.</h1>
          <p className="lede">Short visual quests for Grades 4–12, designed to replace “I can’t do maths” with “let me try one more.”</p>
          <div className="welcome-card">
            <label>Explorer nickname<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aanya" maxLength={24} /></label>
            <label>School grade<select value={grade} onChange={(event) => setGrade(Number(event.target.value) as Grade)}>{[4,5,6,7,8,9,10,11,12].map((item) => <option key={item} value={item}>Grade {item}</option>)}</select></label>
            <label className="consent"><input type="checkbox" checked={guardianAcknowledged} onChange={(event) => setGuardianAcknowledged(event.target.checked)} /><span>I am this learner&apos;s parent or guardian and I agree to the pilot storing their nickname, grade, and progress.</span></label>
            {isHostedPilotConfigured && <div className="cloud-sign-in"><p className="eyebrow">SAVE ACROSS DEVICES</p>{authUser ? <p className="fine-print">Signed in as {authUser.email}. {cloudMessage || "Cloud saving will start when the learner begins."}</p> : <><label>Guardian email<input type="email" value={guardianEmail} onChange={(event) => setGuardianEmail(event.target.value)} placeholder="parent@example.com" /></label><button className="text-button" disabled={!guardianEmail.trim()} onClick={sendMagicLink}>Email me a secure sign-in link</button>{cloudMessage && <p className="fine-print">{cloudMessage}</p>}</>}</div>}
            <button className="primary" disabled={!name.trim() || !guardianAcknowledged} onClick={() => setScreen("story")}>Help Nova restore the first beacon <span>→</span></button>
            <p className="fine-print">A 10-minute, no-pressure rescue mission. No scores are shared with anyone; local pilot data can be removed in your browser at any time.</p>
          </div>
        </div>
        <div className="hero-world"><Image className="hero-art" src="/images/lumina-hero.png" alt="A young explorer and glowing star companion discover a fraction beacon on a floating island." fill priority sizes="(max-width: 760px) 100vw, 45vw" /></div>
      </section>
      <section className="promise-row"><div><b>8–12 min</b><span>one focused quest</span></div><div><b>Visual first</b><span>understand before memorising</span></div><div><b>Private progress</b><span>no rankings or pressure</span></div></section>
    </main>;
  }

  if (screen === "story") {
    const bridgeReady = storyCells.length === 2;
    return <main className={`story-shell beat-${storyBeat}`}><Image src="/images/lumina-bridge.png" alt="Nova waits by a broken starlight bridge in the world of Lumina." fill priority sizes="100vw" className="story-art" /><div className="story-vignette" /><nav className="story-nav"><div className="brand"><span>✦</span> LearnNnjoy</div><span>Nova and the Broken Beacon · {storyBeat + 1}/4</span></nav><section className="story-player">
      {storyBeat === 0 && <div className="story-dialogue"><p className="eyebrow">CHAPTER ONE</p><h1>Nova has one whole moon-fruit.</h1><p>Two explorers are hungry before they cross the bridge. Can you help Nova share the one whole fruit fairly?</p><button className="primary" onClick={() => setStoryBeat(1)}>Help Nova share it →</button></div>}
      {storyBeat === 1 && <div className="story-dialogue"><p className="eyebrow">MAKE A FAIR SHARE</p><h1>{!fruitSplit ? "Here is one whole moon-fruit." : !fruitShared ? "Now choose one equal piece for Nova." : "Nova has one of two equal pieces."}</h1><p>{!fruitSplit ? "Tap the fruit to make one fair cut through its middle." : !fruitShared ? "Both pieces came from the same whole and are the same size. Tap either piece to give it to Nova." : "One whole was split into 2 equal parts. Nova has 1 of those 2 parts: one-half, written 1/2."}</p><div className={fruitSplit ? "moon-fruit split" : "moon-fruit"} aria-label="One whole moon-fruit that can be split into two equal parts">{!fruitSplit ? <button type="button" aria-label="Split the whole moon-fruit fairly" onClick={() => setFruitSplit(true)}>✦</button> : <><button type="button" className={fruitShared ? "shared" : ""} aria-label="Give this equal half to Nova" onClick={() => setFruitShared(true)}>✦</button><button type="button" className={fruitShared ? "remaining" : ""} aria-label="The other equal half">✦</button></>}</div><p className="story-helper">{!fruitSplit ? "One whole · tap to split it fairly" : !fruitShared ? "2 equal parts · choose one for Nova" : "1 of 2 equal parts = 1/2"}</p>{fruitShared && <button className="primary" onClick={() => setStoryBeat(2)}>Use one-half at the bridge →</button>}</div>}
      {storyBeat === 2 && <div className="story-dialogue"><p className="eyebrow">TRY THE IDEA AGAIN</p><h1>The bridge has four equal energy panels.</h1><p>Nova knows that one-half can look different. Light two of the four equal panels to make half the bridge glow.</p><div className="bridge-cells" aria-label="Four equal bridge energy chambers">{[0, 1, 2, 3].map((cell) => <button type="button" key={cell} className={storyCells.includes(cell) ? "charged" : ""} onClick={() => toggleStoryCell(cell)} aria-pressed={storyCells.includes(cell)}><span>✦</span></button>)}</div><p className="story-helper">{bridgeReady ? "Two of four equal panels are glowing. That is also one half." : `${storyCells.length} of 4 panels glowing`}</p><button className="primary" disabled={!bridgeReady} onClick={() => setStoryBeat(3)}>Send starlight to the bridge →</button></div>}
      {storyBeat === 3 && <div className="story-dialogue resolved"><p className="eyebrow">BRIDGE RESTORED</p><h1>One-half can be 1 of 2 or 2 of 4.</h1><p>You started with one clear whole, made fair equal parts, and used the same idea again. Nova can now map the next trail with you.</p><div className="story-reveal">✦ ✦ <span>✦ ✦</span></div><button className="primary" onClick={() => setScreen("diagnostic")}>Continue with Nova →</button></div>}
    </section></main>;
  }

  if (screen === "parent") {
    return <main className="shell dashboard-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("quest")}>Back to quest</button></nav>
      <section className="dashboard-heading"><p className="eyebrow">WEEKLY PARENT SNAPSHOT</p><h1>{name}&apos;s learning, without the pressure.</h1><p>Week one · Number Sense Expedition</p></section>
      <section className="metric-grid"><article><span>Quest minutes</span><b>{Math.max(8, attempts * 5 + 8)}</b><small>Across focused sessions</small></article><article><span>Concept confidence</span><b>{confidence}%</b><small>Up from the starter diagnostic</small></article><article><span>Skills growing</span><b>{correct}/3</b><small>Fractions, comparison, proportion</small></article></section>
      <section className="parent-note"><div className="note-icon">✦</div><div><p className="eyebrow">A KIND NEXT STEP</p><h2>{recommendNextSkill(correct, attempts)}</h2><p>Explaining an idea aloud helps it stick. Keep it curious: there is no need to correct or test them.</p></div></section>
      <section className="pulse-card"><p className="eyebrow">ONE-MINUTE PARENT PULSE</p><h2>How did maths feel for {name} this week?</h2><div className="pulse-options"><button className={parentPulse === "lighter" ? "active" : ""} onClick={() => setParentPulse("lighter")}>✨ Lighter</button><button className={parentPulse === "steady" ? "active" : ""} onClick={() => setParentPulse("steady")}>🙂 Steady</button><button className={parentPulse === "hard" ? "active" : ""} onClick={() => setParentPulse("hard")}>🌧 Felt hard</button></div>{parentPulse && <p className="pulse-thanks">Thank you. This helps shape the next quest.</p>}</section>
      <section className="privacy-note"><strong>Private by design.</strong> LearnNnjoy stores a nickname, grade, and learning progress for this pilot. There are no public profiles, ads, or peer rankings. {authUser && <span> Cloud saving is active for {authUser.email}.</span>} <button className="delete-data" onClick={exportLocalPilotData}>Export local data</button><button className="delete-data" onClick={eraseLocalPilotData}>Remove local pilot data</button></section>
    </main>;
  }

  if (screen === "world") {
    return <main className="shell dashboard-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("quest")}>Back to quest</button></nav>
      <section className="dashboard-heading"><p className="eyebrow">AVATAR WORLD</p><h1>Make your expedition feel like yours.</h1><p>Cosmetics are earned through learning. They never make a quest easier.</p></section>
      <section className="world-balance"><span>🪙</span><div><b>{coins} Lumina coins</b><small>Earn 25 coins for each thoughtful quest answer.</small></div></section>
      <section className="cosmetic-grid">{cosmetics.map((cosmetic) => { const owned = ownedCosmetics.includes(cosmetic.id); const equipped = equippedCosmetic === cosmetic.id; const affordable = coins >= cosmetic.cost; return <article key={cosmetic.id} className={equipped ? "cosmetic-card equipped" : "cosmetic-card"}><div className="cosmetic-icon">{cosmetic.emoji}</div><p className="eyebrow">{equipped ? "EQUIPPED" : owned ? "IN YOUR WORLD" : `${cosmetic.cost} COINS`}</p><h2>{cosmetic.label}</h2><p>{cosmetic.detail}</p><button className="primary" disabled={!owned && !affordable} onClick={() => chooseCosmetic(cosmetic.id, cosmetic.cost)}>{equipped ? "Equipped" : owned ? "Equip" : affordable ? `Unlock for ${cosmetic.cost}` : `Need ${cosmetic.cost - coins} more`}</button></article>; })}</section>
    </main>;
  }

  if (screen === "map") {
    return <main className="shell dashboard-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("quest")}>Back to mission</button></nav>
      <section className="dashboard-heading"><p className="eyebrow">YOUR LEARNING ATLAS</p><h1>Every subject can become a world worth exploring.</h1><p>Grade {grade} · CBSE/NCERT competency roadmap · Maths is currently in the pilot.</p></section>
      <section className="atlas-grid">{gradeRoadmap.map((subject) => <article key={subject.id} className={subject.pilotStatus === "live" ? "atlas-card live" : "atlas-card"}><div className="atlas-card-top"><span className="atlas-icon">{subject.icon}</span><span className={subject.pilotStatus === "live" ? "atlas-status live" : "atlas-status"}>{subject.pilotStatus === "live" ? "PILOT NOW" : "MAPPED NEXT"}</span></div><p className="eyebrow">{subject.questWorld}</p><h2>{subject.label}</h2><ul>{subject.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>{subject.pilotStatus === "live" ? <button className="primary" onClick={() => setScreen("quest")}>Continue Lumina mission</button> : <p className="atlas-note">This world is planned in the curriculum journey. It will unlock after the Maths pilot proves the learning loop.</p>}</article>)}</section>
    </main>;
  }

  if (screen === "path") {
    const trail = chooseLearningTrail(diagnosticCorrect);
    return <main className="shell completion-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="pill">Nova found your trail</div></nav><section className="trail-card"><div className={`trail-emblem ${trail.id}`}>{trail.id === "visual" ? "◐" : trail.id === "guided" ? "✦" : "✧"}</div><p className="eyebrow">YOUR STARTING TRAIL</p><h1>{trail.label}</h1><p>{trail.message}</p><div className="trail-support"><b>How LearnNnjoy will help</b><span>{trail.support}</span></div><button className="primary" onClick={() => { setShowHint(trail.id === "visual"); setScreen("chapter"); }}>Begin my Lumina mission →</button><small>This is not a score. It is simply the most comfortable place to begin today.</small></section></main>;
  }

  if (screen === "chapter") {
    const chapter = current.visual === "fraction"
      ? { title: "The beacon doors need equal light.", dialogue: "Nova found four ancient energy chambers. The beacon only listens when we notice how equal parts fit together.", action: "Step into the energy chamber" }
      : current.visual === "number-line"
        ? { title: "The mist trail has lost its markers.", dialogue: "Nova can see the destination, but not the path. Trace the steps carefully before choosing where to go.", action: "Follow the glowing trail" }
        : { title: "The starlight bridge needs matching supplies.", dialogue: "Every explorer needs a fair share. Help Nova build equal groups so the bridge can hold everyone.", action: "Open the supply satchel" };
    return <main className={`chapter-shell chapter-${current.visual}`}><Image src="/images/lumina-bridge.png" alt="A chapter of Nova's Lumina adventure begins." fill priority sizes="100vw" className="chapter-art" /><div className="chapter-overlay" /><nav className="story-nav"><div className="brand"><span>✦</span> LearnNnjoy</div><span>Lumina restoration · discovery {questIndex + 1} of {gradeQuests.length}</span></nav><section className="chapter-dialogue"><p className="eyebrow">NOVA&apos;S STORY</p><h1>{chapter.title}</h1><p>{chapter.dialogue}</p><div className="chapter-progress"><span style={{ width: `${((questIndex + 1) / gradeQuests.length) * 100}%` }} /></div><button className="primary" onClick={() => setScreen("quest")}>{chapter.action} →</button></section></main>;
  }

  if (screen === "outcome") {
    const outcome = current.visual === "fraction"
      ? { title: "The beacon doors glow in balance.", detail: "The bridge has found its equal share of energy.", icon: "◐" }
      : current.visual === "number-line"
        ? { title: "The mist trail lights up ahead.", detail: "Nova can see exactly where the next step belongs.", icon: "⟶" }
        : { title: "The bridge supplies click into place.", detail: "Every explorer has the matching amount they need.", icon: "✦" };
    return <main className="outcome-shell"><Image src="/images/lumina-bridge.png" alt="Lumina glows brighter after the learner helps Nova." fill priority sizes="100vw" className="outcome-art" /><div className="outcome-overlay" /><nav className="story-nav"><div className="brand"><span>✦</span> LearnNnjoy</div><span>Lumina is brighter because of your idea</span></nav><section className="outcome-card"><div className="outcome-icon">{outcome.icon}</div><p className="eyebrow">MISSION MOMENT COMPLETE</p><h1>{outcome.title}</h1><p>{outcome.detail}</p><div className="outcome-explanation"><b>What you discovered</b><span>{current.explanation}</span></div>{learningTrail.id === "stretch" && <p className="outcome-reflection">Pathfinder thought: could you explain this to Nova in your own words?</p>}<div className="outcome-reward"><span>🪙</span><b>+25 Lumina coins</b><small>For thoughtful problem solving</small></div><button className="primary" onClick={continueLearning}>{questIndex < gradeQuests.length - 1 ? "See what Nova finds next →" : "Return to the restored beacon →"}</button></section></main>;
  }

  if (completed) {
    return <main className="shell completion-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("parent")}>View parent snapshot</button></nav><section className="completion-card"><div className="burst">✦</div><p className="eyebrow">EXPEDITION COMPLETE</p><h1>You found the fraction beacon, {name}!</h1><p>You used pictures, number lines, and proportional thinking to solve three real-world problems.</p><div className="reward"><span>🪙</span><div><b>+{correct * 25} Lumina coins</b><small>Use them to grow your explorer world.</small></div></div><button className="primary" onClick={() => setScreen("parent")}>See this week&apos;s progress →</button></section></main>;
  }

  return <main className="shell quest-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="quest-stats"><span>🪙 {coins}</span><span>🔥 {dailyStreak}</span><span>✨ {pet}</span><button className="text-button" onClick={() => setScreen("map")}>Learning atlas</button><button className="text-button" onClick={() => setScreen("world")}>Avatar world</button><button className="text-button" onClick={() => setScreen("parent")}>Parent view</button></div></nav>
    <section className="quest-layout"><aside className="quest-side"><div className={`mission-scene stage-${Math.min(3, correct)}`}><div className="scene-stars">✦ ✧ ✦</div><div className="beacon-core">✦</div><div className="beacon-pulse" /><div className="nova-orbit">✨</div><p>Beacon energy: {Math.min(3, correct)}/3</p></div><p className="eyebrow">{screen === "diagnostic" ? "NOVA'S RESCUE MISSION" : `GRADE ${grade} · LUMINA RESTORATION`}</p><h1>{missionTitle}</h1><p>{missionMoment}</p><div className="progress"><span style={{ width: `${screen === "diagnostic" ? ((diagnosticIndex + 1) / diagnostic.length) * 100 : ((questIndex + 1) / gradeQuests.length) * 100}%` }} /></div><small>{screen === "diagnostic" ? diagnosticIndex + 1 : questIndex + 1} of {screen === "diagnostic" ? diagnostic.length : gradeQuests.length} small discoveries</small></aside>
      <section className="quest-card"><div className="quest-top"><span className="badge">{grade <= 6 ? "Explorer" : grade <= 9 ? "Pathfinder" : "Navigator"}</span><span>{screen === "diagnostic" ? "Explore first" : "Use your discovery"}</span></div><Visual kind={current.visual} chargedPieces={chargedPieces} onCharge={chargePiece} /><div className="quest-story"><span>Nova says</span><p>{current.visual === "fraction" ? "“The beacon responds when we notice how equal pieces fit together.”" : current.visual === "number-line" ? "“Let’s trace the path before we decide.”" : "“Let’s build equal groups, then see what changes.”"}</p></div>{screen === "quest" && learningTrail.id === "visual" && <p className="trail-nudge">Visual Trail · Start with the picture. The symbols can wait.</p>}<h2>{current.prompt}</h2><div className="choice-list">{current.choices.map((choice) => <button key={choice} className={selected === choice ? "choice selected" : "choice"} onClick={() => { setSelected(choice); setFeedback(null); }}>{choice}</button>)}</div>{showHint && <div className="hint"><b>Nova&apos;s clue:</b> {current.hint}</div>}{feedback === "retry" && <div className="feedback retry"><b>Not yet—and that&apos;s useful information.</b><span>Let&apos;s slow the picture down and try a new route.</span></div>}{wrongAttemptsOnQuestion >= 2 && feedback !== "correct" && <div className="recovery-card"><p className="eyebrow">NOVA&apos;S SLOW-DOWN PATH</p><h3>You don&apos;t have to get it quickly to get it.</h3><p>{recoveryPrompt()}</p><button className="text-button" onClick={() => { setShowHint(true); setFeedback(null); }}>I&apos;m ready to look again</button></div>}{feedback === "correct" && <div className="feedback correct"><b>Beacon energy restored! +25 Lumina coins</b><span>{current.explanation}</span></div>}{feedback === "correct" && screen === "quest" && learningTrail.id === "stretch" && <div className="stretch-prompt"><b>Pathfinder thought</b><span>Can you explain this answer to Nova without using the choices?</span></div>}<div className="quest-actions">{!feedback && <><button className="text-button" onClick={() => setShowHint(true)}>Ask Nova for a clue</button><button className="primary" disabled={!selected} onClick={answer}>Send my idea →</button></>}{feedback === "correct" && <button className="primary" onClick={continueLearning}>See what changed in Lumina →</button>}{feedback === "retry" && <button className="primary" onClick={retryCurrentQuestion}>{wrongAttemptsOnQuestion >= 2 ? "Use the slow-down path" : "Try a different idea"}</button>}</div></section>
    </section></main>;
}
