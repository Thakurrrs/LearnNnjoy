"""Generate the Signal Below Zero character dialogue with local Qwen3-TTS."""

import gc
import subprocess
from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public/audio/mountain-rescue"
SCENE_DIR = ROOT / "public/audio/voice-auditions/scene"
VOICE_DESIGN_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit"
BASE_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-4bit"

NOVA_DIRECTION = (
    "Nova is a tiny fictional star-creature sidekick speaking English to an "
    "eleven-year-old friend during an urgent mountain rescue game. The voice is "
    "youthful, bright, playful, emotionally spontaneous, and reassuring without "
    "sounding like an adult, narrator, teacher, or presenter. Nova is moving "
    "inside the scene with a close friend and reacts to what they can both see."
)

NOVA_LINES = (
    {
        "name": "q1-opening-02-nova",
        "text": "It was at plus three. Let's follow it before the storm hides it.",
        "emotion": "React quickly to a worrying signal loss, then turn it into a brave shared plan. Urgent but never frightening.",
    },
    {
        "name": "q1-stage-01-nova",
        "text": "The pod was above base camp. Where do you think its lost signal went?",
        "emotion": "Ask a genuine curious guess while looking down a mountain. Invite an idea; do not quiz or judge.",
    },
    {
        "name": "q1-stage-02-zero-nova",
        "text": "That gold line is zero—our halfway marker!",
        "emotion": "Call out an important landmark during fast movement, with a small burst of discovery and relief.",
    },
    {
        "name": "q1-stage-03-nova",
        "text": "Above zero is positive. Base camp is zero. Below zero is negative.",
        "emotion": "Share a just-discovered pattern with a close friend. Sound delighted and clear, not instructional.",
    },
    {
        "name": "q1-stage-04-nova",
        "text": "Plus three, through zero, to minus four. We tracked the whole fall!",
        "emotion": "Replay a successful rescue route with rhythmic excitement, then celebrate the shared win.",
    },
    {
        "name": "q2-opening-02-nova",
        "text": "Then the rescue team could climb the wrong way. Let's rebuild the route.",
        "emotion": "Recognize the danger, think fast, and invite a close friend into a confident rescue plan.",
    },
    {
        "name": "q2-stage-01-nova",
        "text": "Ridge Camp is higher on the cliff, so plus two is greater than minus three.",
        "emotion": "React to the pod visibly reaching the higher camp. Share the discovered comparison with bright satisfaction, not a lesson voice.",
    },
    {
        "name": "q2-stage-03-nova",
        "text": "On a vertical number path, higher numbers are greater and lower numbers are smaller.",
        "emotion": "Name the pattern that the two friends just used. Keep a warm, conspiratorial sense of discovery.",
    },
    {
        "name": "q3-opening-02-nova",
        "text": "Every gust moves it up or down. Stay with me and track each move.",
        "emotion": "Speak over a sudden storm with alert energy. Reassure the friend that the two of you can handle it together.",
    },
    {
        "name": "q3-stage-01-nova",
        "text": "Pod moved again—keep the running position!",
        "emotion": "Call out a live movement during an active storm game. Quick, focused, and encouraging.",
    },
    {
        "name": "q3-stage-03-nova",
        "text": "Adding a positive move sends the pod up. Adding a negative move sends it down.",
        "emotion": "Connect the visible gust movements to a newly discovered rule. Sound excited by the pattern, never teacherly.",
    },
    {
        "name": "q4-opening-02-nova",
        "text": "The safe ledge is at plus two. Our winch can reverse the whole fall.",
        "emotion": "Spot the rescue solution after a tense search. Sound relieved, inventive, and eager to act.",
    },
    {
        "name": "q4-stage-02-nova",
        "text": "The route reversed perfectly. Down six returned us to minus four.",
        "emotion": "React with delighted surprise when the reverse route lands exactly at the starting point.",
    },
    {
        "name": "q4-stage-03-nova",
        "text": "Adding six and subtracting six are inverse moves—they undo each other.",
        "emotion": "Share the name of the pattern only after seeing it work. Friendly wonder and a crisp, memorable finish.",
    },
)

CLONED_LINES = (
    {
        "name": "q1-opening-01-scout",
        "text": "Nova! The rescue pod's signal just dropped!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q1-opening-03-kid",
        "text": "I'll track it past base camp.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.86,
    },
    {
        "name": "q1-stage-02-found-kid",
        "text": "Found it—four levels below zero!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q2-opening-01-scout",
        "text": "Four checkpoint lights are blinking out of order!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q2-opening-03-kid",
        "text": "I'll read their height on the cliff.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.86,
    },
    {
        "name": "q2-stage-02-kid",
        "text": "Route rebuilt—valley to summit, without one backward climb!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q2-stage-04-scout",
        "text": "Checkpoint route clear—from minus five up to plus six!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q3-opening-01-scout",
        "text": "Wind burst incoming! The pod is drifting!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.92,
    },
    {
        "name": "q3-opening-03-kid",
        "text": "Call the gusts. I'll follow the pod.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q3-stage-02-kid",
        "text": "New storm, same idea. I'm tracking every move.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q3-stage-04-scout",
        "text": "Storm route confirmed. The pod finished at plus one!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q4-opening-01-scout",
        "text": "Signal found—but the pod is still trapped at minus four!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "q4-opening-03-kid",
        "text": "Hook it on. I'll bring the pod home.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q4-stage-01-kid",
        "text": "Safe ledge reached—six levels up from minus four!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q4-stage-04-scout",
        "text": "Every route is secure. Mountain Rescue complete!",
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
