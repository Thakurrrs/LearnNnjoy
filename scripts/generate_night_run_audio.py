#!/usr/bin/env python3

import argparse
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro


STORY_LINES = (
    {
        "filename": "opening-1-ready.mp3",
        "text": "Tonight, we are trying a two rider glow trick. Each rider follows one straight light trail.",
        "speed": 1.06,
        "pitch": 1.18,
    },
    {
        "filename": "opening-2-rail.mp3",
        "text": "Here they come! Their trails cross and make four openings around the X.",
        "speed": 1.06,
        "pitch": 1.2,
    },
    {
        "filename": "opening-3-tilt.mp3",
        "text": "Wait! Tilt one trail and all four openings change. The mirror trick could miss.",
        "speed": 1.02,
        "pitch": 1.18,
    },
    {
        "filename": "opening-4-help.mp3",
        "text": "The opposite riders need matching openings. Then one rider needs a straight exit. Help me map the trick?",
        "speed": 1.0,
        "pitch": 1.18,
    },
    {
        "filename": "closing-1-lights.mp3",
        "text": "Look! Both riders crossed on matching openings!",
        "speed": 1.07,
        "pitch": 1.2,
    },
    {
        "filename": "closing-2-open.mp3",
        "text": "And the exit stayed straight! We did it. Night Run complete!",
        "speed": 1.06,
        "pitch": 1.22,
    },
)


def blended_voice(kokoro: Kokoro) -> np.ndarray:
    return np.asarray(
        kokoro.get_voice_style("af_heart") * 0.58
        + kokoro.get_voice_style("af_sky") * 0.42,
        dtype=np.float32,
    )


def encode(source: Path, destination: Path, sample_rate: int, pitch: float) -> None:
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
                "loudnorm=I=-18:LRA=6:TP=-1.5,"
                "afade=t=in:st=0:d=0.03,"
                "areverse,afade=t=in:st=0:d=0.08,areverse"
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
    parser = argparse.ArgumentParser(description="Generate Nova’s Night Run story narration.")
    parser.add_argument("--model", required=True, help="Path to the Kokoro ONNX model.")
    parser.add_argument("--voices", required=True, help="Path to the Kokoro voice bundle.")
    parser.add_argument("--output", required=True, help="Directory for generated MP3 files.")
    args = parser.parse_args()

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(args.model, args.voices)
    voice = blended_voice(kokoro)

    for line in STORY_LINES:
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
        encode(source, destination, sample_rate, line["pitch"])
        source.unlink()
        print(destination)


if __name__ == "__main__":
    main()
