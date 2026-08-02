"""Generate the three-character Crossing Beam story with local Qwen3-TTS."""

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
    "eleven-year-old friend during a fast skateboard light show. The voice is "
    "youthful, bright, playful, slightly mischievous, and emotionally spontaneous. "
    "Nova is inside the action and talking to friends, never narrating, teaching, "
    "presenting, or sounding like an adult trying to be friendly."
)

NOVA_LINES = (
    {
        "name": "q4-opening-02-nova",
        "text": "It has to sweep across both twin rails.",
        "emotion": "Focus on a stuck spotlight and quickly work out what the finale needs. Curious urgency, not explanation.",
    },
    {
        "name": "q4-opening-05-nova",
        "text": "Let's test it before the finale!",
        "emotion": "Invite two close friends into one last playful experiment. Eager and a little mischievous.",
    },
    {
        "name": "q4-closing-03-nova",
        "text": "The beam moved, but both patterns stayed!",
        "emotion": "Burst with delighted surprise when the final light-show pattern survives the moving beam.",
    },
    {
        "name": "q4-stage-02-nova",
        "text": "Tap one corner, then the same seat at the next crossing.",
        "emotion": "Give a short teammate clue during a timed light game. Playful focus, never lesson cadence.",
    },
    {
        "name": "q4-stage-03-nova",
        "text": "The inside pair matches too!",
        "emotion": "React with quick joyful recognition when a friend completes the glowing zigzag.",
    },
    {
        "name": "q4-stage-01-launch-nova",
        "text": "Lights on—ride the two rails!",
        "emotion": "Launch a fast two-lane skateboard light test with close friends. Bright, daring, and already inside the action.",
    },
)

CLONED_LINES = (
    {
        "name": "q4-opening-01-rider",
        "text": "One last show—the gold spotlight is stuck!",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q4-opening-03-kid",
        "text": "Then every crossing gets a light corner.",
        "speaker": "kid",
        "temperature": 0.84,
    },
    {
        "name": "q4-opening-04-rider",
        "text": "Can we copy the same move at both crossings?",
        "speaker": "rider",
        "temperature": 0.86,
    },
    {
        "name": "q4-closing-01-rider",
        "text": "Both crossings lit!",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q4-closing-02-kid",
        "text": "Same-seat match and inside zigzag.",
        "speaker": "kid",
        "temperature": 0.86,
    },
    {
        "name": "q4-closing-04-rider",
        "text": "Night Run complete!",
        "speaker": "rider",
        "temperature": 0.92,
    },
    {
        "name": "q4-stage-01-rider",
        "text": "Turn the gold beam until it cuts across both rails.",
        "speaker": "rider",
        "temperature": 0.86,
    },
    {
        "name": "q4-stage-01-kid",
        "text": "It crossed both—two meeting points!",
        "speaker": "kid",
        "temperature": 0.9,
    },
    {
        "name": "q4-stage-02-rider",
        "text": "Same seat, same opening!",
        "speaker": "rider",
        "temperature": 0.9,
    },
    {
        "name": "q4-stage-03-kid",
        "text": "Now I'll trace the inside zigzag.",
        "speaker": "kid",
        "temperature": 0.84,
    },
    {
        "name": "q4-stage-04-rider",
        "text": "Sweep the beam. Do both patterns survive?",
        "speaker": "rider",
        "temperature": 0.88,
    },
    {
        "name": "q4-stage-04-launch-rider",
        "text": "Sweep the beam—keep rolling!",
        "speaker": "rider",
        "temperature": 0.92,
    },
    {
        "name": "q4-stage-04-kid",
        "text": "They stayed—the whole light show works!",
        "speaker": "kid",
        "temperature": 0.9,
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
