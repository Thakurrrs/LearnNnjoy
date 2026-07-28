#!/usr/bin/env python3

import argparse
from pathlib import Path

import perth
import torch
import torchaudio

if perth.PerthImplicitWatermarker is None:
    # The neural Perth watermarker does not currently load on macOS arm64.
    # Its package-provided dummy keeps local audition generation compatible;
    # the preview page still labels every clip as AI-generated.
    perth.PerthImplicitWatermarker = perth.DummyWatermarker

from chatterbox.tts import ChatterboxTTS


EMOTION_AUDITIONS = (
    {
        "filename": "a-danger-alert.wav",
        "seed": 17,
        "exaggeration": 0.9,
        "cfg_weight": 0.3,
        "temperature": 0.86,
        "text": "Whoa! The pod is falling! Grab the controls before it disappears below base camp!",
    },
    {
        "filename": "b-calm-reassurance.wav",
        "seed": 29,
        "exaggeration": 0.42,
        "cfg_weight": 0.42,
        "temperature": 0.72,
        "text": "Hey, it is okay. Take a breath. We will follow the number trail together, one level at a time.",
    },
    {
        "filename": "c-gentle-correction.wav",
        "seed": 41,
        "exaggeration": 0.58,
        "cfg_weight": 0.36,
        "temperature": 0.76,
        "text": "Almost! Look again at the gold zero line. Is minus four above it... or below it?",
    },
    {
        "filename": "d-big-celebration.wav",
        "seed": 53,
        "exaggeration": 0.96,
        "cfg_weight": 0.28,
        "temperature": 0.88,
        "text": "Yes! You found it! Minus four! The signal is safe, and the rescue is complete!",
    },
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Nova emotion-performance auditions.")
    parser.add_argument("--reference", required=True, help="Original licensed reference voice clip.")
    parser.add_argument("--output", required=True, help="Directory for generated WAV files.")
    args = parser.parse_args()

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    model = ChatterboxTTS.from_pretrained(device="cpu")

    for audition in EMOTION_AUDITIONS:
        torch.manual_seed(audition["seed"])
        audio = model.generate(
            audition["text"],
            audio_prompt_path=args.reference,
            exaggeration=audition["exaggeration"],
            cfg_weight=audition["cfg_weight"],
            temperature=audition["temperature"],
        )
        path = output / audition["filename"]
        torchaudio.save(path, audio.cpu(), model.sr)
        print(path)


if __name__ == "__main__":
    main()
