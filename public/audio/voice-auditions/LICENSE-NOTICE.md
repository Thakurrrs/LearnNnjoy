# Voice audition provenance

These are original LearnNnjoy voice auditions generated locally. They do not
clone or reproduce an anime performer.

- Kokoro-82M model weights: Apache License 2.0
- `kokoro-onnx` inference library: MIT License
- Chatterbox inference library and model: MIT License
- Qwen3-TTS model and reference implementation: Apache License 2.0
- `mlx-audio` Apple-Silicon inference library: MIT License

The four files under `emotion/` use the same original Kokoro audition as a
reference voice and Chatterbox's expressive-generation controls to perform
four story situations. On macOS arm64, local generation uses Chatterbox's
package-provided dummy watermark fallback because the Perth neural watermarker
is unavailable. The preview page explicitly identifies the clips as
AI-generated.

The three files under `mascot/` use one original Kokoro voice-style blend with
three pitch levels. They use the same script and timing so the audition isolates
the perceived size of the mascot voice rather than comparing different writing
or performers. They target a general friendly creature-companion quality and
do not imitate a named character or performer.

The audition files are temporary product-development assets. Keep the selected
voice direction and remove rejected auditions after approval.

The files under `qwen3/` were generated locally from
`mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit`. Q1–Q3 are three original
Nova voice designs performing the same emotionally varied line. K1 is an
original learner-character reply. None uses voice cloning or a reference
performer.

H1–H3 were generated locally from
`mlx-community/Qwen3-TTS-12Hz-1.7B-Base-4bit`, using the original synthetic
Mascot A audition and its exact transcript as the cloning reference. They do
not use a human voice or named performer.

The files under `public/audio/night-run/` use the selected mascot A blend and
the same local Kokoro/FFmpeg pipeline. They are pre-generated story narration;
no speech model or API request runs on a child’s device.

The scene audition files under `scene/` combine two local pipelines. Nova's
phrase-level clips use the selected Mascot A Kokoro blend with small
line-specific timing and pitch adjustments. The learner and second rider are
original Qwen3-TTS VoiceDesign voices. No human or named character voice is
cloned. All clips are pre-generated; no speech model runs in the browser.

The `qwen-nova-*`, `qwen-angle-*`, `qwen-parallel-*`, and `qwen-beam-*` scene files are later
all-Qwen Nova performance tests, generated locally with the same Apache-2.0
Qwen3-TTS VoiceDesign model. They
use an original fictional star-sidekick direction and do not imitate or clone
any human or named character voice.

The files under `public/audio/skatepark-story/` form the original
three-character Crossing Rails, Rails That Never Meet, and Crossing Beam
scenes. Nova uses the same Qwen3-TTS VoiceDesign model and original fictional
star-sidekick direction. The learner and rider use the Apache-2.0 Qwen3-TTS
Base model with earlier original synthetic learner and rider clips as voice
references. No human recording, named character, or performer is cloned. All
clips are generated locally and shipped as static assets; no speech model runs
in the browser.

`kid-09-find-out.mp3` and `rider-08-meet-nova.mp3` use the Apache-2.0 Qwen3-TTS
Base model with earlier original synthetic learner and rider voices as
references. They do not use a human voice or named performer. The skateboard
character cutouts and guide-star marker under `public/images/skatepark-night-run/`
are original LearnNnjoy assets generated for this product preview.

The files under `public/audio/mountain-rescue/` form the original four-quest
Mountain Rescue chapter: Signal Below Zero, Cliff Checkpoints, Storm Moves,
and Rescue Winch. Nova uses the same Qwen3-TTS VoiceDesign model and fictional
star-sidekick direction. The learner and mountain scout use the Qwen3-TTS Base
model with the earlier original synthetic learner and rider clips as voice
references. No human recording, named character, or performer is cloned. The
rescue pod under `public/images/mountain-rescue/` is an original LearnNnjoy
illustration generated for this interactive story and locally converted to a
transparent game asset.
