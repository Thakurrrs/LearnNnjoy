import type { Metadata } from "next";
import styles from "./voice-auditions.module.css";

export const metadata: Metadata = {
  title: "Nova Voice Auditions | LearnNnjoy",
};

const auditions = [
  {
    id: "A",
    title: "Playful Spark",
    role: "Nova",
    description: "Quick, bright and adventurous.",
    src: "/audio/voice-auditions/a-playful-spark.mp3",
  },
  {
    id: "B",
    title: "Warm Companion",
    role: "Nova",
    description: "Gentle, reassuring and clear during teaching.",
    src: "/audio/voice-auditions/b-warm-companion.mp3",
  },
  {
    id: "C",
    title: "Mischievous Guide",
    role: "Nova",
    description: "Expressive, playful and a little cheeky.",
    src: "/audio/voice-auditions/c-mischievous-guide.mp3",
  },
  {
    id: "D",
    title: "Rescue Control",
    role: "Supporting character",
    description: "Calm and grounded—the contrast voice beside Nova.",
    src: "/audio/voice-auditions/d-rescue-control.mp3",
  },
] as const;

export default function VoiceAuditionsPage() {
  return <main className={styles.page}>
    <section className={styles.hero}>
      <p>LEARNNJOY · PRIVATE PRODUCT PREVIEW</p>
      <h1>Choose Nova&apos;s voice direction.</h1>
      <span>These are original AI-generated auditions, not imitations of an anime performer. Use the same speaker volume for every clip.</span>
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
      <b>What to listen for</b>
      <span>Pick the voice that makes you want to keep listening—not merely the highest or cutest voice. We can adjust its speed, energy and warmth after you choose.</span>
    </aside>
  </main>;
}
