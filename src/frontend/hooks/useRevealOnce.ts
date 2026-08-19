import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";

/**
 * Returns a ref to attach to the section container and a `visible` boolean
 * that becomes true once the element enters the viewport — and stays true
 * forever, even across parent re-renders. Drives `animate` (not whileInView)
 * so Motion never re-evaluates intersection on re-renders.
 */
export function useRevealOnce() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.1 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) setVisible(true);
  }, [inView]);

  return { ref, visible };
}
