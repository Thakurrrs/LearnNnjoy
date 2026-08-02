"""Generate the three-character Rails That Never Meet story with local Qwen3-TTS."""

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
        "name": "q3-opening-02-nova",
        "text": "Uh-oh—the pink rail is leaning toward mine.",
        "emotion": "Spot a real course problem mid-game. Start with a quick worried reaction, then focus on the leaning rail.",
    },
    {
        "name": "q3-opening-05-nova",
        "text": "Then we ride side by side. Let's roll!",
        "emotion": "The plan has clicked. Sound relieved, playful, and eager to launch with friends.",
    },
    {
        "name": "q3-closing-03-nova",
        "text": "Parallel together. Perpendicular at the exit!",
        "emotion": "Celebrate two patterns the group just made during the run. Quick, proud, and delighted, never instructional.",
    },
    {
        "name": "q3-stage-02-nova",
        "text": "Obstacle ahead! Slide your rail farther—but don't turn it.",
        "emotion": "Call out a sudden game obstacle, then give a short teammate instruction with focused energy.",
    },
    {
        "name": "q3-stage-03-nova",
        "text": "Click! A perfect ninety-degree corner.",
        "emotion": "React to a glowing course piece snapping into place. Click is playful satisfaction; the rest is shared discovery.",
    },
    {
        "name": "q3-stage-01-launch-nova",
        "text": "Twin lanes—go!",
        "emotion": "Shout a tiny, joyful skateboard launch cue to a close friend. Quick, daring, and already in motion.",
    },
    {
        "name": "q3-stage-04-launch-nova",
        "text": "Final course—let it roll!",
        "emotion": "Launch the last skateboard run with playful confidence and real excitement. This is a teammate’s call, not narration.",
    },
)

CLONED_LINES = (
    {
        "name": "q3-opening-01-rider",
        "text": "Nova! The twin-lane light show starts now!",
        "speaker": "rider",
        "temperature": 0.88,
    },
    {
        "name": "q3-opening-03-kid",
        "text": "If it keeps going, your trails will meet.",
        "speaker": "kid",
        "temperature": 0.82,
    },
    {
        "name": "q3-opening-04-rider",
        "text": "Can you straighten it before we launch?",
        "speaker": "rider",
        "temperature": 0.86,
    },
    {
        "name": "q3-closing-01-rider",
        "text": "Twin lanes clear!",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q3-closing-02-kid",
        "text": "And the square exit still meets them perfectly.",
        "speaker": "kid",
        "temperature": 0.84,
    },
    {
        "name": "q3-closing-04-rider",
        "text": "Course four is waiting!",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q3-stage-01-rider",
        "text": "The pink rail is leaning into Nova's lane. Turn it until both point the same way.",
        "speaker": "rider",
        "temperature": 0.84,
    },
    {
        "name": "q3-stage-01-kid",
        "text": "Now the gap stays equal all the way!",
        "speaker": "kid",
        "temperature": 0.88,
    },
    {
        "name": "q3-stage-02-rider",
        "text": "Nice! New gap, same direction.",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q3-stage-02-launch-rider",
        "text": "New gap. Same direction. Run it again!",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q3-stage-03-kid",
        "text": "We need an exit that meets the rail like a square corner.",
        "speaker": "kid",
        "temperature": 0.82,
    },
    {
        "name": "q3-stage-04-rider",
        "text": "Turn the whole rooftop course. Do the relationships stay?",
        "speaker": "rider",
        "temperature": 0.86,
    },
    {
        "name": "q3-stage-03-launch-rider",
        "text": "Blue rail first. Square exit after!",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q3-stage-04-kid",
        "text": "They stayed! Parallel lanes, square exit.",
        "speaker": "kid",
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
    references = {
        "kid": {
            "audio": SCENE_DIR / "kid-09-lets-cross.wav",
            "text": "Let's cross!",
        },
        "rider": {
            "audio": SCENE_DIR / "rider-07-crossover.wav",
            "text": "Crossover trick?",
        },
    }
    for line in CLONED_LINES:
        output = OUTPUT_DIR / f"{line['name']}.mp3"
        if output.exists():
            print(f"Keeping existing {output.name}")
            continue
        reference = references[line["speaker"]]
        results = list(
            model.generate(
                text=line["text"],
                lang_code="English",
                ref_audio=str(reference["audio"]),
                ref_text=reference["text"],
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
