#!/usr/bin/env python3

import argparse
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro


NOVA_SAMPLE = (
    "Whoa, hold on, explorer! The rescue pod just crossed zero, and the signal is blinking at minus four. "
    "Breathe. We can follow the number trail together. "
    "Yes! You found it! That was brilliant!"
)

CONTROL_SAMPLE = (
    "Rescue Control to explorer. Beacon confirmed at minus four. "
    "Nova, guide the pod upward six levels to the safe ledge. "
    "Steady now. You have this."
)

AUDITIONS = (
    {
        "filename": "a-playful-spark.wav",
        "voices": (("af_nova", 0.68), ("af_sky", 0.32)),
        "speed": 1.06,
        "text": NOVA_SAMPLE,
    },
    {
        "filename": "b-warm-companion.wav",
        "voices": (("af_heart", 0.72), ("bf_lily", 0.28)),
        "speed": 0.98,
        "text": NOVA_SAMPLE,
    },
    {
        "filename": "c-mischievous-guide.wav",
        "voices": (("af_bella", 0.65), ("af_nova", 0.35)),
        "speed": 1.04,
        "text": NOVA_SAMPLE,
    },
    {
        "filename": "d-rescue-control.wav",
        "voices": (("bm_fable", 0.7), ("am_michael", 0.3)),
        "speed": 0.94,
        "text": CONTROL_SAMPLE,
    },
)


def blended_voice(kokoro: Kokoro, voices: tuple[tuple[str, float], ...]) -> np.ndarray:
    styles = [kokoro.get_voice_style(name) * weight for name, weight in voices]
    return np.sum(styles, axis=0, dtype=np.float32)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate original LearnNnjoy voice auditions.")
    parser.add_argument("--model", required=True, help="Path to the Kokoro ONNX model.")
    parser.add_argument("--voices", required=True, help="Path to the Kokoro voice-style bundle.")
    parser.add_argument("--output", required=True, help="Directory for generated WAV files.")
    args = parser.parse_args()

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(args.model, args.voices)

    for audition in AUDITIONS:
        audio, sample_rate = kokoro.create(
            audition["text"],
            voice=blended_voice(kokoro, audition["voices"]),
            speed=audition["speed"],
            lang="en-us",
        )
        peak = float(np.max(np.abs(audio))) or 1.0
        normalized = np.asarray(audio * min(0.94 / peak, 1.0), dtype=np.float32)
        path = output / audition["filename"]
        sf.write(path, normalized, sample_rate, subtype="PCM_16")
        print(path)


if __name__ == "__main__":
    main()
