"use client";

/**
 * Aceternity UI "3d-card" (installed from https://ui.aceternity.com/registry/3d-card.json),
 * trimmed and restyled for the Nest: a gentler tilt, a soft glare that follows the pointer,
 * no default spacing, and nothing at all for people who ask for reduced motion.
 */

import { cn } from "@/lib/utils";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MouseEnterContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(
  undefined,
);

function prefersStillness(): boolean {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(hover: none)").matches)
  );
}

export const CardContainer = ({
  children,
  className,
  containerClassName,
  tilt = 40,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** Pixels of pointer travel per degree of tilt. Bigger is calmer. */
  tilt?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el || prefersStillness()) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / tilt;
    const y = (e.clientY - top - height / 2) / tilt;
    el.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    el.style.setProperty("--glare-x", `${((e.clientX - left) / width) * 100}%`);
    el.style.setProperty("--glare-y", `${((e.clientY - top) / height) * 100}%`);
  };

  const handleMouseEnter = () => {
    if (prefersStillness()) return;
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={cn("tilt", containerClassName)}>
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-tilting={isMouseEntered}
          className={cn("tilt__inner", className)}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("tilt__body", className)}>{children}</div>;
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
} & Record<string, unknown>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = isMouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Tag>
  );
};

// Create a hook to use the context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
