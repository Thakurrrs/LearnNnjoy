"""Generate the three-character Crossing Rails story with local Qwen3-TTS."""

import gc
import subprocess
from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public/audio/skatepark-story"
SCENE_DIR = ROOT / "public/audio/voice-auditions/scene"
VOICE_DESIGN_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit"
BASE_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-4bit"

NOVA_DIRECTION = (
    "Nova is a tiny fictional star-creature sidekick speaking English to an "
    "eleven-year-old friend during a fast skateboard game. The voice is youthful, "
    "bright, playful, slightly mischievous, and emotionally spontaneous. Nova is "
    "inside the action and talking to friends, never narrating, teaching, presenting, "
    "or sounding like an adult trying to be friendly."
)

NOVA_LINES = (
    {
        "name": "q2-opening-02-nova",
        "text": "Ready—but our openings have to match.",
        "emotion": "Answer a playful challenge with focused excitement. Ready is eager; match is a curious plan, not a lesson.",
    },
    {
        "name": "q2-opening-05-nova",
        "text": "Then all four openings changed. Help us rebuild the trick?",
        "emotion": "React quickly to a surprising rail shift, then invite a close friend into the rescue with hopeful energy.",
    },
    {
        "name": "q2-closing-03-nova",
        "text": "We landed it! Across matches. Beside makes a line.",
        "emotion": "Burst with genuine shared victory after landing a difficult trick. The two short pattern phrases are excited discoveries, not instruction.",
    },
    {
        "name": "q2-stage-02-nova",
        "text": "Yes! The corners across the X match.",
        "emotion": "React with delighted recognition when a friend lights the matching corner. This is a quick shared discovery, not an explanation.",
    },
    {
        "name": "q2-stage-01-route-nova",
        "text": "Blue path first—watch me!",
        "emotion": "Call out a fast, playful skateboard launch to a close friend. Sound daring and delighted, as if Nova is already rolling.",
    },
)

CLONED_LINES = (
    {
        "name": "q2-opening-01-rider",
        "text": "Nova! Ready for the mirror crossing?",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.86,
    },
    {
        "name": "q2-opening-03-kid",
        "text": "I'll watch the rails!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.82,
    },
    {
        "name": "q2-opening-04-rider",
        "text": "Whoa! My trail just shifted!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q2-opening-06-kid",
        "text": "Let's light it up!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.86,
    },
    {
        "name": "q2-closing-01-rider",
        "text": "Same opening—now!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.88,
    },
    {
        "name": "q2-closing-02-kid",
        "text": "The straight exit is clear!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.84,
    },
    {
        "name": "q2-closing-04-rider",
        "text": "Next course?",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.88,
    },
    {
        "name": "q2-stage-01-rider",
        "text": "Turn my pink trail. Watch every opening.",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.84,
    },
    {
        "name": "q2-stage-01-kid",
        "text": "Whoa—all four openings moved with it!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q2-stage-01-route-kid",
        "text": "Clear! My straight path crosses next!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q2-stage-01-result-rider",
        "text": "Perfect! Same point, different times—no crash!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q2-stage-02-rider",
        "text": "Pick one opening. Can you find its match across the X?",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.86,
    },
    {
        "name": "q2-stage-03-kid",
        "text": "We still need one straight way out.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.8,
    },
    {
        "name": "q2-stage-03-rider",
        "text": "That's it! The two beside each other make one straight line.",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.88,
    },
    {
        "name": "q2-stage-04-rider",
        "text": "New crossing. Think the same trick still works?",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.86,
    },
    {
        "name": "q2-stage-04-kid",
        "text": "Across matches. Beside makes a line. Got it!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
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
    audio_write(
        str(wav_output),
        result.audio,
        result.sample_rate,
        format="wav",
    )
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
                temperature=0.88,
                top_p=0.95,
                verbose=True,
            )
        )
        if not results:
            raise RuntimeError(f"No audio generated for {line['name']}")
        save_result(line["name"], results[0])
    del model
    gc.collect()


def generate_kid_and_rider() -> None:
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
    generate_kid_and_rider()


if __name__ == "__main__":
    main()
