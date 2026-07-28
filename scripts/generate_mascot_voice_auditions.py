#!/usr/bin/env python3

import argparse
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro


AUDITION_LINE = (
    "Hey, explorer! I am Nova. Ooh, did you see that? "
    "The rescue pod zipped right below zero! "
    "Come on, we will find it together. Yes! That was amazing!"
)

MASCOT_AUDITIONS = (
    {
        "filename": "a-mascot-voice.mp3",
        "voices": (("af_heart", 0.58), ("af_sky", 0.42)),
        "speed": 1.04,
        "pitch": 1.18,
    },
    {
        "filename": "b-mascot-voice.mp3",
        "voices": (("af_heart", 0.58), ("af_sky", 0.42)),
        "speed": 1.04,
        "pitch": 1.30,
    },
    {
        "filename": "c-mascot-voice.mp3",
        "voices": (("af_heart", 0.58), ("af_sky", 0.42)),
        "speed": 1.04,
        "pitch": 1.42,
    },
)


def blended_voice(kokoro: Kokoro, voices: tuple[tuple[str, float], ...]) -> np.ndarray:
    styles = [kokoro.get_voice_style(name) * weight for name, weight in voices]
    return np.sum(styles, axis=0, dtype=np.float32)


def encode_mascot_voice(
    source: Path,
    destination: Path,
    sample_rate: int,
    pitch: float,
) -> None:
    filter_chain = (
        f"asetrate={sample_rate}*{pitch},"
        f"aresample={sample_rate},"
        f"atempo={1 / pitch},"
        "loudnorm=I=-18:LRA=7:TP=-1.5"
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-af",
            filter_chain,
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "96k",
            str(destination),
        ],
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate small, friendly Nova mascot-voice auditions."
    )
    parser.add_argument("--model", required=True, help="Path to the Kokoro ONNX model.")
    parser.add_argument("--voices", required=True, help="Path to the Kokoro voice bundle.")
    parser.add_argument("--output", required=True, help="Directory for generated MP3 files.")
    args = parser.parse_args()

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(args.model, args.voices)

    for audition in MASCOT_AUDITIONS:
        destination = output / audition["filename"]
        source = destination.with_suffix(".source.wav")
        audio, sample_rate = kokoro.create(
            AUDITION_LINE,
            voice=blended_voice(kokoro, audition["voices"]),
            speed=audition["speed"],
            lang="en-us",
        )
        peak = float(np.max(np.abs(audio))) or 1.0
        normalized = np.asarray(audio * min(0.94 / peak, 1.0), dtype=np.float32)
        sf.write(source, normalized, sample_rate, subtype="PCM_16")
        encode_mascot_voice(
            source,
            destination,
            sample_rate,
            audition["pitch"],
        )
        source.unlink()
        print(destination)


if __name__ == "__main__":
    main()
