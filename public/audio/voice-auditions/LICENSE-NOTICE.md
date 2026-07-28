# Voice audition provenance

These are original LearnNnjoy voice auditions generated locally. They do not
clone or reproduce an anime performer.

- Kokoro-82M model weights: Apache License 2.0
- `kokoro-onnx` inference library: MIT License
- Chatterbox inference library and model: MIT License

The four files under `emotion/` use the same original Kokoro audition as a
reference voice and Chatterbox's expressive-generation controls to perform
four story situations. On macOS arm64, local generation uses Chatterbox's
package-provided dummy watermark fallback because the Perth neural watermarker
is unavailable. The preview page explicitly identifies the clips as
AI-generated.

The audition files are temporary product-development assets. Keep the selected
voice direction and remove rejected auditions after approval.
