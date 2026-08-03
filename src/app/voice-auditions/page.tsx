import type { Metadata } from "next";
import { VoiceStoryAudition } from "@/components/voice-story-audition";
import styles from "./voice-auditions.module.css";

export const metadata: Metadata = {
  title: "Nova Voice Auditions | LearnNnjoy",
};

const hybridAuditions = [
  {
    id: "H1",
    title: "A + playful",
    role: "Mascot A cloned by Qwen3",
    description: "Mascot A’s identity performs the playful countdown with brighter punctuation.",
    src: "/audio/voice-auditions/qwen3/hybrid-playful.mp3",
  },
  {
    id: "H2",
    title: "A + mischievous",
    role: "Mascot A cloned by Qwen3",
    description: "The same cloned identity uses longer secret-plan pauses and more suspense.",
    src: "/audio/voice-auditions/qwen3/hybrid-mischievous.mp3",
  },
  {
    id: "H3",
    title: "A + warm",
    role: "Mascot A cloned by Qwen3",
    description: "A gentler “together” version that keeps Nova encouraging and close.",
    src: "/audio/voice-auditions/qwen3/hybrid-warm.mp3",
  },
] as const;

const qwenAuditions = [
  {
    id: "Q1",
    title: "Playful teammate",
    role: "Qwen3-TTS · Nova",
    description: "Curiosity builds into an energetic countdown and a joyful “GO!”",
    src: "/audio/voice-auditions/qwen3/nova-playful_000.mp3",
  },
  {
    id: "Q2",
    title: "Mischievous sidekick",
    role: "Qwen3-TTS · Nova",
    description: "A cheekier secret-plan delivery with stronger pitch and emotional movement.",
    src: "/audio/voice-auditions/qwen3/nova-mischievous.mp3",
  },
  {
    id: "Q3",
    title: "Warm and brave",
    role: "Qwen3-TTS · Nova",
    description: "A caring teammate who shares the decision, builds suspense, then celebrates.",
    src: "/audio/voice-auditions/qwen3/nova-warm-brave.mp3",
  },
  {
    id: "K1",
    title: "The child answers",
    role: "Qwen3-TTS · learner",
    description: "A confident child replies to Nova instead of silently watching the story.",
    src: "/audio/voice-auditions/qwen3/kid-confident.mp3",
  },
] as const;

const earlierAuditions = [
  {
    id: "A",
    title: "Mascot voice A",
    role: "Nova identity test",
    description: "A gentle lift: youthful, but closest to a natural teaching voice.",
    src: "/audio/voice-auditions/mascot/a-mascot-voice.mp3",
  },
  {
    id: "B",
    title: "Mascot voice B",
    role: "Nova identity test",
    description: "A clearer little-companion pitch, balanced for stories and explanations.",
    src: "/audio/voice-auditions/mascot/b-mascot-voice.mp3",
  },
  {
    id: "C",
    title: "Mascot voice C",
    role: "Nova identity test",
    description: "The smallest creature pitch—the strongest rabbit-sidekick direction.",
    src: "/audio/voice-auditions/mascot/c-mascot-voice.mp3",
  },
] as const;

export default function VoiceAuditionsPage() {
  return <main className={styles.page}>
    <section className={styles.hero}>
      <p>LEARNNJOY · PRIVATE PRODUCT PREVIEW</p>
      <h1>Does Nova finally join the game?</h1>
      <span>This version lets Nova demonstrate one straight trail, step safely aside, and hand the skateboard to the child. Choose any angle for a second straight trail; crossing and not crossing both reveal a different maths idea.</span>
    </section>

    <VoiceStoryAudition />

    <section className={styles.sectionHeading}>
      <p>EARLIER REJECTED TEST · MASCOT A + QWEN3</p>
      <h2>Why cloning was not the answer</h2>
    </section>
    <section className={styles.grid} aria-label="Mascot A and Qwen3 hybrid auditions">
      {hybridAuditions.map((audition) => <article className={styles.card} key={audition.id}>
        <div className={styles.badge}>{audition.id}</div>
        <div>
          <small>{audition.role}</small>
          <h2>{audition.title}</h2>
          <p>{audition.description}</p>
        </div>
        <audio controls preload="metadata" aria-label={`Play audition ${audition.id}, ${audition.title}`}>
          <source src={audition.src} type="audio/mpeg" />
          Your browser cannot play this audio file.
        </audio>
      </article>)}
    </section>

    <section className={styles.sectionHeading}>
      <p>EARLIER REJECTED TEST · QWEN3 VOICE DESIGN</p>
      <h2>Previous emotional voice experiments</h2>
    </section>
    <section className={styles.grid} aria-label="Nova voice auditions">
      {qwenAuditions.map((audition) => <article className={styles.card} key={audition.id}>
        <div className={styles.badge}>{audition.id}</div>
        <div>
          <small>{audition.role}</small>
          <h2>{audition.title}</h2>
          <p>{audition.description}</p>
        </div>
        <audio controls preload="metadata" aria-label={`Play audition ${audition.id}, ${audition.title}`}>
          <source src={audition.src} type="audio/mpeg" />
          Your browser cannot play this audio file.
        </audio>
      </article>)}
    </section>

    <aside className={styles.note}>
      <b>The full scene above is the new test</b>
      <span>The older auditions remain below only for comparison. The question now is whether Qwen Nova sounds like a teammate once the dialogue, bubbles and movement all support the performance.</span>
    </aside>

    <section className={styles.sectionHeading}>
      <p>EARLIER · KOKORO PITCH TEST</p>
      <h2>Previous mascot auditions</h2>
    </section>
    <section className={styles.grid} aria-label="Earlier Nova voice auditions">
      {earlierAuditions.map((audition) => <article className={styles.card} key={audition.id}>
        <div className={styles.badge}>{audition.id}</div>
        <div>
          <small>{audition.role}</small>
          <h2>{audition.title}</h2>
          <p>{audition.description}</p>
        </div>
        <audio controls preload="metadata" aria-label={`Play audition ${audition.id}, ${audition.title}`}>
          <source src={audition.src} type="audio/mpeg" />
          Your browser cannot play this audio file.
        </audio>
      </article>)}
    </section>
  </main>;
}
