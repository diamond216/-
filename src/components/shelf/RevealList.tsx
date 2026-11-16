"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * A list whose items stagger in the first time they scroll into view. motion owns these
 * <li>s; nothing else animates them. Reduced motion is handled by <MotionConfig reducedMotion="user">.
 */
export function RevealList<T>({
  items,
  keyOf,
  render,
  className,
  step = 0.06,
}: {
  items: readonly T[];
  keyOf(item: T): string;
  render(item: T, index: number): ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <ol className={className}>
      {items.map((item, index) => (
        <motion.li
          key={keyOf(item)}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: (index % 6) * step }}
        >
          {render(item, index)}
        </motion.li>
      ))}
    </ol>
  );
}
