import { useEffect, useState, useRef } from "react";
import { useSpring, useInView } from "framer-motion";

// DECISION: Combining useSpring (for smooth number animation) with useInView
// (for scroll-triggered start) keeps everything in framer-motion. No need for
// Intersection Observer polyfills or a separate scroll library.

/**
 * Animates a number from 0 to `target` when the returned ref scrolls into view.
 * Returns { ref, display } where display is the current animated integer.
 *
 * @param {number} target - The number to count up to.
 * @param {object} [options] - Spring config overrides.
 */
function useCountUp(target, options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  // DECISION: Using useSpring with stiffness/damping instead of a tween
  // duration. Springs feel more natural and don't need an explicit duration —
  // they settle on their own. These values give a ~1.2s animation.
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    ...options,
  });

  // When the element scrolls into view, set the spring target
  useEffect(() => {
    if (isInView) {
      spring.set(target);
    }
  }, [isInView, target, spring]);

  // Subscribe to spring value changes and update display as a rounded integer
  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return { ref, display };
}

export default useCountUp;
