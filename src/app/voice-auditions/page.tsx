import type { Metadata } from "next";
import styles from "./voice-auditions.module.css";

export const metadata: Metadata = {
  title: "Nova Voice Auditions | LearnNnjoy",
};

const auditions = [
  {
    id: "A",
    title: "Danger alert",
    role: "Nova",
    description: "A rescue pod is falling. Nova needs the learner to act now.",
    src: "/audio/voice-auditions/emotion/a-danger-alert.mp3",
  },
  {
    id: "B",
    title: "Calm reassurance",
    role: "Nova",
    description: "The learner feels stuck. Nova slows down and makes the next step feel safe.",
    src: "/audio/voice-auditions/emotion/b-calm-reassurance.mp3",
  },
  {
    id: "C",
    title: "Gentle correction",
    role: "Nova",
    description: "The answer is close. Nova sounds curious and guides without judging.",
    src: "/audio/voice-auditions/emotion/c-gentle-correction.mp3",
  },
  {
    id: "D",
    title: "Big celebration",
    role: "Nova",
    description: "The learner solves the rescue. Nova shares the excitement and victory.",
    src: "/audio/voice-auditions/emotion/d-big-celebration.mp3",
  },
] as const;

export default function VoiceAuditionsPage() {
  return <main className={styles.page}>
    <section className={styles.hero}>
      <p>LEARNNJOY · PRIVATE PRODUCT PREVIEW</p>
      <h1>Can you hear Nova&apos;s emotion?</h1>
      <span>One consistent Nova voice, acting four different story moments. The earlier “playful, warm, mischievous” pack was rejected because its differences were too small.</span>
    </section>

    <section className={styles.grid} aria-label="Nova voice auditions">
      {auditions.map((audition) => <article className={styles.card} key={audition.id}>
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
      <b>The eyes-closed test</b>
      <span>Ignore the words for a moment. Does the performance itself make danger urgent, reassurance gentle, correction supportive, and celebration joyful? These are AI-generated auditions—not final story audio.</span>
    </aside>
  </main>;
}
