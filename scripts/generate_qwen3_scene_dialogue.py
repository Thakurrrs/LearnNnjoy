"""Generate child and rider dialogue for the expressive scene audition."""

from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


MODEL_ID = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public/audio/voice-auditions/scene"

LINES = (
    {
        "name": "kid-02-try-me",
        "text": "Try me!",
        "instruct": (
            "A natural eleven-year-old child speaking English with a gentle Indian "
            "accent. This is a playful, confident challenge to a close friend while "
            "joining a skating game. Bright, spontaneous, and brief. Do not sound "
            "babyish, theatrical, instructional, or like an adult actor."
        ),
    },
    {
        "name": "kid-04-never-touched",
        "text": "Our trails never touched!",
        "instruct": (
            "The same natural eleven-year-old child, speaking English with a gentle "
            "Indian accent. Sound genuinely surprised and pleased after discovering "
            "something during a fast skating game. Let never carry the delighted "
            "surprise. Do not explain or narrate."
        ),
    },
    {
        "name": "rider-07-crossover",
        "text": "Crossover trick?",
        "instruct": (
            "A lively twelve-year-old skater calling to two friends from nearby. "
            "Youthful, daring, casual, and slightly teasing. Ask the question like "
            "a fun challenge, not a lesson or announcement."
        ),
    },
    {
        "name": "kid-09-lets-cross",
        "text": "Let's cross!",
        "instruct": (
            "The same natural eleven-year-old child with a gentle Indian English "
            "accent. A quick excited decision shouted while skating with friends. "
            "Confident and joyful, not babyish and not like an adult actor."
        ),
    },
)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    model = load_model(MODEL_ID)
    for line in LINES:
        output = OUTPUT_DIR / f"{line['name']}.wav"
        results = list(
            model.generate_voice_design(
                text=line["text"],
                language="English",
                instruct=line["instruct"],
                temperature=0.88,
                top_p=0.95,
                verbose=True,
            )
        )
        if not results:
            raise RuntimeError(f"No audio generated for {line['name']}")
        result = results[0]
        audio_write(str(output), result.audio, result.sample_rate, format="wav")
        print(f"Saved {output.name}: {result.audio_duration}")


if __name__ == "__main__":
    main()
