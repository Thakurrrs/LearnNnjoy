"use client";

import { useEffect, useRef, useState } from "react";

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.0/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export function supportsHandControl(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof window !== "undefined" && window.innerWidth >= 1024;
}

export function HandAngleControl({ onAngle, onClose }: { onAngle: (deg: number) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "tracking" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    let frame = 0;

    async function start() {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const files = await vision.FilesetResolver.forVisionTasks(WASM_BASE);
        const landmarker = await vision.HandLandmarker.createFromOptions(files, {
          baseOptions: { modelAssetPath: MODEL_URL },
          numHands: 1,
          runningMode: "VIDEO",
        });
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("tracking");
        const loop = () => {
          if (cancelled || !videoRef.current) return;
          const result = landmarker.detectForVideo(videoRef.current, performance.now());
          const hand = result.landmarks?.[0];
          if (hand) {
            const wrist = hand[0];
            const indexTip = hand[8];
            const rad = Math.atan2(wrist.y - indexTip.y, indexTip.x - wrist.x);
            const deg = Math.max(0, Math.min(120, Math.round(((rad * 180) / Math.PI) / 10) * 10));
            onAngle(deg);
          }
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onAngle]);

  return (
    <div className="hand-control" aria-live="polite">
      <video ref={videoRef} muted playsInline aria-label="Webcam preview for hand control" />
      <p>{status === "loading" ? "Warming up the hand tracker…" : status === "error" ? "Hand control needs a camera. The slider works great too." : "Point at the screen and tilt your hand to turn the ramp."}</p>
      <button className="text-button" onClick={onClose}>Use the slider instead</button>
    </div>
  );
}
