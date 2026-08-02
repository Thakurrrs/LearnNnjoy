"""Extend the approved learner and rider voices for the playable skate scene."""

import subprocess
from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


MODEL_ID = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-4bit"
ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public/audio/voice-auditions/scene"

LINES = (
    {
        "name": "rider-08-meet-nova",
        "text": "Think your trail can meet Nova's?",
        "reference_audio": OUTPUT_DIR / "rider-07-crossover.wav",
        "reference_text": "Crossover trick?",
        "temperature": 0.84,
    },
    {
        "name": "kid-09-find-out",
        "text": "Only one way to find out!",
        "reference_audio": OUTPUT_DIR / "kid-09-lets-cross.wav",
        "reference_text": "Let's cross!",
        "temperature": 0.82,
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


def main() -> None:
    model = load_model(MODEL_ID)
    for line in LINES:
        wav_output = OUTPUT_DIR / f"{line['name']}.wav"
        mp3_output = OUTPUT_DIR / f"{line['name']}.mp3"
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

        result = results[0]
        audio_write(
            str(wav_output),
            result.audio,
            result.sample_rate,
            format="wav",
        )
        encode(wav_output, mp3_output)
        print(f"Saved {mp3_output.name}: {result.audio_duration}")


if __name__ == "__main__":
    main()
