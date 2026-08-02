#!/usr/bin/env python3

"""Generate phrase-level Mascot A dialogue for the expressive scene audition."""

import argparse
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro


NOVA_LINES = (
    {
        "filename": "nova-01-made-it.mp3",
        "text": "You made it!",
        "speed": 1.10,
        "pitch": 1.20,
        "gain": 1.6,
    },
    {
        "filename": "nova-03-stay-beside.mp3",
        "text": "Stay beside me. Do not cross... yet!",
        "speed": 0.99,
        "pitch": 1.18,
        "gain": 0.5,
    },
    {
        "filename": "nova-05-gap.mp3",
        "text": "And the gap never changed...",
        "speed": 0.92,
        "pitch": 1.16,
        "gain": -1.0,
    },
    {
        "filename": "nova-06-parallel.mp3",
        "text": "Parallel. Nice!",
        "speed": 1.08,
        "pitch": 1.20,
        "gain": 1.2,
    },
    {
        "filename": "nova-08-should-we.mp3",
        "text": "Ooh... should we?",
        "speed": 0.90,
        "pitch": 1.19,
        "gain": -0.4,
    },
    {
        "filename": "nova-10-count.mp3",
        "text": "Okay, on three! One... two... GO!",
        "speed": 1.02,
        "pitch": 1.21,
        "gain": 1.8,
    },
)


def blended_voice(kokoro: Kokoro) -> np.ndarray:
    return np.asarray(
        kokoro.get_voice_style("af_heart") * 0.58
        + kokoro.get_voice_style("af_sky") * 0.42,
        dtype=np.float32,
    )


def encode(
    source: Path,
    destination: Path,
    sample_rate: int,
    pitch: float,
    gain: float,
) -> None:
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
                f"asetrate={sample_rate}*{pitch},"
                f"aresample={sample_rate},"
                f"atempo={1 / pitch},"
                "highpass=f=90,"
                f"volume={gain}dB,"
                "loudnorm=I=-18:LRA=6:TP=-1.5,"
                "afade=t=in:st=0:d=0.025,"
                "areverse,afade=t=in:st=0:d=0.07,areverse"
            ),
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "96k",
            str(destination),
        ],
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate expressive Mascot A scene dialogue.")
    parser.add_argument("--model", required=True)
    parser.add_argument("--voices", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(args.model, args.voices)
    voice = blended_voice(kokoro)

    for line in NOVA_LINES:
        destination = output / line["filename"]
        source = destination.with_suffix(".source.wav")
        audio, sample_rate = kokoro.create(
            line["text"],
            voice=voice,
            speed=line["speed"],
            lang="en-us",
        )
        peak = float(np.max(np.abs(audio))) or 1.0
        normalized = np.asarray(audio * min(0.94 / peak, 1.0), dtype=np.float32)
        sf.write(source, normalized, sample_rate, subtype="PCM_16")
        encode(
            source,
            destination,
            sample_rate,
            line["pitch"],
            line["gain"],
        )
        source.unlink()
        print(destination)


if __name__ == "__main__":
    main()
