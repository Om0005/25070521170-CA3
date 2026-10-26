import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to `value` when the number arrives from the API.
 * Keeps the final digit exact so the number is always truthful.
 */
export default function CountUp({ value = 0, duration = 750 }) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const from = current.current;

    if (from === target) {
      setDisplay(target);
      return undefined;
    }

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);

      current.current = next;
      setDisplay(next);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        current.current = target;
        setDisplay(target);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display.toLocaleString('en-IN')}</>;
}
