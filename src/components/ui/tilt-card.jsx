"use client";

import { useRef, useCallback } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * 3D tilt + optional spotlight. effect="gravitate" uses a softer tilt plus
 * slight X/Y follow toward the pointer.
 */
export default function TiltCard({
  children,
  className = "",
  tiltLimit = 8,
  scale: scaleTo = 1.02,
  spotlight = false,
  effect = "gravitate",
}) {
  const rootRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 180, damping: 24 });
  const y = useSpring(rawY, { stiffness: 180, damping: 24 });
  const scale = useSpring(1, { stiffness: 200, damping: 25 });

  const tiltMult = effect === "gravitate" ? 0.55 : 1;
  const rotateX = useTransform(
    y,
    [-0.5, 0.5],
    [tiltLimit * tiltMult, -tiltLimit * tiltMult]
  );
  const rotateY = useTransform(
    x,
    [-0.5, 0.5],
    [-tiltLimit * tiltMult, tiltLimit * tiltMult]
  );
  const tx = useTransform(x, (v) => (effect === "gravitate" ? -v * 7 : 0));
  const ty = useTransform(y, (v) => (effect === "gravitate" ? -v * 7 : 0));

  const spotlightBackground = useMotionTemplate`radial-gradient(420px at ${spotX}px ${spotY}px, rgba(255,255,255,0.12), rgba(255,255,255,0) 65%)`;

  const handleMove = useCallback(
    (e) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      rawX.set((e.clientX - r.left) / r.width - 0.5);
      rawY.set((e.clientY - r.top) / r.height - 0.5);
      spotX.set(e.clientX - r.left);
      spotY.set(e.clientY - r.top);
    },
    [rawX, rawY, spotX, spotY]
  );

  const handleEnter = useCallback(() => {
    const el = rootRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      spotX.set(r.width / 2);
      spotY.set(r.height / 2);
    }
    scale.set(scaleTo);
  }, [scale, scaleTo, spotX, spotY]);

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
    const el = rootRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      spotX.set(r.width / 2);
      spotY.set(r.height / 2);
    }
  }, [rawX, rawY, scale, spotX, spotY]);

  return (
    <div className="w-full" style={{ perspective: 1200 }}>
      <motion.div
        ref={rootRef}
        onPointerMove={handleMove}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className={`relative overflow-hidden ${className}`.trim()}
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          x: tx,
          y: ty,
          scale,
        }}
      >
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]"
            style={{ background: spotlightBackground }}
            aria-hidden
          />
        )}
        <div className="relative z-0">{children}</div>
      </motion.div>
    </div>
  );
}
