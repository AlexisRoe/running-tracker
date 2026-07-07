import confetti from "canvas-confetti";

/** Fires a celebratory confetti burst plus a short stream from both bottom corners. */
export function fireConfetti() {
  const end = Date.now() + 700;
  const colors = ["#40c057", "#82c91e", "#fab005", "#fa5252", "#4dabf7"];

  confetti({
    particleCount: 200,
    spread: 100,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors,
    zIndex: 2000,
  });

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
      zIndex: 2000,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
      zIndex: 2000,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
