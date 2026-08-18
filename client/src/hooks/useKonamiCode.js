import { useEffect, useState, useCallback } from "react";

// ============================================================================
// useKonamiCode — Easter Egg Hook
//
// Listens for the classic Konami Code sequence on the keyboard:
//   ↑ ↑ ↓ ↓ ← → ← → B A
//
// When the full sequence is entered, it:
//   1. Adds a "shake" class to <body> for a brief screen-shake animation
//   2. Spawns a burst of floating emoji that fade out
//
// DECISION: Keeping this as a standalone hook with zero dependencies on app
// state. It attaches its own keydown listener and manipulates the DOM directly
// for the animation. This isolation means you can delete this one file and
// remove the one-line hook call in App.jsx to fully remove the easter egg.
// ============================================================================

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Spawns floating emoji elements that rise and fade out.
 * Each emoji is absolutely positioned at a random x-offset.
 */
function spawnEmojiBurst() {
  const emojis = ["🎮", "⬆️", "⬇️", "⬅️", "➡️", "🅱️", "🅰️"];
  const container = document.createElement("div");

  // DECISION: Using fixed positioning and pointer-events:none so the burst
  // doesn't interfere with page layout or block clicks. The container
  // self-destructs after the animation completes.
  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "9999",
    overflow: "hidden",
  });

  for (let i = 0; i < 12; i++) {
    const span = document.createElement("span");
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    Object.assign(span.style, {
      position: "absolute",
      bottom: "-40px",
      left: `${Math.random() * 90 + 5}%`,
      fontSize: `${Math.random() * 16 + 20}px`,
      opacity: "1",
      transition: `all ${Math.random() * 1 + 1.5}s ease-out`,
    });

    container.appendChild(span);

    // Trigger the upward float after a brief delay so the transition fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        span.style.bottom = `${Math.random() * 60 + 40}%`;
        span.style.opacity = "0";
      });
    });
  }

  document.body.appendChild(container);

  // Clean up after animations finish
  setTimeout(() => container.remove(), 3000);
}

function useKonamiCode() {
  const [progress, setProgress] = useState(0);

  const handleKeyDown = useCallback(
    (e) => {
      const expected = KONAMI_SEQUENCE[progress];

      if (e.key === expected) {
        const next = progress + 1;

        if (next === KONAMI_SEQUENCE.length) {
          // Full sequence entered — trigger the easter egg
          document.body.classList.add("shake");
          spawnEmojiBurst();

          // Remove shake class after animation completes
          setTimeout(() => document.body.classList.remove("shake"), 500);

          // Reset so it can be triggered again
          setProgress(0);
        } else {
          setProgress(next);
        }
      } else {
        // Wrong key — reset progress
        setProgress(0);
      }
    },
    [progress]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export default useKonamiCode;
