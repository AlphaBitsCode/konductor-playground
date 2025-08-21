'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import type React from 'react';

export function TeaserPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize to -0.5 .. 0.5
    const nx = x / rect.width - 0.5;
    const ny = y / rect.height - 0.5;

    const maxTilt = 20; // degrees (increased for a more obvious effect)
    const ry = Math.max(-maxTilt, Math.min(maxTilt, nx * 2 * maxTilt)); // rotateY follows X
    const rx = Math.max(-maxTilt, Math.min(maxTilt, -ny * 2 * maxTilt)); // rotateX inverse Y

    setTilt({ rx, ry });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Elements - reuse from LandingPage */}
      <div className="fixed inset-0 simple-bg-animation pointer-events-none" />
      <div className="fixed inset-0 subtle-overlay pointer-events-none" />

      <div className="relative text-center">
        {/* White glow background (no bounding box) */}
        <div
          className={`pointer-events-none absolute inset-0 mx-auto my-0 -z-10 transition-opacity duration-300 ${
            hovered ? 'opacity-70' : 'opacity-25'
          }`}
          aria-hidden
          style={{
            filter: 'blur(36px)',
            background:
              'radial-gradient(260px 260px at 50% 50%, rgba(255,255,255,0.18), transparent 60%)',
          }}
        />

        <div
          ref={containerRef}
          className="mb-8 mx-auto w-[320px] h-[320px] grid place-items-center relative"
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transition: 'transform 180ms ease, filter 220ms ease',
            transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hovered ? 20 : 0}px) scale(${hovered ? 1.1 : 1})`,
            filter: hovered ? 'drop-shadow(0 10px 24px rgba(0,0,0,0.35)) drop-shadow(0 0 24px rgba(255,255,255,0.25))' : 'drop-shadow(0 6px 12px rgba(0,0,0,0.25)) drop-shadow(0 0 12px rgba(255,255,255,0.15))',
            willChange: 'transform, filter',
          }}
        >
          {/* Parallax shadow layer */}
          <div
            className="absolute -z-10 rounded-full"
            style={{
              width: 260,
              height: 260,
              background: 'radial-gradient(closest-side, rgba(0,0,0,0.35), rgba(0,0,0,0) 70%)',
              transform: `translate(${tilt.ry * 1.2}px, ${-tilt.rx * 1.2}px) scale(${hovered ? 1.05 : 1})`,
              transition: 'transform 180ms ease',
              filter: 'blur(18px)',
            }}
          />

          <Image
            src="/logos/k_icon.png"
            alt="Konductor.AI"
            width={240}
            height={240}
            className="mx-auto pixel-art select-none"
            draggable={false}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <h1 className="font-['Press_Start_2P'] text-white text-lg mb-4 pixel-art">
          KONDUCTOR.AI
        </h1>
        <p className="font-['Press_Start_2P'] text-gray-400 text-xs pixel-art">
          ON-AIR SOON
        </p>
      </div>

      {/* Inject background animation CSS used by LandingPage */}
      <style jsx global>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .simple-bg-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(45deg, transparent 49%, rgba(0, 255, 255, 0.05) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255, 0, 255, 0.03) 50%, transparent 51%);
          background-size: 40px 40px, 60px 60px;
          animation: simple-drift 120s infinite linear;
          pointer-events: none;
          will-change: background-position;
        }

        @keyframes simple-drift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 40px 40px, -60px 60px; }
        }

        .subtle-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.02) 0%, transparent 50%);
          animation: subtle-pulse 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}
      </style>
    </div>
  );
}
