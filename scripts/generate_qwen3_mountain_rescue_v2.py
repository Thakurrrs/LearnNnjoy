# Requires: uv venv ~/.venvs/learnnjoy-tts && uv pip install --python ~/.venvs/learnnjoy-tts/bin/python mlx-audio
"""Regenerate the Mountain Rescue quest 1, 3, 4, and finale dialogue with
local Qwen3-TTS.

This supersedes the lines in generate_qwen3_mountain_signal_story.py: several
of those files now hold outdated copy (Q1 secure-language rewrite, Q3 hook
story, Q4 lower-then-lift, the new 5-beat finale). Unlike that script, this
one always overwrites -- it has no "keep existing file" skip -- because the
whole point is that the on-disk recordings are stale.

Only lines whose current component text changed (or that were missing
outright) are listed here. q2-* and q4-opening-01/02/03 are untouched by
Tasks 1-5 and are intentionally left out.
"""

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
    # Quest 1 -- Chase the Lost Signal
    {
        "name": "q1-opening-01-nova",
        "text": "Pip! The ribbon goes on the shelter—not your tail!",
        "emotion": "Catch a tiny pet mid-mischief and laugh through a quick, affectionate correction — warm and playful, not scolding.",
    },
    {
        "name": "q1-opening-04-nova",
        "text": "Hang on, Pip. We’ll get the warmth back.",
        "emotion": "Comfort a shivering small creature with soft, certain reassurance — protective and warm, never worried-sounding.",
    },
    {
        "name": "q1-opening-08-nova",
        "text": "You steer the rescue sled. I’ll watch the signal!",
        "emotion": "Hand off a role to a close friend with confident, upbeat teamwork energy — like starting a shared mission, not issuing instructions.",
    },
    {
        "name": "q1-latch-nova",
        "text": "The pod crossed Base Camp and vanished below it. Pull the safety latch—we’re going after it.",
        "emotion": "Deliver urgent news and a brave next step in one breath — determined and steady, reassuring the friend it's safe to go.",
    },
    {
        "name": "q1-signal-nova",
        "text": "Stay with it. Pull the pod down toward base camp.",
        "emotion": "Coach a friend through a live search with calm, focused encouragement — present and steady, not anxious.",
    },
    {
        "name": "q1-found-nova",
        "text": "Found it—four levels below zero!",
        "emotion": "Burst out with a genuine discovery during an active search — bright relief and excitement, shared in the moment.",
    },
    {
        "name": "q1-brush-nova",
        "text": "The signal is under this drift. Brush the snow away.",
        "emotion": "Point out a hidden discovery with gentle, curious excitement — inviting a friend to dig in together.",
    },
    {
        "name": "q1-strap-nova",
        "text": "There it is! Pull the rescue strap with us.",
        "emotion": "Spot the goal and invite a shared effort — eager and warm, never bossy.",
    },
    {
        "name": "q1-reveal-nova",
        "text": "Positions above zero are positive. Positions below zero are negative. Zero is the reference point between them.",
        "emotion": "Share a just-noticed pattern with delighted clarity, like pointing at a map with a friend — never a lecture.",
    },
    {
        "name": "q1-flag-nova",
        "text": "Tap Ridge Shelter at plus two and the secured pod at minus four.",
        "emotion": "Give a quick, upbeat pointer to two spots on a shared map — playful teammate energy, not an instruction manual.",
    },
    # Quest 3 -- Storm Moves
    {
        "name": "q3-opening-02-nova",
        "text": "Every gust swings it up or down. Track each move with me.",
        "emotion": "Speak fast over a sudden gust of wind, steady and encouraging — urgent but never scary, inviting a friend to team up.",
    },
    {
        "name": "q3-stage-01-nova",
        "text": "We rode every gust. The hook finished at plus one.",
        "emotion": "Catch your breath after a wild ride and recap it with proud, breathless satisfaction — shared triumph, not a report.",
    },
    {
        "name": "q3-stage-03-nova",
        "text": "Adding a positive move swings the hook up. Adding a negative move swings it down.",
        "emotion": "Connect what just happened to a newly spotted rule with bright, conspiratorial delight — never teacherly.",
    },
    # Quest 4 -- Rescue Winch
    {
        "name": "q4-lift-nova",
        "text": "Plus two! The climb undid the whole fall—six levels up.",
        "emotion": "Cheer as the pod rises to safety after a hard drop — triumphant relief bursting into joy, shared with a friend.",
    },
    {
        "name": "q4-stage-03-nova",
        "text": "Down six and up six are inverse moves—they undo each other.",
        "emotion": "Notice a satisfying pattern right after seeing it happen — warm wonder and a crisp, playful finish, not a rule recital.",
    },
    # Finale
    {
        "name": "finale-02-nova",
        "text": "Look—the windows are warming. Pip found the cosy corner.",
        "emotion": "Notice small warm details in a newly powered shelter with soft delight — like pointing something sweet out to a close friend.",
    },
    {
        "name": "finale-04-nova",
        "text": "One postcard for your journal. Tomorrow, a new star starts glowing.",
        "emotion": "Wrap up a shared adventure with warm satisfaction, then add a light, teasing hint about tomorrow — playful, never a narrator's sign-off.",
    },
)

CLONED_LINES = (
    # Quest 1 -- Chase the Lost Signal
    {
        "name": "q1-opening-02-kid",
        "text": "He thinks he is the decoration.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.86,
    },
    {
        "name": "q1-opening-03-scout",
        "text": "The storm drained our energy cell. The shelter is getting cold.",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.88,
    },
    {
        "name": "q1-opening-05-scout",
        "text": "Replacement cell launching from the Service Deck!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.92,
    },
    {
        "name": "q1-opening-06-kid",
        "text": "The pod went past us—and past Base Camp!",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q1-opening-07-scout",
        "text": "The cell is safe, but its signal is fading in the ravine.",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.88,
    },
    {
        "name": "q1-zero-kid",
        "text": "That gold line is zero—our halfway marker.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q1-recovered-kid",
        "text": "We secured the cell right here. Now look at where every part of the search happened.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.86,
    },
    # Quest 3 -- Storm Moves
    {
        "name": "q3-opening-01-scout",
        "text": "Wind burst incoming! The winch hook is swinging loose!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.92,
    },
    {
        "name": "q3-opening-03-kid",
        "text": "Call the gusts. I’ll follow the hook.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q3-stage-02-kid",
        "text": "New storm, same idea—the final position changed with every move.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.88,
    },
    {
        "name": "q3-stage-04-scout",
        "text": "The whole storm route is now one movement story.",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.88,
    },
    # Quest 4 -- Rescue Winch
    {
        "name": "q4-lower-kid",
        "text": "Hooked on! Six levels below the ledge.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.9,
    },
    {
        "name": "q4-stage-04-scout",
        "text": "Every route is secure. Bring the cell home!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    # Finale
    {
        "name": "finale-00-scout",
        "text": "The dock is open. Bring the cell home!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.9,
    },
    {
        "name": "finale-01-scout",
        "text": "Cell docked! Power is back at Ridge Shelter!",
        "reference_audio": SCENE_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.92,
    },
    {
        "name": "finale-03-kid",
        "text": "And the sky… the aurora came to watch.",
        "reference_audio": SCENE_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.84,
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
