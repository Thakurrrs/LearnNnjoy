"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./world.css";
import { chooseLearningTrail, type Grade, type VisualKind } from "@/lib/learning";
import { getDiagnosticForGrade, getQuestsForGrade } from "@/lib/grade-quests";
import { getScienceQuestsForGrade } from "@/lib/science-quests";
import { getEnglishQuestsForGrade } from "@/lib/english-quests";
import { getSocialQuestsForGrade } from "@/lib/social-quests";
import { getGradeRoadmap } from "@/lib/curriculum-map";
import { getLessonStory, type LessonStory } from "@/lib/lesson-story";
import { recordDailyQuest } from "@/lib/streak";
import { chooseAdaptiveNextStep } from "@/lib/adaptive";
import { readSubjectProgress, snapshotSubjectMission, type ActiveSubject, type SubjectMissionProgress, type SubjectProgress } from "@/lib/subject-progress";
import { getMissionChapter } from "@/lib/mission-chapters";
import { GradeSevenActivity, gradeSevenAdventures, gradeSevenComingSoonChapters, type GradeSevenAdventureId, type GradeSevenChapter } from "@/components/grade-seven-adventures";
import { cosmetics } from "@/lib/cosmetics";
import { ConstellationMap } from "@/components/constellation-map";
import { sound } from "@/lib/sound";
import { avatars } from "@/lib/avatars";
import { getExplorerLevel } from "@/lib/levels";
import { getPet, getPetStage, PET_CHOICE_LEVEL, PET_STAGE_LEVELS, PET_STAGE_TITLES, petMoment, pets } from "@/lib/pets";
import { HeroBadge, HeroDuo } from "@/components/hero-badge";

type Screen = "welcome" | "story" | "diagnostic" | "path" | "chapter" | "quest" | "outcome" | "world" | "map" | "adventures" | "activity";

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
  hintRequests: number;
  questIndex: number;
  coins: number;
  correct: number;
  attempts: number;
  ownedCosmetics: string[];
  equippedCosmetic: string;
  dailyStreak: number;
  lastCompletedDate: string | null;
  activeSubject: ActiveSubject;
  subjectProgress: SubjectProgress;
  nextSupportMode: "rebuild" | "steady" | "stretch";
  completedAdventures: GradeSevenAdventureId[];
  avatar: string;
  pet: string | null;
  lifetimeDiscoveries: number;
};

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

function FormulaVisual({ onExplore }: { onExplore: () => void }) {
  return <div className="visual-play"><div className="formula-visual" aria-label="A formula with an input, a rule, and an output"><span>input</span><b>→</b><strong>rule</strong><b>→</b><span>output</span></div><button className="visual-action" type="button" onClick={onExplore}>Trace the rule once</button><p>Keep each change visible as you reason.</p></div>;
}

function CoordinateVisual({ onExplore }: { onExplore: () => void }) {
  return <div className="visual-play"><div className="coordinate-visual" aria-label="A small coordinate grid with a highlighted point"><i /><i /><i /><i /><b>✦</b></div><button className="visual-action" type="button" onClick={onExplore}>Inspect the grid</button><p>Use position, direction, and distance together.</p></div>;
}

function EcosystemVisual({ onExplore }: { onExplore: () => void }) {
  return <div className="visual-play"><div className="ecosystem-visual" aria-label="A small living habitat with sun, plant, water, and animal"><span>☀️</span><span>🌱</span><span>💧</span><span>🐇</span></div><button className="visual-action" type="button" onClick={onExplore}>Observe the habitat</button><p>Notice what living things need and how their world changes.</p></div>;
}

function ReadingVisual({ onExplore }: { onExplore: () => void }) {
  return <div className="visual-play"><div className="reading-visual" aria-label="An open storybook with highlighted reading clues"><span>Once upon a clue…</span><b>✦</b><span>notice · infer · explain</span></div><button className="visual-action" type="button" onClick={onExplore}>Follow the story clues</button><p>Good readers notice details, then connect what they mean.</p></div>;
}

function MapVisual({ onExplore }: { onExplore: () => void }) {
  return <div className="visual-play"><div className="map-visual" aria-label="A small map with a compass and route markers"><b>N</b><span>⌁</span><i>●</i><i>✦</i></div><button className="visual-action" type="button" onClick={onExplore}>Trace the map clues</button><p>Maps use direction, symbols, and landmarks to tell a useful story about a place.</p></div>;
}

function StoryReel({ story }: { story: LessonStory }) {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const { frames } = { frames: story.reelFrames };

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setFrame((value) => value < frames.length - 1 ? value + 1 : 0), 2600);
    return () => window.clearInterval(timer);
  }, [frames.length, playing]);

  function startReel() {
    setFrame(0);
    setPlaying(true);
  }

  if (story.videoAsset) return <section className="story-video"><video controls preload="metadata" src={story.videoAsset.src} aria-label="Optional lesson story video" /><details><summary>Read captions</summary><p>{story.videoAsset.transcript}</p></details></section>;
  if (!playing) return <button type="button" className="story-reel-launch" onClick={startReel}><span>▶</span><div><b>Play a 15-second visual recap</b><small>Optional · captions on · replay anytime</small></div></button>;
  return <section className="story-reel" aria-live="polite"><div className={`reel-orbit reel-step-${frame}`}>✦</div><p className="eyebrow">VISUAL RECAP · {frame + 1}/4</p><p>{frames[frame]}</p><div className="reel-progress"><span style={{ width: `${((frame + 1) / frames.length) * 100}%` }} /></div><div className="reel-actions"><button type="button" className="text-button" onClick={() => setPlaying(false)}>Close recap</button><button type="button" className="text-button" onClick={startReel}>Replay</button></div></section>;
}

