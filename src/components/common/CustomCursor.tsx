"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rotation: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHidden, setIsHidden] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Particle burst generator on click (spawns golden diamond sparks)
  const spawnParticles = (x: number, y: number) => {
    const newParticles: Particle[] = Array.from({ length: 6 }).map((_, idx) => {
      const angle = (idx * 60 * Math.PI) / 180 + (Math.random() - 0.5) * 0.4;
      const distance = 45 + Math.random() * 25;
      return {
        id: Date.now() + idx + Math.random(),
        x,
        y,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        rotation: 180 + Math.random() * 180,
      };
    });

    setParticles((prev) => [...prev, ...newParticles].slice(-18));
  };

  // Shockwave ring generator on click (expanding golden ripple)
  const spawnRipple = (x: number, y: number) => {
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    setRipples((prev) => [...prev, newRipple].slice(-3));
  };

  useEffect(() => {
    // Detect mobile/touch devices
    const checkDevice = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        document.body.classList.add("luxury-cursor-active");
      } else {
        document.body.classList.remove("luxury-cursor-active");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      document.body.classList.remove("luxury-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      spawnParticles(e.clientX, e.clientY);
      spawnRipple(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    // Scalable check: Listen to cursor computed style pointer globally on the DOM
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      let current: HTMLElement | null = target;
      let hasPointer = false;

      while (current && current !== document.body) {
        if (current.nodeType === 1) {
          const style = window.getComputedStyle(current);
          if (style.cursor === "pointer") {
            hasPointer = true;
            break;
          }
        }
        current = current.parentElement;
      }

      setIsHovered(hasPointer);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobile]);

  // Clean up particles and ripples after animations complete
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  if (isMobile || isHidden) return null;

  return (
    <>
      {/* 1. Dynamic Spawning Sparks / Click Particles (Shining Golden Diamond Stars) */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 1, rotate: 0 }}
            animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0.1, rotate: p.rotation }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="fixed pointer-events-none text-[#D4AF37] z-[9999] select-none"
            style={{
              left: p.x,
              top: p.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L15.3 8.7L22 12L15.3 15.3L12 22L8.7 15.3L2 12L8.7 8.7Z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 2. Spawning Click Ripples / Shockwaves (Gold expanding halo) */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ x: "-50%", y: "-50%", width: 8, height: 8, opacity: 0.8, borderWidth: "1.5px" }}
            animate={{ width: 88, height: 88, opacity: 0, borderWidth: "0.5px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="fixed pointer-events-none rounded-full border border-[#D4AF37] z-[9997]"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
      </AnimatePresence>

      {/* 3. Dynamic Jewellery Cursor */}
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? "36px" : isClicked ? "14px" : "22px",
          height: isHovered ? "36px" : isClicked ? "14px" : "22px",
          // Align the index finger pointing tip exactly to the mouse hotspot when hovered
          transform: isHovered ? "translate(-38%, -10%)" : "translate(-50%, -50%)",
        }}
      >
        <motion.div
          animate={isHovered ? { rotate: 0 } : { rotate: 360 }}
          transition={isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: 12, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
        >
          {isHovered ? (
            /* Line-art Pointing Hand wearing a Pink Sapphire Ring & Gold Bead Wristlet */
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-[#D4AF37] drop-shadow-[0_2px_4px_rgba(44,27,36,0.18)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Fine pointing hand silhouette */}
              <path d="M18 13.5V10.5C18 9.67 17.33 9 16.5 9C16.12 9 15.77 9.14 15.5 9.37V7.5C15.5 6.67 14.83 6 14 6C13.62 6 13.27 6.14 13 6.37V4.5C13 3.67 12.33 3 11.5 3C10.67 3 10 3.67 10 4.5V14.25L7.42 11.67C6.83 11.08 5.88 11.08 5.3 11.67C4.72 12.25 4.72 13.2 5.3 13.78L9.5 18C10.74 19.24 12.43 20 14.25 20H15C16.66 20 18 18.66 18 17V13.5Z" />
              
              {/* Brilliant Pink Gemstone Ring on Ring Finger */}
              <circle cx="15.5" cy="11.5" r="1.5" stroke="#E75480" strokeWidth="1.2" fill="#FFF9FC" />
              <path d="M15.5 10L15.5 8" stroke="#D4AF37" strokeWidth="1.2" /> {/* Spark highlight */}
              
              {/* Elegant Gold Bead Bracelet on Wrist */}
              <path d="M10.5 19C12 19.7 13 19.7 14.5 19" stroke="#D4AF37" strokeWidth="2.2" strokeDasharray="1,1.5" />
            </svg>
          ) : (
            /* 3D Faceted Brilliant Cut Gold Gemstone Star in Default State */
            <svg
              className="w-full h-full drop-shadow-[0_2px_5px_rgba(44,27,36,0.22)] filter drop-shadow-[0_0_3px_rgba(212,175,55,0.45)]"
              viewBox="0 0 24 24"
            >
              <path d="M12,12 L12,2 L9,9 Z" fill="#FFF2B2" />
              <path d="M12,12 L12,2 L15,9 Z" fill="#F3D060" />
              <path d="M12,12 L22,12 L15,9 Z" fill="#E6BA3B" />
              <path d="M12,12 L22,12 L15,15 Z" fill="#C49A24" />
              <path d="M12,12 L12,22 L15,15 Z" fill="#AA8114" />
              <path d="M12,12 L12,22 L9,15 Z" fill="#C49A24" />
              <path d="M12,12 L2,12 L9,15 Z" fill="#E6BA3B" />
              <path d="M12,12 L2,12 L9,9 Z" fill="#F3D060" />
            </svg>
          )}
        </motion.div>
      </div>
    </>
  );
}
