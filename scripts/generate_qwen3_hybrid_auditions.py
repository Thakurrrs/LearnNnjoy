"""Clone Mascot A with Qwen3-TTS and audition more expressive delivery."""

from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


MODEL_ID = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-4bit"
ROOT = Path(__file__).resolve().parents[1]
REFERENCE_AUDIO = ROOT / "public/audio/voice-auditions/mascot/a-mascot-voice.mp3"
OUTPUT_DIR = ROOT / "public/audio/voice-auditions/qwen3"
REFERENCE_TEXT = (
    "Hey, explorer! I am Nova. Ooh, did you see that? "
    "The rescue pod zipped right below zero! "
    "Come on, we will find it together. Yes! That was amazing!"
)

HYBRID_AUDITIONS = (
    {
        "name": "hybrid-playful",
        "text": "Ooh! Should we? Okay—on three. One... two... GO!",
        "temperature": 0.85,
    },
    {
        "name": "hybrid-mischievous",
        "text": "Ooh... should we? Okay. On three... one... two... GO!",
        "temperature": 0.95,
    },
    {
        "name": "hybrid-warm",
        "text": "Ooh! Should we? Okay, together. One... two... GO!",
        "temperature": 0.75,
    },
)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    model = load_model(MODEL_ID)

    for audition in HYBRID_AUDITIONS:
        output = OUTPUT_DIR / f"{audition['name']}.wav"
        results = list(
            model.generate(
                text=audition["text"],
                lang_code="English",
                ref_audio=str(REFERENCE_AUDIO),
                ref_text=REFERENCE_TEXT,
                temperature=audition["temperature"],
                top_p=0.95,
                repetition_penalty=1.5,
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
