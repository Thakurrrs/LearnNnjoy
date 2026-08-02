"""Generate the four-quest Balance Lab dialogue with local Qwen3-TTS."""

import gc
import subprocess
from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public/audio/balance-lab"
SCENE_DIR = ROOT / "public/audio/voice-auditions/scene"
VOICE_DESIGN_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit"
BASE_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-4bit"

NOVA_DIRECTION = (
    "Nova is a tiny fictional star-creature sidekick speaking English to an "
    "eleven-year-old friend inside a mysterious energy-balance lab. The voice "
    "is youthful, bright, playful, emotionally spontaneous, and reassuring "
    "without sounding like an adult, narrator, teacher, or presenter. Nova "
    "reacts to the physical beam and glowing blocks alongside a close friend."
)

NOVA_LINES = (
    {
        "name": "q1-opening-02-nova",
        "text": "The two pans control the same energy gate. Let's make them agree.",
        "emotion": "Spot a practical way to help after an alarm. Curious, collaborative, and eager to touch the machine.",
    },
    {
        "name": "q1-stage-01-nova",
        "text": "Watch the beam—it moves toward the pan with more energy.",
        "emotion": "React live as the beam tilts. Quick and observant, inviting the friend to notice the motion.",
    },
    {
        "name": "q1-stage-03-nova",
        "text": "When both sides hold the same amount, the beam is level. That is equality.",
        "emotion": "Name a pattern the two friends just made visible. Warm discovery, never a formal lesson.",
    },
    {
        "name": "q2-opening-02-nova",
        "text": "Let's change one side first, see what breaks, then fix it together.",
        "emotion": "Suggest a safe mischievous experiment. Reassure the friend that the two of you will repair it.",
    },
    {
        "name": "q2-stage-01-nova",
        "text": "Whoa—the beam tipped! One side changed while the other stayed the same.",
        "emotion": "React with genuine surprise to the visible tilt, then quickly make sense of it.",
    },
    {
        "name": "q2-stage-03-nova",
        "text": "Doing the same thing to both sides preserves equality.",
        "emotion": "Share the concise rule after watching several matching moves. Satisfied and friendly, not teacherly.",
    },
    {
        "name": "q3-opening-02-nova",
        "text": "Twelve blocks balance it. Matching removals can uncover the crate's weight.",
        "emotion": "Study the locked crate, then reveal an exciting plan as if solving a puzzle with a friend.",
    },
    {
        "name": "q3-stage-01-nova",
        "text": "Fair move—one extra block leaves each side, and the beam stays level.",
        "emotion": "Call out the physical result during active play. Rhythmic, encouraging, and concise.",
    },
    {
        "name": "q3-stage-03-nova",
        "text": "Subtracting five undid plus five. The unknown crate value is seven.",
        "emotion": "Connect the opened crate to the inverse move with delighted recognition, not a lecture.",
    },
    {
        "name": "q4-opening-02-nova",
        "text": "New numbers, same kind of beam. Let's see if our fair move still works.",
        "emotion": "Treat the changed lock as a fun new challenge. Confident but genuinely curious about the result.",
    },
    {
        "name": "q4-stage-02-nova",
        "text": "Backup lock open! The hidden value is five.",
        "emotion": "Celebrate the physical lock opening with a bright burst of relief and excitement.",
    },
    {
        "name": "q4-stage-03-nova",
        "text": "The same inverse move solved a different equation. Now we can reuse the rule.",
        "emotion": "Connect two successful repairs with an excited sense of mastery shared between friends.",
    },
)

CLONED_LINES = (
    {
        "name": "q1-opening-01-scout",
        "text": "The lab beam lost its balance. The supply doors will not power up!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q1-opening-03-kid",
        "text": "I'll load the pans and watch the beam.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.86,
    },
    {
        "name": "q1-stage-02-kid",
        "text": "Both pans hold three. The beam settled right in the middle!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q1-stage-04-scout",
        "text": "Energy gate stable. Equal loads restored the circuit!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q2-opening-01-scout",
        "text": "The beam is level, but the repair arms need a fairness test.",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.88,
    },
    {
        "name": "q2-opening-03-kid",
        "text": "I'll watch both pans—not just the numbers.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q2-stage-02-kid",
        "text": "Three matching pairs are gone, and the beam is still level!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q2-stage-04-scout",
        "text": "Fairness test passed. Both repair arms are synchronized!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q3-opening-01-scout",
        "text": "The mystery crate is locked into the left pan with five extra blocks!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q3-opening-03-kid",
        "text": "Five fair moves. Then we scan what remains.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q3-stage-02-kid",
        "text": "Scanner confirmed it—the crate has the same weight as seven blocks!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q3-stage-04-scout",
        "text": "Mystery crate identified. Seven-unit supply circuit restored!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q4-opening-01-scout",
        "text": "A backup lock just activated with a different energy code!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q4-opening-03-kid",
        "text": "No guessing. I'll prove it on both pans.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q4-stage-01-kid",
        "text": "Three fair moves left the backup crate balancing five blocks!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q4-stage-04-scout",
        "text": "Every lab circuit is stable. Balance Lab complete!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.92,
    },
)


def encode(source: Path, destination: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-af",
            (
                "highpass=f=90,"
                "loudnorm=I=-18:LRA=6:TP=-1.5,"
                "afade=t=in:st=0:d=0.025,"
                "areverse,afade=t=in:st=0:d=0.07,areverse"
            ),
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "112k",
            str(destination),
        ],
        check=True,
    )


def save_result(name: str, result: object) -> None:
    wav_output = OUTPUT_DIR / f"{name}.wav"
    mp3_output = OUTPUT_DIR / f"{name}.mp3"
    audio_write(str(wav_output), result.audio, result.sample_rate, format="wav")
    encode(wav_output, mp3_output)
    wav_output.unlink()
    print(f"Saved {mp3_output.name}: {result.audio_duration}")


def generate_nova() -> None:
    model = load_model(VOICE_DESIGN_MODEL)
    for line in NOVA_LINES:
        output = OUTPUT_DIR / f"{line['name']}.mp3"
        if output.exists():
            print(f"Keeping existing {output.name}")
            continue
        results = list(
            model.generate_voice_design(
                text=line["text"],
                language="English",
                instruct=f"{NOVA_DIRECTION} Situation: {line['emotion']}",
                temperature=0.9,
                top_p=0.95,
                verbose=True,
            )
        )
        if not results:
            raise RuntimeError(f"No audio generated for {line['name']}")
        save_result(line["name"], results[0])
    del model
    gc.collect()


def generate_scout_and_kid() -> None:
    model = load_model(BASE_MODEL)
    for line in CLONED_LINES:
        output = OUTPUT_DIR / f"{line['name']}.mp3"
        if output.exists():
            print(f"Keeping existing {output.name}")
            continue
        results = list(
            model.generate(
                text=line["text"],
                lang_code="English",
                ref_audio=str(line["reference_audio"]),
                ref_text=line["reference_text"],
                temperature=line["temperature"],
                top_p=0.95,
                repetition_penalty=1.5,
                verbose=True,
            )
        )
        if not results:
            raise RuntimeError(f"No audio generated for {line['name']}")
        save_result(line["name"], results[0])


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    generate_nova()
    generate_scout_and_kid()


if __name__ == "__main__":
    main()
