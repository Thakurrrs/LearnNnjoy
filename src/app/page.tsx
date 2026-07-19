"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import "./world.css";
import { diagnostic, recommendNextSkill, type Grade, type VisualKind } from "@/lib/learning";
import { getQuestsForGrade } from "@/lib/grade-quests";
import { recordDailyQuest } from "@/lib/streak";
import { loadOrCreateHostedLearner, saveHostedLearnerState } from "@/lib/hosted-progress";
import { getSupabaseBrowserClient, isHostedPilotConfigured } from "@/lib/supabase";

type Screen = "welcome" | "diagnostic" | "quest" | "parent" | "world";

const PILOT_PROGRESS_KEY = "learnnjoy-pilot-progress";

type SavedProgress = {
  name: string;
  grade: Grade;
  screen: Screen;
  diagnosticIndex: number;
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

function FractionVisual() {
  return <div className="pizza" aria-label="A pizza split into four equal slices"><span /><span /><span /><span /></div>;
}

function NumberLineVisual() {
  return <div className="number-line" aria-label="A number line showing halfway"><span>0</span><i /><b>6</b><i /><span>12</span></div>;
}

function RatioVisual() {
  return <div className="ratio-visual" aria-label="Two cups for four people, then four cups for eight people"><div>🥣🥣<small>4 explorers</small></div><strong>→</strong><div>🥣🥣🥣🥣<small>8 explorers</small></div></div>;
}

function Visual({ kind }: { kind: VisualKind }) {
  if (kind === "fraction") return <FractionVisual />;
  if (kind === "number-line") return <NumberLineVisual />;
  return <RatioVisual />;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade>(4);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
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

  function applySavedProgress(saved: Partial<SavedProgress>) {
    if (saved.name) setName(saved.name);
    if (saved.grade && saved.grade >= 4 && saved.grade <= 12) setGrade(saved.grade as Grade);
    if (saved.screen && saved.screen !== "welcome") setScreen(saved.screen);
    if (typeof saved.diagnosticIndex === "number") setDiagnosticIndex(Math.min(saved.diagnosticIndex, diagnostic.length - 1));
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
  const current = screen === "diagnostic" ? diagnostic[diagnosticIndex] : gradeQuests[questIndex];
  const completed = questIndex >= gradeQuests.length;
  const confidence = useMemo(() => Math.min(92, 58 + correct * 11), [correct]);

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
    const progress: SavedProgress = { name, grade, screen, diagnosticIndex, questIndex, coins, correct, attempts, guardianAcknowledged, parentPulse, ownedCosmetics, equippedCosmetic, dailyStreak, lastCompletedDate };
    window.localStorage.setItem(PILOT_PROGRESS_KEY, JSON.stringify(progress));
  }, [attempts, coins, correct, dailyStreak, diagnosticIndex, equippedCosmetic, grade, guardianAcknowledged, hydrated, lastCompletedDate, name, ownedCosmetics, parentPulse, questIndex, screen]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client || !hydrated || !authUser || !name.trim() || !guardianAcknowledged || cloudLoadStarted.current) return;
    cloudLoadStarted.current = true;

    void loadOrCreateHostedLearner(client, authUser, { name, grade, state: { name, grade, screen, diagnosticIndex, questIndex, coins, correct, attempts, guardianAcknowledged, parentPulse, ownedCosmetics, equippedCosmetic, dailyStreak, lastCompletedDate } })
      .then((hosted) => {
        applySavedProgress(hosted.state as Partial<SavedProgress>);
        setHostedLearnerId(hosted.learnerId);
        setCloudMessage("Cloud saving is on for this guardian account.");
      })
      .catch((error: unknown) => {
        cloudLoadStarted.current = false;
        setCloudMessage(error instanceof Error ? error.message : "Cloud saving could not start yet. Your progress remains on this device.");
      });
  }, [attempts, authUser, coins, correct, dailyStreak, diagnosticIndex, equippedCosmetic, grade, guardianAcknowledged, hydrated, lastCompletedDate, name, ownedCosmetics, parentPulse, questIndex, screen]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client || !hostedLearnerId || !hydrated) return;
    const timer = window.setTimeout(() => {
      void saveHostedLearnerState(client, hostedLearnerId, { name, grade, screen, diagnosticIndex, questIndex, coins, correct, attempts, guardianAcknowledged, parentPulse, ownedCosmetics, equippedCosmetic, dailyStreak, lastCompletedDate }).catch(() => {
        setCloudMessage("Your latest progress is still safe on this device; cloud saving will retry next time.");
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [attempts, coins, correct, dailyStreak, diagnosticIndex, equippedCosmetic, grade, guardianAcknowledged, hostedLearnerId, hydrated, lastCompletedDate, name, ownedCosmetics, parentPulse, questIndex, screen]);

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
      setCoins((value) => value + 25);
      const streak = recordDailyQuest({ dailyStreak, lastCompletedDate }, new Date().toISOString().slice(0, 10));
      setDailyStreak(streak.dailyStreak);
      setLastCompletedDate(streak.lastCompletedDate);
      return;
    }
    setFeedback("retry");
    setShowHint(true);
  }

  function continueLearning() {
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    if (screen === "diagnostic") {
      if (diagnosticIndex < diagnostic.length - 1) setDiagnosticIndex((value) => value + 1);
      else setScreen("quest");
      return;
    }
    if (questIndex < gradeQuests.length - 1) setQuestIndex((value) => value + 1);
    else setQuestIndex(gradeQuests.length);
  }

  function retryCurrentQuestion() {
    setSelected(null);
    setFeedback(null);
    setShowHint(true);
  }

  function eraseLocalPilotData() {
    if (!window.confirm("Remove this learner's local pilot progress from this browser? This cannot be undone.")) return;
    window.localStorage.removeItem(PILOT_PROGRESS_KEY);
    setScreen("welcome");
    setName("");
    setGrade(4);
    setDiagnosticIndex(0);
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
            <button className="primary" disabled={!name.trim() || !guardianAcknowledged} onClick={() => setScreen("diagnostic")}>Begin my gentle diagnostic <span>→</span></button>
            <p className="fine-print">A 10-minute, no-pressure starting quest. No scores are shared with anyone; local pilot data can be removed in your browser at any time.</p>
          </div>
        </div>
        <div className="hero-world"><Image className="hero-art" src="/images/lumina-hero.png" alt="A young explorer and glowing star companion discover a fraction beacon on a floating island." fill priority sizes="(max-width: 760px) 100vw, 45vw" /></div>
      </section>
      <section className="promise-row"><div><b>8–12 min</b><span>one focused quest</span></div><div><b>Visual first</b><span>understand before memorising</span></div><div><b>Private progress</b><span>no rankings or pressure</span></div></section>
    </main>;
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

  if (completed) {
    return <main className="shell completion-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("parent")}>View parent snapshot</button></nav><section className="completion-card"><div className="burst">✦</div><p className="eyebrow">EXPEDITION COMPLETE</p><h1>You found the fraction beacon, {name}!</h1><p>You used pictures, number lines, and proportional thinking to solve three real-world problems.</p><div className="reward"><span>🪙</span><div><b>+{correct * 25} Lumina coins</b><small>Use them to grow your explorer world.</small></div></div><button className="primary" onClick={() => setScreen("parent")}>See this week&apos;s progress →</button></section></main>;
  }

  return <main className="shell quest-shell"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="quest-stats"><span>🪙 {coins}</span><span>🔥 {dailyStreak}</span><span>✨ {pet}</span><button className="text-button" onClick={() => setScreen("world")}>Avatar world</button><button className="text-button" onClick={() => setScreen("parent")}>Parent view</button></div></nav>
    <section className="quest-layout"><aside className="quest-side"><p className="eyebrow">{screen === "diagnostic" ? "STARTING QUEST" : `GRADE ${grade} NUMBER SENSE EXPEDITION`}</p><h1>{screen === "diagnostic" ? "Find your starting trail" : "Restore Lumina’s fraction beacon"}</h1><p>{screen === "diagnostic" ? "There are no bad scores here. Your answers help us choose the right next challenge." : "Every answer helps map the path that fits you best."}</p><div className="progress"><span style={{ width: `${screen === "diagnostic" ? ((diagnosticIndex + 1) / diagnostic.length) * 100 : ((questIndex + 1) / gradeQuests.length) * 100}%` }} /></div><small>{screen === "diagnostic" ? diagnosticIndex + 1 : questIndex + 1} of {screen === "diagnostic" ? diagnostic.length : gradeQuests.length}</small></aside>
      <section className="quest-card"><div className="quest-top"><span className="badge">{grade <= 6 ? "Explorer" : grade <= 9 ? "Pathfinder" : "Navigator"}</span><span>{screen === "diagnostic" ? "Discover" : "Quest"}</span></div><Visual kind={current.visual} /><h2>{current.prompt}</h2><div className="choice-list">{current.choices.map((choice) => <button key={choice} className={selected === choice ? "choice selected" : "choice"} onClick={() => { setSelected(choice); setFeedback(null); }}>{choice}</button>)}</div>{showHint && <div className="hint"><b>Try this:</b> {current.hint}</div>}{feedback === "retry" && <div className="feedback retry"><b>Almost—take another look.</b><span>{current.explanation}</span></div>}{feedback === "correct" && <div className="feedback correct"><b>That’s it! +25 Lumina coins</b><span>{current.explanation}</span></div>}<div className="quest-actions">{!feedback && <><button className="text-button" onClick={() => setShowHint(true)}>I need a clue</button><button className="primary" disabled={!selected} onClick={answer}>Check my thinking →</button></>}{feedback === "correct" && <button className="primary" onClick={continueLearning}>Continue expedition →</button>}{feedback === "retry" && <button className="primary" onClick={retryCurrentQuestion}>Try a new answer</button>}</div></section>
    </section></main>;
}
