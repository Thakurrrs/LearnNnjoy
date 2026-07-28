import type { Metadata } from "next";
import styles from "./voice-auditions.module.css";

export const metadata: Metadata = {
  title: "Nova Voice Auditions | LearnNnjoy",
};

const auditions = [
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
      <h1>Which voice feels like little Nova?</h1>
      <span>The adult-sounding direction is rejected. These three original mascot auditions use the exact same words, so judge only the voice: small, bright, friendly, expressive, and comfortable for children to hear.</span>
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
      <b>This test is only for Nova&apos;s identity</b>
      <span>Choose the voice that feels like a friendly little adventure companion—not the cutest voice for five seconds. After choosing it, we will make that same voice perform danger, reassurance, correction, and celebration. These are original AI-generated auditions, not an imitation of an anime performer.</span>
    </aside>
  </main>;
}
