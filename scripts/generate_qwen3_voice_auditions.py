"""Generate local Qwen3-TTS voice auditions for LearnNnjoy.

This script is intentionally separate from the web app. It produces static WAV
files that can be reviewed before any voice is selected or integrated.
"""

from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


MODEL_ID = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public/audio/voice-auditions/qwen3"

AUDITIONS = (
    {
        "name": "nova-mischievous",
        "text": "Ooh... should we? Okay, on three. One, two... GO!",
        "instruct": (
            "A tiny energetic magical sidekick with a light youthful voice, "
            "clearly child-friendly and not adult. Sound cheeky and delighted, "
            "as if inviting a best friend into a harmless secret stunt. Let "
            "Ooh sparkle with curiosity, whisper should we conspiratorially, "
            "grin through the count, then burst into a joyful surprised GO. "
            "Use strong emotional variation and lively pitch movement. Natural "
            "acting only, with no announcer or narrator tone."
        ),
    },
    {
        "name": "nova-warm-brave",
        "text": "Ooh... should we? Okay, on three. One, two... GO!",
        "instruct": (
            "A small warm fantasy mascot with a youthful, light, friendly voice. "
            "Sound caring, brave, and excited to try something new with a child. "
            "Begin with genuine wonder, make should we feel like a shared choice, "
            "build suspense through the count, and release it in a delighted GO. "
            "Express emotion through breath, pauses, rhythm, and pitch. Do not "
            "sound like an adult narrator, teacher, advertisement, or presenter."
        ),
    },
    {
        "name": "kid-confident",
        "text": "Try me! But if we cross, I'm going first!",
        "instruct": (
            "A natural eleven-year-old child speaking English with a gentle Indian "
            "accent. Confident, amused, playful, and eager to join a skating game. "
            "The first phrase is a friendly challenge; the second is a joking burst "
            "of courage. Sound spontaneous, like talking to a close friend, not "
            "reading a script. Do not sound babyish or like an adult actor."
        ),
    },
)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    model = load_model(MODEL_ID)

    for audition in AUDITIONS:
        output = OUTPUT_DIR / f"{audition['name']}.wav"
        results = list(
            model.generate_voice_design(
                text=audition["text"],
                language="English",
                instruct=audition["instruct"],
                temperature=0.9,
                top_p=0.95,
                verbose=True,
            )
        )
        if not results:
            raise RuntimeError(f"No audio generated for {audition['name']}")
        result = results[0]
        audio_write(str(output), result.audio, result.sample_rate, format="wav")
        print(
            f"Saved {output.name}: {result.audio_duration}, "
            f"{result.processing_time_seconds:.2f}s generation, "
            f"{result.peak_memory_usage:.2f}GB peak memory"
        )


if __name__ == "__main__":
    main()
