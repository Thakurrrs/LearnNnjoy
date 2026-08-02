"""Generate Nova's Qwen3 dialogue for the Parallel Glide scene audition."""

import subprocess
from pathlib import Path

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model


MODEL_ID = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public/audio/voice-auditions/scene"

VOICE_DIRECTION = (
    "Nova is a tiny fictional star-creature sidekick speaking English to an "
    "eleven-year-old friend during a fast skateboard game. The voice is youthful, "
    "bright, playful, slightly mischievous, and emotionally spontaneous. Speak as "
    "a participant inside the action, never as a narrator, teacher, presenter, or "
    "adult trying to sound friendly. Keep the delivery short and conversational, "
    "with natural reactions and no lesson-explanation cadence."
)

LINES = (
    {
        "name": "qwen-nova-01-race-me",
        "text": "There you are! Race me!",
        "emotion": "Delighted to see a close friend, then instantly playful and competitive.",
    },
    {
        "name": "qwen-nova-03-ready",
        "text": "Stay in your lane. Ready?",
        "emotion": "A cheeky game rule followed by an eager challenge. Smile through ready.",
    },
    {
        "name": "qwen-nova-03-watch",
        "text": "I'll go first. Watch my trail!",
        "emotion": "A confident, playful announcement just before Nova demonstrates the route on a skateboard.",
    },
    {
        "name": "qwen-nova-04-your-turn",
        "text": "Your turn! Follow the stars, or make your own path.",
        "emotion": "An inviting game prompt after Nova has demonstrated the route. Encouraging, free, and playful.",
    },
    {
        "name": "qwen-nova-06-same-gap",
        "text": "Whoa... same gap the whole way!",
        "emotion": "A real discovery noticed while catching breath after skating. Surprise grows into excitement.",
    },
    {
        "name": "qwen-nova-07-parallel",
        "text": "That's parallel!",
        "emotion": "A quick shared victory, not an explanation. Bright and delighted.",
    },
    {
        "name": "qwen-nova-09-clear",
        "text": "Let her clear the line...",
        "emotion": "Quiet, focused safety check while watching the other rider move away.",
    },
    {
        "name": "qwen-nova-10-stay-clear",
        "text": "I'll stay clear. Go for it!",
        "emotion": "Nova has stepped safely aside and gives a friend an excited go-signal.",
    },
    {
        "name": "qwen-nova-11-carve",
        "text": "Now! Carve across it!",
        "emotion": "An excited go-signal shouted to a friend during the trick.",
    },
    {
        "name": "qwen-nova-13-intersect",
        "text": "Yes! Our trails intersect right there!",
        "emotion": "Joyful reaction to the glowing crossing point. Emphasise right there with genuine discovery.",
    },
    {
        "name": "qwen-nova-14-met",
        "text": "There! Your trails met at one point!",
        "emotion": "A delighted reaction to the player's own glowing trail meeting Nova's. Point out the discovery, do not lecture.",
    },
    {
        "name": "qwen-nova-14-no-meet",
        "text": "Cool route! Our trails didn't meet this time.",
        "emotion": "Warm admiration for a different route. Curious and encouraging, never disappointed or corrective.",
    },
    {
        "name": "qwen-angle-01-moved",
        "text": "One pair opens wider—and its opposite still matches!",
        "emotion": "A surprised discovery while watching the child turn one glowing rail. Emphasise opposite with delighted curiosity.",
    },
    {
        "name": "qwen-angle-02-twins",
        "text": "They fit! Those opposite corners are twins.",
        "emotion": "A quick gasp of recognition followed by a joyful shared discovery. This is a reaction, not a definition.",
    },
    {
        "name": "qwen-angle-03-straight",
        "text": "Boom—together they fill one straight line!",
        "emotion": "Playful satisfaction as two light pieces snap together. Make boom energetic but not shouted.",
    },
    {
        "name": "qwen-angle-04-transfer",
        "text": "Same two patterns, even after we turn the crossing!",
        "emotion": "Proud, excited recognition that the child found the pattern again in a new orientation.",
    },
    {
        "name": "qwen-parallel-01-match",
        "text": "Yes! Same direction from end to end. Even if we extend them, they never meet.",
        "emotion": "Relieved excitement after two skateboard rails click into alignment. The discovery feels shared and physical, never teacher-like.",
    },
    {
        "name": "qwen-parallel-02-gap",
        "text": "The gap changed, but both rails still point the same way. They're still parallel!",
        "emotion": "Playful surprise as a friend moves one rail farther away without changing its direction. Lift the energy on still parallel.",
    },
    {
        "name": "qwen-parallel-03-square",
        "text": "Square corner! When straight lines meet at ninety degrees, they're perpendicular.",
        "emotion": "A quick victory reaction when the glowing exit clicks into a perfect square corner. Keep the maths phrase conversational and delighted.",
    },
    {
        "name": "qwen-parallel-04-course",
        "text": "We turned the whole course, and the relationships stayed: parallel rails, perpendicular exit!",
        "emotion": "Proud, energetic finale after the entire skateboard course rotates and both patterns remain visible.",
    },
    {
        "name": "qwen-beam-01-transversal",
        "text": "The beam crossed both parallel rails. One line crossing two others is a transversal.",
        "emotion": "Excited reaction as a moving gold light beam sweeps across both skateboard rails. Keep the new word quick and conversational.",
    },
    {
        "name": "qwen-beam-02-corresponding",
        "text": "Same seat at the next crossing—they match! Those are corresponding angles.",
        "emotion": "Delighted recognition that a friend found the same-position corner at the second crossing. Emphasise same seat playfully.",
    },
    {
        "name": "qwen-beam-03-alternate",
        "text": "You found the inside zigzag! Those matching openings are alternate interior angles.",
        "emotion": "A quick joyful discovery when the two glowing inside corners complete a zigzag shape. Keep the formal name light and friendly.",
    },
    {
        "name": "qwen-beam-04-transfer",
        "text": "New beam, same matches! Parallel rails keep both angle patterns steady.",
        "emotion": "Energetic chapter-finale reaction after the beam changes direction and both angle pairs still match.",
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
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    model = load_model(MODEL_ID)

    for line in LINES:
        wav_output = OUTPUT_DIR / f"{line['name']}.wav"
        mp3_output = OUTPUT_DIR / f"{line['name']}.mp3"
        if mp3_output.exists():
            print(f"Keeping existing {mp3_output.name}")
            continue
        results = list(
            model.generate_voice_design(
                text=line["text"],
                language="English",
                instruct=f"{VOICE_DIRECTION} Situation: {line['emotion']}",
                temperature=0.86,
                top_p=0.95,
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