function Visual({ kind, chargedPieces, onCharge }: { kind: VisualKind; chargedPieces: number; onCharge: () => void }) {
  if (kind === "fraction") return <FractionVisual chargedPieces={chargedPieces} onCharge={onCharge} />;
  if (kind === "number-line") return <NumberLineVisual steps={chargedPieces} onExplore={onCharge} />;
  if (kind === "ratio") return <RatioVisual groups={chargedPieces} onExplore={onCharge} />;
  if (kind === "formula") return <FormulaVisual onExplore={onCharge} />;
  if (kind === "ecosystem") return <EcosystemVisual onExplore={onCharge} />;
  if (kind === "reading") return <ReadingVisual onExplore={onCharge} />;
  if (kind === "map") return <MapVisual onExplore={onCharge} />;
  return <CoordinateVisual onExplore={onCharge} />;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade>(4);
  const [activeSubject, setActiveSubject] = useState<ActiveSubject>("maths");
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
  const [diagnosticCorrect, setDiagnosticCorrect] = useState(0);
  const [storyBeat, setStoryBeat] = useState(0);
  const [storyCells, setStoryCells] = useState<number[]>([]);
  const [fruitSplit, setFruitSplit] = useState(false);
  const [fruitShared, setFruitShared] = useState(false);
  const [hintRequests, setHintRequests] = useState(0);
  const [questIndex, setQuestIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const [coins, setCoins] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ownedCosmetics, setOwnedCosmetics] = useState<string[]>(["trailblazer"]);
  const [equippedCosmetic, setEquippedCosmetic] = useState("trailblazer");
  const [avatar, setAvatar] = useState("explorer");
  const [pet, setPet] = useState<string | null>(null);
  const [lifetimeDiscoveries, setLifetimeDiscoveries] = useState(0);
  const [petNote, setPetNote] = useState<string | null>(null);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [chargedPieces, setChargedPieces] = useState(0);
  const [wrongAttemptsOnQuestion, setWrongAttemptsOnQuestion] = useState(0);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress>({});
  const [nextSupportMode, setNextSupportMode] = useState<SavedProgress["nextSupportMode"]>("steady");
  const [activeAdventure, setActiveAdventure] = useState<GradeSevenAdventureId>("mountain");
  const [completedAdventures, setCompletedAdventures] = useState<GradeSevenAdventureId[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("mountain");
  const gradeSevenChapters = [...gradeSevenAdventures, ...gradeSevenComingSoonChapters];
  const explorer = getExplorerLevel(lifetimeDiscoveries);

  function applySavedProgress(saved: Partial<SavedProgress>) {
    if (saved.name) setName(saved.name);
    if (saved.grade && saved.grade >= 4 && saved.grade <= 12) setGrade(saved.grade as Grade);
    if (saved.activeSubject === "maths" || ((saved.activeSubject === "science" || saved.activeSubject === "english" || saved.activeSubject === "social") && (saved.grade === 4 || saved.grade === 5 || saved.grade === 6 || saved.grade === 7 || saved.grade === 8 || saved.grade === 9 || saved.grade === 10 || saved.grade === 11 || saved.grade === 12))) setActiveSubject(saved.activeSubject);
    if (saved.screen && saved.screen !== "welcome") setScreen(saved.screen === "story" && saved.grade !== 4 ? "diagnostic" : saved.screen);
    if (typeof saved.diagnosticIndex === "number") setDiagnosticIndex(Math.min(saved.diagnosticIndex, 2));
    if (typeof saved.diagnosticCorrect === "number") setDiagnosticCorrect(Math.max(0, Math.min(3, saved.diagnosticCorrect)));
    if (typeof saved.storyBeat === "number") setStoryBeat(Math.max(0, Math.min(3, saved.storyBeat)));
    if (Array.isArray(saved.storyCells) && saved.storyCells.every((cell) => typeof cell === "number" && cell >= 0 && cell < 4)) setStoryCells(saved.storyCells);
    if (typeof saved.fruitSplit === "boolean") setFruitSplit(saved.fruitSplit);
    if (typeof saved.fruitShared === "boolean") setFruitShared(saved.fruitShared);
    if (typeof saved.hintRequests === "number") setHintRequests(Math.max(0, saved.hintRequests));
    if (typeof saved.questIndex === "number") setQuestIndex(Math.max(0, saved.questIndex));
    if (typeof saved.coins === "number") setCoins(saved.coins);
    if (typeof saved.correct === "number") setCorrect(saved.correct);
    if (typeof saved.attempts === "number") setAttempts(saved.attempts);
    if (Array.isArray(saved.ownedCosmetics) && saved.ownedCosmetics.every((item) => typeof item === "string")) setOwnedCosmetics(saved.ownedCosmetics);
    if (typeof saved.equippedCosmetic === "string") setEquippedCosmetic(saved.equippedCosmetic);
    if (typeof saved.dailyStreak === "number") setDailyStreak(saved.dailyStreak);
    if (typeof saved.lastCompletedDate === "string") setLastCompletedDate(saved.lastCompletedDate);
    if (saved.subjectProgress) setSubjectProgress(readSubjectProgress(saved.subjectProgress));
    if (saved.nextSupportMode === "rebuild" || saved.nextSupportMode === "steady" || saved.nextSupportMode === "stretch") setNextSupportMode(saved.nextSupportMode);
    if (Array.isArray(saved.completedAdventures) && saved.completedAdventures.every((id) => ["mountain", "balance", "shop", "skatepark", "cricket"].includes(id))) setCompletedAdventures(saved.completedAdventures);
    if (saved.avatar === "boy" || saved.avatar === "girl" || saved.avatar === "explorer") setAvatar(saved.avatar);
    if (saved.pet === null || (typeof saved.pet === "string" && ["dolphin", "bunny", "fox", "turtle", "dragon"].includes(saved.pet))) setPet(saved.pet ?? null);
    if (typeof saved.lifetimeDiscoveries === "number" && saved.lifetimeDiscoveries >= 0) setLifetimeDiscoveries(Math.floor(saved.lifetimeDiscoveries));
    else setLifetimeDiscoveries(Math.max(0, (saved.correct ?? 0) + (saved.completedAdventures?.length ?? 0)));
  }

  const isScienceMission = activeSubject === "science" && grade <= 12;
  const isEnglishMission = activeSubject === "english" && grade <= 12;
  const isSocialMission = activeSubject === "social" && grade <= 12;
  const subjectMissionName = isScienceMission ? "Earthkeepers field mission" : isEnglishMission ? "Story Studio mission" : isSocialMission ? "Mapmakers’ Camp" : "Lumina restoration";
  const gradeQuests = isScienceMission ? getScienceQuestsForGrade(grade) : isEnglishMission ? getEnglishQuestsForGrade(grade) : isSocialMission ? getSocialQuestsForGrade(grade) : getQuestsForGrade(grade);
  const gradeDiagnostic = getDiagnosticForGrade(grade);
  const gradeRoadmap = getGradeRoadmap(grade);
  const gradeTheme = grade <= 6 ? "theme-explorer" : grade <= 9 ? "theme-pathfinder" : "theme-navigator";
  const ageFraming = grade <= 6
    ? { role: "Explorer", object: "moon-fruit", world: "Lumina rescue" }
    : grade <= 9
      ? { role: "Pathfinder", object: "signal orb", world: "Lumina signal run" }
      : { role: "Navigator", object: "calibration core", world: "Lumina navigation brief" };
  // Keep a valid lesson available while the completed screen is rendering. The
  // completion state deliberately has questIndex === gradeQuests.length.
  const current = screen === "diagnostic"
    ? gradeDiagnostic[Math.min(diagnosticIndex, gradeDiagnostic.length - 1)]
    : gradeQuests[Math.min(questIndex, gradeQuests.length - 1)];
  const lessonStory = getLessonStory(current);
  const completed = questIndex >= gradeQuests.length;
  const learningTrail = chooseLearningTrail(diagnosticCorrect);
  const questCorrect = Math.max(0, correct - diagnosticCorrect);
  const adaptiveNextStep = chooseAdaptiveNextStep(current, {
    wrongAttempts: wrongAttemptsOnQuestion,
    hintUsed: showHint,
    recentAccuracy: questCorrect / Math.max(1, attempts - diagnosticCorrect),
  });
  const completedQuestCount = Math.min(gradeQuests.length, questIndex + (screen === "outcome" || completed ? 1 : 0));
  const completedSkills = [...new Set(gradeQuests.slice(0, completedQuestCount).map((quest) => quest.skill))];
  const activeMissionChapter = getMissionChapter(grade, activeSubject, gradeQuests.length, Math.min(questIndex, gradeQuests.length - 1));
  const skillNames = { fractions: "equal parts and fractions", "number-sense": "number sense and distance", proportion: "matching groups and proportion", algebra: "algebraic rules and relationships", geometry: "shape, position, and spatial reasoning", data: "data, chance, and interpretation", "science-inquiry": "living things, materials, and environmental care", language: "reading, vocabulary, and clear expression", "social-inquiry": "maps, community, and shared responsibility" } as const;
  const beaconEnergy = Math.min(3, Math.ceil(questCorrect / Math.max(1, Math.ceil(gradeQuests.length / 3))));
  const missionTitle = isScienceMission ? questIndex === 0 ? "Wake the garden sensors" : questIndex === 1 ? "Follow the food trail" : "Protect the pond habitat" : isEnglishMission ? questIndex === 0 ? "Open the storybook portal" : questIndex === 1 ? "Gather the word clues" : "Shape a brighter ending" : isSocialMission ? questIndex === 0 ? "Find the north marker" : questIndex === 1 ? "Trace the community route" : "Care for the shared map" : screen === "diagnostic" ? grade <= 7 ? "Nova's signal is fading" : "Set your starting signal" : questIndex === 0 ? "Restore the first beacon" : questIndex === 1 ? "Clear the mist trail" : "Open the starlight bridge";
  const missionMoment = isScienceMission ? "Observe closely, make a prediction, and use the evidence in front of you." : isEnglishMission ? "Read closely, follow the clues, and make meaning from the story." : isSocialMission ? "Use the map clues, notice people’s needs, and think about how a community works together." : screen === "diagnostic" ? grade <= 7 ? "Your choices help Nova find the trail that feels right for you." : "Three short grade-level ideas help set a useful starting point—this is not a score." : `One idea at a time. Each discovery brings Lumina back to life.`;

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
      setMuted(sound.isMuted());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || !name.trim()) return;
    const progress: SavedProgress = { name, grade, activeSubject, screen, diagnosticIndex, diagnosticCorrect, storyBeat, storyCells, fruitSplit, fruitShared, hintRequests, questIndex, coins, correct, attempts, ownedCosmetics, equippedCosmetic, dailyStreak, lastCompletedDate, subjectProgress, nextSupportMode, completedAdventures, avatar, pet, lifetimeDiscoveries };
    window.localStorage.setItem(PILOT_PROGRESS_KEY, JSON.stringify(progress));
  }, [activeSubject, attempts, avatar, coins, completedAdventures, correct, dailyStreak, diagnosticCorrect, diagnosticIndex, equippedCosmetic, fruitShared, fruitSplit, grade, hintRequests, hydrated, lastCompletedDate, lifetimeDiscoveries, name, nextSupportMode, ownedCosmetics, pet, questIndex, screen, storyBeat, storyCells, subjectProgress]);

  function answer() {
    if (!selected || !current) return;
    setAttempts((value) => value + 1);
    if (selected === current.answer) {
      const nextStep = chooseAdaptiveNextStep(current, {
        wrongAttempts: wrongAttemptsOnQuestion,
        hintUsed: showHint,
        recentAccuracy: questCorrect / Math.max(1, attempts - diagnosticCorrect),
      });
      setFeedback("correct");
      sound.play("success");
      sound.play("coin");
      setCorrect((value) => value + 1);
      if (screen === "diagnostic") setDiagnosticCorrect((value) => value + 1);
      setCoins((value) => value + 25);
      setPetNote(petMoment(lifetimeDiscoveries, lifetimeDiscoveries + 1, pet));
      setLifetimeDiscoveries((value) => value + 1);
      const streak = recordDailyQuest({ dailyStreak, lastCompletedDate }, new Date().toISOString().slice(0, 10));
      setDailyStreak(streak.dailyStreak);
      setLastCompletedDate(streak.lastCompletedDate);
      if (screen === "quest") {
        setNextSupportMode(nextStep.mode);
        setScreen("outcome");
      }
      return;
    }
    setWrongAttemptsOnQuestion((value) => value + 1);
    setFeedback("retry");
    sound.play("tap");
    setShowHint(true);
  }

  function continueLearning() {
    setSelected(null);
    setFeedback(null);
    setShowHint(screen === "outcome" && nextSupportMode === "rebuild");
    setChargedPieces(0);
    setWrongAttemptsOnQuestion(0);
    if (screen === "diagnostic") {
      if (diagnosticIndex < gradeDiagnostic.length - 1) setDiagnosticIndex((value) => value + 1);
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
    if (current.visual === "formula") return "Keep the rule visible. Undo or apply one operation at a time, checking what stays balanced.";
    if (current.visual === "coordinate") return "Read the model before choosing. Look for position, structure, or the full set of possible outcomes.";
    if (current.visual === "ecosystem") return "Look at the habitat clue again. Ask what a living thing needs, what a material does, or how the change affects the world around it.";
    if (current.visual === "reading") return "Return to the exact words in the sentence. Then ask what those details tell you together.";
    if (current.visual === "map") return "Use the compass, symbols, or people clues one at a time. Ask what the map or situation is showing you.";
    return "Build one equal group first. When the group changes, make the matching group change in the same way.";
  }

  function chargePiece() {
    setChargedPieces((value) => Math.min(4, value + 1));
  }

  function askNovaForClue() {
    if (!showHint) setHintRequests((value) => value + 1);
    setShowHint(true);
  }

  function toggleStoryCell(cell: number) {
    setStoryCells((cells) => cells.includes(cell) ? cells.filter((item) => item !== cell) : cells.length < 2 ? [...cells, cell] : cells);
  }

  function currentMissionProgress(): SubjectMissionProgress {
    return { questIndex, correct, attempts, hintRequests, diagnosticCorrect };
  }

  function startSubjectMission(nextSubject: ActiveSubject) {
    setSubjectProgress((progress) => snapshotSubjectMission(progress, activeSubject, currentMissionProgress()));
    const savedMission = subjectProgress[nextSubject];
    setActiveSubject(nextSubject);
    setQuestIndex(savedMission?.questIndex ?? 0);
    setCorrect(savedMission?.correct ?? 0);
    setAttempts(savedMission?.attempts ?? 0);
    setHintRequests(savedMission?.hintRequests ?? 0);
    setDiagnosticCorrect(nextSubject === "maths" ? (savedMission?.diagnosticCorrect ?? diagnosticCorrect) : 0);
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    setWrongAttemptsOnQuestion(0);
    setScreen(savedMission?.questIndex ? "chapter" : nextSubject === "maths" ? "quest" : "chapter");
  }

  function chooseGrade(nextGrade: Grade) {
    // avatar, pet, and lifetimeDiscoveries are permanent - never reset them here
    setGrade(nextGrade);
    setActiveSubject("maths");
    setDiagnosticIndex(0);
    setDiagnosticCorrect(0);
    setQuestIndex(0);
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    setWrongAttemptsOnQuestion(0);
    setHintRequests(0);
    setCorrect(0);
    setAttempts(0);
    setSubjectProgress({});
    setNextSupportMode("steady");
  }

  function openGradePicker() {
    setActiveSubject("maths");
    setDiagnosticIndex(0);
    setDiagnosticCorrect(0);
    setQuestIndex(0);
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    setWrongAttemptsOnQuestion(0);
    setHintRequests(0);
    setCorrect(0);
    setAttempts(0);
    setSubjectProgress({});
    setNextSupportMode("steady");
    setScreen("welcome");
  }

  function chooseCosmetic(id: string, cost: number) {
    if (ownedCosmetics.includes(id)) return setEquippedCosmetic(id);
    if (coins < cost) return;
    setCoins((value) => value - cost);
    setOwnedCosmetics((items) => [...items, id]);
    setEquippedCosmetic(id);
  }

  function openGradeSevenAdventure(id: GradeSevenAdventureId) {
    setActiveAdventure(id);
    setScreen("activity");
  }

  function finishGradeSevenAdventure() {
    sound.play("finale");
    if (!completedAdventures.includes(activeAdventure)) {
      setCompletedAdventures((items) => [...items, activeAdventure]);
      setCoins((value) => value + 25);
      setPetNote(petMoment(lifetimeDiscoveries, lifetimeDiscoveries + 1, pet));
      setLifetimeDiscoveries((value) => value + 1);
    }
    setScreen("adventures");
  }

  if (screen === "welcome") {
    return <main className={`shell welcome-shell ${gradeTheme}`}>
      <nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="pill">Private learner adventure</div></nav>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE NUMBER SENSE EXPEDITION</p>
          <h1>Maths becomes a world you want to explore.</h1>
          <p className="lede">Visual, interactive quests for Grades 4–12—designed to replace “I can’t do maths” with “let me try one more.”</p>
          <div className="welcome-card">
            <label>Explorer nickname<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aanya" maxLength={24} /></label>
            <label>School grade<select value={grade} onChange={(event) => chooseGrade(Number(event.target.value) as Grade)}>{[4,5,6,7,8,9,10,11,12].map((item) => <option key={item} value={item}>Grade {item}</option>)}</select></label>
            <div className="avatar-picker"><p className="eyebrow">CHOOSE YOUR EXPLORER</p><div className="avatar-chip-row">{avatars.map((option) => <button key={option.id} type="button" className={avatar === option.id ? "avatar-chip selected" : "avatar-chip"} aria-pressed={avatar === option.id} onClick={() => setAvatar(option.id)}><HeroBadge avatar={option.id} size="md" /><small>{option.label}</small></button>)}</div></div>
            <div className="grade-preview"><p className="eyebrow">GRADE {grade} MATHS STARTER</p><b>{gradeRoadmap.find((subject) => subject.id === "maths")?.topics[0]}</b><span>First discovery: {getQuestsForGrade(grade)[0].prompt}</span></div>
            <button className="primary" disabled={!name.trim()} onClick={() => setScreen(grade === 7 ? "adventures" : grade === 4 ? "story" : "diagnostic")}>{grade === 7 ? "Enter the Grade 7 adventure map" : grade === 4 ? "Help Nova restore the first beacon" : `Start Grade ${grade} maths calibration`} <span>→</span></button>
            <p className="fine-print">Your progress stays on this device. No rankings, public profiles, or peer pressure.</p>
          </div>
        </div>
        <div className="hero-world"><Image className="hero-art" src="/images/lumina-hero.png" alt="A young explorer and glowing star companion discover a fraction beacon on a floating island." fill priority sizes="(max-width: 760px) 100vw, 45vw" /></div>
      </section>
      <section className="promise-row"><div><b>8–12 min</b><span>one focused quest</span></div><div><b>Visual first</b><span>understand before memorising</span></div><div><b>Private progress</b><span>no rankings or pressure</span></div></section>
    </main>;
  }

  if (screen === "story") {
    const bridgeReady = storyCells.length === 2;
    return <main className={`story-shell ${gradeTheme} beat-${storyBeat}`}><Image src="/images/lumina-bridge.png" alt="Nova waits by a broken starlight bridge in the world of Lumina." fill priority sizes="100vw" className="story-art" /><div className="story-vignette" /><nav className="story-nav"><div className="brand"><span>✦</span> LearnNnjoy</div><span>{ageFraming.world} · {storyBeat + 1}/4</span></nav><section className="story-player">
      {storyBeat === 0 && <div className="story-dialogue"><p className="eyebrow">CHAPTER ONE · {ageFraming.role.toUpperCase()}</p><h1>Nova has one whole {ageFraming.object}.</h1><p>{grade <= 6 ? "Two explorers need a fair share before they cross the bridge." : "The bridge can only initialise when its energy is divided fairly."} Can you help Nova reason from one clear whole?</p><button className="primary" onClick={() => setStoryBeat(1)}>{grade <= 6 ? "Help Nova share it" : "Start the calibration"} →</button></div>}
      {storyBeat === 1 && <div className="story-dialogue"><p className="eyebrow">MAKE A FAIR SHARE</p><h1>{!fruitSplit ? `Here is one whole ${ageFraming.object}.` : !fruitShared ? "Now choose one equal piece for Nova." : "Nova has one of two equal pieces."}</h1><p>{!fruitSplit ? `Tap the ${ageFraming.object} to make one fair cut through its middle.` : !fruitShared ? "Both pieces came from the same whole and are the same size. Tap either piece to give it to Nova." : "One whole was split into 2 equal parts. Nova has 1 of those 2 parts: one-half, written 1/2."}</p><div className={`${fruitSplit ? "moon-fruit split" : "moon-fruit"} ${gradeTheme}`} aria-label={`One whole ${ageFraming.object} that can be split into two equal parts`}>{!fruitSplit ? <button type="button" aria-label={`Split the whole ${ageFraming.object} fairly`} onClick={() => setFruitSplit(true)}>✦</button> : <><button type="button" className={fruitShared ? "shared" : ""} aria-label="Give this equal half to Nova" onClick={() => setFruitShared(true)}>✦</button><button type="button" className={fruitShared ? "remaining" : ""} aria-label="The other equal half">✦</button></>}</div><p className="story-helper">{!fruitSplit ? "One whole · tap to split it fairly" : !fruitShared ? "2 equal parts · choose one for Nova" : "1 of 2 equal parts = 1/2"}</p>{fruitShared && <button className="primary" onClick={() => setStoryBeat(2)}>{grade <= 6 ? "Use one-half at the bridge" : "Apply the same relationship"} →</button>}</div>}
      {storyBeat === 2 && <div className="story-dialogue"><p className="eyebrow">TRY THE IDEA AGAIN</p><h1>The bridge has four equal energy panels.</h1><p>Nova knows that one-half can look different. Light two of the four equal panels to make half the bridge glow.</p><div className="bridge-cells" aria-label="Four equal bridge energy chambers">{[0, 1, 2, 3].map((cell) => <button type="button" key={cell} className={storyCells.includes(cell) ? "charged" : ""} onClick={() => toggleStoryCell(cell)} aria-pressed={storyCells.includes(cell)}><span>✦</span></button>)}</div><p className="story-helper">{bridgeReady ? "Two of four equal panels are glowing. That is also one half." : `${storyCells.length} of 4 panels glowing`}</p><button className="primary" disabled={!bridgeReady} onClick={() => setStoryBeat(3)}>Send starlight to the bridge →</button></div>}
      {storyBeat === 3 && <div className="story-dialogue resolved"><p className="eyebrow">BRIDGE RESTORED</p><h1>One-half can be 1 of 2 or 2 of 4.</h1><p>You started with one clear whole, made fair equal parts, and used the same idea again. Nova can now map the next trail with you.</p><div className="story-reveal">✦ ✦ <span>✦ ✦</span></div><button className="primary" onClick={() => setScreen("diagnostic")}>Continue with Nova →</button></div>}
    </section></main>;
  }

  if (screen === "adventures") {
    const selected = gradeSevenChapters.find((chapter) => chapter.id === selectedChapter) ?? gradeSevenChapters[0];
    const selectedComingSoon = "status" in selected;
    const selectedCompleted = !selectedComingSoon && completedAdventures.includes(selected.id as GradeSevenAdventureId);
    return <main className="shell adventure-shell theme-pathfinder"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="quest-stats"><HeroDuo avatar={avatar} name={name} equippedCosmetic={equippedCosmetic} level={explorer.level} pet={pet} size="sm" /><button className="text-button" aria-label={muted ? "Turn sounds on" : "Turn sounds off"} onClick={() => setMuted(sound.toggleMuted())}>{muted ? "🔇" : "🔊"}</button><button className="text-button" onClick={openGradePicker}>Switch grade</button></div></nav>
      <section className="adventure-hero"><p className="eyebrow">GRADE 7 · MATHS CONSTELLATION</p><h1>Light every star in the Lumina sky.</h1><p>Each Grade 7 topic is a star on Nova&apos;s trail. Bright stars are ready to play; dim stars wait on the horizon.</p><p className="adventure-progress">{completedAdventures.length}/{gradeSevenAdventures.length} stars lit · {gradeSevenChapters.length} topics mapped</p></section>
      {petNote && <button type="button" className="pet-note pet-note-dismiss" onClick={() => setPetNote(null)}>⭐ {petNote} ✕</button>}
      <ConstellationMap chapters={gradeSevenChapters} completedIds={completedAdventures} selectedId={selectedChapter} onSelect={setSelectedChapter} />
      <section className="star-detail" aria-live="polite"><span className="star-detail-icon">{selected.icon}</span><div><p className="eyebrow">{selectedComingSoon ? "NOVA IS PREPARING THIS WORLD" : selectedCompleted ? "STAR LIT · PLAY AGAIN ANYTIME" : "READY TO PLAY"}</p><h2>{selected.topic}</h2><p className="story-world">Story world · {selected.title}</p><div className="subtopic-row">{selected.subtopics.map((subtopic) => <span key={subtopic}>{subtopic}</span>)}</div><p>{selected.intro}</p>{selectedComingSoon ? <div className="coming-soon-note"><span>✦</span><b>Coming soon</b><small>This star will brighten when its interactive chapter is ready.</small></div> : <button className="primary" onClick={() => openGradeSevenAdventure(selected.id as GradeSevenAdventureId)}>{selectedCompleted ? "Explore again →" : `${(selected as GradeSevenChapter).action} →`}</button>}</div></section>
    </main>;
  }

  if (screen === "activity") {
    return <main className={`shell activity-shell theme-pathfinder world-theme-${activeAdventure}`}><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="quest-stats"><HeroDuo avatar={avatar} equippedCosmetic={equippedCosmetic} level={explorer.level} pet={pet} size="sm" /><button className="text-button" aria-label={muted ? "Turn sounds on" : "Turn sounds off"} onClick={() => setMuted(sound.toggleMuted())}>{muted ? "🔇" : "🔊"}</button><button className="text-button" onClick={() => setScreen("adventures")}>Adventure map</button></div></nav><GradeSevenActivity id={activeAdventure} firstTime={!completedAdventures.includes(activeAdventure)} onFinish={finishGradeSevenAdventure} /></main>;
  }

  if (screen === "world") {
    return <main className={`shell dashboard-shell ${gradeTheme}`}><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("quest")}>Back to quest</button></nav>
      <section className="dashboard-heading"><p className="eyebrow">AVATAR WORLD</p><h1>Make your expedition feel like yours.</h1><p>Cosmetics are earned through learning. They never make a quest easier.</p></section>
      <section className="nova-preview"><HeroBadge avatar={avatar} name={name} size="lg" level={explorer.level} equippedCosmetic={equippedCosmetic} /><p>Everything you wear was earned by your ideas. {explorer.toNext} more {explorer.toNext === 1 ? "discovery" : "discoveries"} to Level {explorer.level + 1}.</p></section><section className="world-balance"><span>🪙</span><div><b>{coins} Lumina coins</b><small>Earn 25 coins for each thoughtful quest answer.</small></div></section>
      <section className="cosmetic-grid">{cosmetics.map((cosmetic) => { const owned = ownedCosmetics.includes(cosmetic.id); const equipped = equippedCosmetic === cosmetic.id; const affordable = coins >= cosmetic.cost; return <article key={cosmetic.id} className={equipped ? "cosmetic-card equipped" : "cosmetic-card"}><div className="cosmetic-icon">{cosmetic.emoji}</div><p className="eyebrow">{equipped ? "EQUIPPED" : owned ? "IN YOUR WORLD" : `${cosmetic.cost} COINS`}</p><h2>{cosmetic.label}</h2><p>{cosmetic.detail}</p><button className="primary" disabled={!owned && !affordable} onClick={() => chooseCosmetic(cosmetic.id, cosmetic.cost)}>{equipped ? "Equipped" : owned ? "Equip" : affordable ? `Unlock for ${cosmetic.cost}` : `Need ${cosmetic.cost - coins} more`}</button></article>; })}</section>
      <section className="star-friend">{pet ? (() => { const chosen = getPet(pet)!; const stage = getPetStage(explorer.level); const nextStageLevel = PET_STAGE_LEVELS.find((at) => at > explorer.level); return <><span className={`friend-face pet-stage-${Math.max(1, stage)}`}>{chosen.emoji}</span><div><p className="eyebrow">YOUR STAR FRIEND</p><b>{chosen.name} the {chosen.species} · {PET_STAGE_TITLES[Math.max(1, stage) - 1]}</b><small>{nextStageLevel ? `Grows again at Level ${nextStageLevel}` : "Fully grown — and very proud of you"}</small></div></>; })() : explorer.level >= PET_CHOICE_LEVEL ? <><span className="friend-face egg-ready">🥚</span><div><p className="eyebrow">A STAR-EGG IS HATCHING!</p><b>Choose your forever friend</b><div className="pet-choice-row">{pets.map((option) => <button key={option.id} type="button" className="pet-chip" onClick={() => { setPet(option.id); sound.play("finale"); }}><span>{option.emoji}</span><small>{option.name}</small><i>{option.species}</i></button>)}</div><small>Choose carefully — your friend stays with you forever.</small></div></> : <><span className="friend-face egg-dim">🥚</span><div><p className="eyebrow">STAR-EGG</p><b>Something is sleeping inside…</b><small>Hatches at Level {PET_CHOICE_LEVEL} · {explorer.toNext} more {explorer.toNext === 1 ? "discovery" : "discoveries"} to go</small></div></>}</section>
    </main>;
  }

  if (screen === "map") {
    return <main className={`shell dashboard-shell ${gradeTheme}`}><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("quest")}>Back to mission</button></nav>
      <section className="dashboard-heading"><p className="eyebrow">YOUR LEARNING ATLAS</p><h1>Every subject can become a world worth exploring.</h1><p>Grade {grade} · CBSE/NCERT competency roadmap · Maths, Science, English, and Social Science each have a playable mission.</p></section>
      <section className="atlas-grid">{gradeRoadmap.map((subject) => <article key={subject.id} className={subject.pilotStatus === "live" ? "atlas-card live" : "atlas-card"}><div className="atlas-card-top"><span className="atlas-icon">{subject.icon}</span><span className={subject.pilotStatus === "live" ? "atlas-status live" : "atlas-status"}>{subject.pilotStatus === "live" ? "PILOT NOW" : "MAPPED NEXT"}</span></div><p className="eyebrow">{subject.questWorld}</p><h2>{subject.label}</h2><ul>{subject.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>{subject.pilotStatus === "live" ? <button className="primary" onClick={() => startSubjectMission(subject.id)}>{subject.id === "science" ? "Begin Earthkeepers mission" : subject.id === "english" ? "Open Story Studio" : subject.id === "social" ? "Enter Mapmakers’ Camp" : "Continue Maths mission"}</button> : <p className="atlas-note">This world is planned in the curriculum journey. It will unlock after the current pilot proves the learning loop.</p>}</article>)}</section>
    </main>;
  }

  if (screen === "path") {
    const trail = chooseLearningTrail(diagnosticCorrect);
    return <main className={`shell completion-shell ${gradeTheme}`}><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="pill">Nova found your trail</div></nav><section className="trail-card"><div className={`trail-emblem ${trail.id}`}>{trail.id === "visual" ? "◐" : trail.id === "guided" ? "✦" : "✧"}</div><p className="eyebrow">YOUR STARTING TRAIL</p><h1>{trail.label}</h1><p>{trail.message}</p><div className="trail-support"><b>How LearnNnjoy will help</b><span>{trail.support}</span></div><button className="primary" onClick={() => { setShowHint(trail.id === "visual"); setScreen("chapter"); }}>Begin my Lumina mission →</button><small>This is not a score. It is simply the most comfortable place to begin today.</small></section></main>;
  }

  if (screen === "chapter") {
    const sceneImage = current.visual === "number-line" ? "/images/lumina-mist-trail.png" : "/images/lumina-bridge.png";
    return <main className={`chapter-shell chapter-${current.visual} ${gradeTheme}`}><Image src={sceneImage} alt="A chapter of Nova's learning adventure begins." fill priority sizes="100vw" className="chapter-art" /><div className="chapter-overlay" /><nav className="story-nav"><div className="brand"><span>✦</span> LearnNnjoy</div><span>{subjectMissionName} · discovery {questIndex + 1} of {gradeQuests.length}</span></nav><section className="chapter-dialogue"><p className="eyebrow">CHAPTER {activeMissionChapter.number} · {activeMissionChapter.topic}</p><h1>{lessonStory.chapterTitle}</h1><p>{lessonStory.chapterDialogue}</p><StoryReel story={lessonStory} />{current.visual === "ratio" && <div className="chapter-groups" aria-label="One matching group becomes two matching groups"><div>✦✦<small>one group</small></div><strong>→</strong><div>✦✦✦✦<small>two matching groups</small></div></div>}{current.visual === "fraction" && <div className="chapter-whole" aria-label="One whole divided into two equal pieces"><span /><span /></div>}<div className="chapter-progress"><span style={{ width: `${((questIndex + 1) / gradeQuests.length) * 100}%` }} /></div><button className="primary" onClick={() => setScreen("quest")}>{lessonStory.chapterAction} →</button></section></main>;
  }

  if (screen === "outcome") {
    const sceneImage = current.visual === "number-line" ? "/images/lumina-mist-trail.png" : "/images/lumina-bridge.png";
    return <main className={`outcome-shell ${gradeTheme}`}><Image src={sceneImage} alt="Lumina glows brighter after the learner helps Nova." fill priority sizes="100vw" className="outcome-art" /><div className="outcome-overlay" /><nav className="story-nav"><div className="brand"><span>✦</span> LearnNnjoy</div><span>Lumina is brighter because of your idea</span></nav><section className="outcome-card"><div className="outcome-icon">{lessonStory.outcomeIcon}</div><div className="outcome-nova"><HeroDuo avatar={avatar} name={name} equippedCosmetic={equippedCosmetic} level={explorer.level} pet={pet} size="md" /></div><p className="eyebrow">MISSION MOMENT COMPLETE</p><h1>{lessonStory.outcomeTitle}</h1><p>{lessonStory.outcomeDetail}</p><div className="outcome-explanation"><b>What you discovered</b><span>{current.explanation}</span></div><div className="outcome-explanation adaptive-note"><b>{adaptiveNextStep.title}</b><span>{adaptiveNextStep.message}</span></div>{petNote && <div className="pet-note" role="status">⭐ {petNote}</div>}{learningTrail.id === "stretch" && <p className="outcome-reflection">Pathfinder thought: could you explain this to Nova in your own words?</p>}<div className="outcome-reward"><span>🪙</span><b>+25 Lumina coins</b><small>For thoughtful problem solving</small></div><button className="primary" onClick={continueLearning}>{questIndex < gradeQuests.length - 1 ? "See what Nova finds next →" : "Return to the restored beacon →"}</button></section></main>;
  }

  if (completed) {
    return <main className={`shell completion-shell ${gradeTheme}`}><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><button className="text-button" onClick={() => setScreen("map")}>Learning atlas</button></nav><section className="completion-card"><div className="burst">✦</div><p className="eyebrow">MISSION COMPLETE</p><h1>{isScienceMission ? `You protected the habitat, ${name}!` : isEnglishMission ? `You unlocked the Story Studio, ${name}!` : isSocialMission ? `You mapped a kinder community, ${name}!` : `You completed Grade ${grade} maths, ${name}!`}</h1><p>You made {gradeQuests.length} connected discoveries about {completedSkills.map((skill) => skillNames[skill]).join(" and ")}.</p><div className="reward"><span>🪙</span><div><b>+{questCorrect * 25} Lumina coins</b><small>Earned by solving the mission ideas.</small></div></div><button className="primary" onClick={() => setScreen("map")}>Choose another world →</button></section></main>;
  }

  return <main className={`shell quest-shell ${gradeTheme}`}><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="quest-stats"><span>🪙 {coins}</span><span>🔥 {dailyStreak}</span><HeroDuo avatar={avatar} name={name} equippedCosmetic={equippedCosmetic} level={explorer.level} pet={pet} size="sm" /><button className="text-button" aria-label={muted ? "Turn sounds on" : "Turn sounds off"} onClick={() => setMuted(sound.toggleMuted())}>{muted ? "🔇" : "🔊"}</button><button className="text-button" onClick={openGradePicker}>Switch grade</button><button className="text-button" onClick={() => setScreen("map")}>Learning atlas</button><button className="text-button" onClick={() => setScreen("world")}>Avatar world</button></div></nav>
    <section className="quest-layout"><aside className="quest-side"><div className={`mission-scene stage-${beaconEnergy}`}><div className="scene-stars">✦ ✧ ✦</div><div className="beacon-core">✦</div><div className="beacon-pulse" /><div className="nova-orbit">✨</div><p>Beacon energy: {beaconEnergy}/3</p></div><p className="eyebrow">{screen === "diagnostic" ? grade <= 7 ? "NOVA'S RESCUE MISSION" : "MATHS CALIBRATION" : `GRADE ${grade} · LUMINA RESTORATION`}</p><h1>{missionTitle}</h1><p>{missionMoment}</p><div className="progress"><span style={{ width: `${screen === "diagnostic" ? ((diagnosticIndex + 1) / gradeDiagnostic.length) * 100 : ((questIndex + 1) / gradeQuests.length) * 100}%` }} /></div><small>{screen === "diagnostic" ? diagnosticIndex + 1 : questIndex + 1} of {screen === "diagnostic" ? gradeDiagnostic.length : gradeQuests.length} small discoveries</small></aside>
      <section className="quest-card"><div className="quest-top"><span className="badge">{grade <= 6 ? "Explorer" : grade <= 9 ? "Pathfinder" : "Navigator"}</span><span>{screen === "diagnostic" ? "Explore first" : "Use your discovery"}</span></div><Visual kind={current.visual} chargedPieces={chargedPieces} onCharge={chargePiece} /><div className="quest-story"><span>Nova says</span><p>{lessonStory.coachLine}</p></div>{screen === "quest" && learningTrail.id === "visual" && <p className="trail-nudge">Visual Trail · Start with the picture. The symbols can wait.</p>}<h2>{current.prompt}</h2><div className="choice-list">{current.choices.map((choice) => <button key={choice} className={selected === choice ? "choice selected" : "choice"} onClick={() => { setSelected(choice); setFeedback(null); sound.play("tap"); }}>{choice}</button>)}</div>{showHint && <div className="hint"><b>Nova&apos;s clue:</b> {current.hint}</div>}{feedback === "retry" && <div className="feedback retry"><b>Not yet—and that&apos;s useful information.</b><span>Let&apos;s slow the picture down and try a new route.</span></div>}{wrongAttemptsOnQuestion >= 2 && feedback !== "correct" && <div className="recovery-card"><p className="eyebrow">NOVA&apos;S SLOW-DOWN PATH</p><h3>You don&apos;t have to get it quickly to get it.</h3><p>{recoveryPrompt()}</p><button className="text-button" onClick={() => { setShowHint(true); setFeedback(null); }}>I&apos;m ready to look again</button></div>}{feedback === "correct" && <div className="feedback correct"><b>Beacon energy restored! +25 Lumina coins</b><span>{current.explanation}</span></div>}{feedback === "correct" && screen === "quest" && learningTrail.id === "stretch" && <div className="stretch-prompt"><b>Pathfinder thought</b><span>Can you explain this answer to Nova without using the choices?</span></div>}<div className="quest-actions">{!feedback && <><button className="text-button" onClick={askNovaForClue}>Ask Nova for a clue</button><button className="primary" disabled={!selected} onClick={answer}>Send my idea →</button></>}{feedback === "correct" && <button className="primary" onClick={continueLearning}>See what changed in Lumina →</button>}{feedback === "retry" && <button className="primary" onClick={retryCurrentQuestion}>{wrongAttemptsOnQuestion >= 2 ? "Use the slow-down path" : "Try a different idea"}</button>}</div></section>
    </section></main>;
}
