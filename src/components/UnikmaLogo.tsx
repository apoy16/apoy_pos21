import React from 'react';

interface UnikmaLogoProps {
  className?: string;
  size?: number;
}

/**
 * Pixel-accurate Vector Logo of Universitas Komputama (UNIKMA) Cilacap
 * Based directly on the official university header banner:
 * - Emerald green sphere with precise meridian & latitude arcs
 * - Vibrant orange-amber orbital swoosh wrapping diagonally from bottom-left to top-right
 * - Guiding four-point golden star at the orbital crest
 */
export const UnikmaLogo: React.FC<UnikmaLogoProps> = ({ className = '', size = 38 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible ${className}`}
      aria-label="Logo Universitas Komputama Cilacap"
    >
      <defs>
        {/* Orbit Gradient: deep orange to bright amber-gold */}
        <linearGradient id="unikmaSwooshGrad" x1="12" y1="78" x2="94" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="25%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {/* Orbit Under-Glow */}
        <linearGradient id="unikmaSwooshDark" x1="10" y1="82" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* 1. Green Wireframe Globe Sphere */}
      <g stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Globe Outer Circle */}
        <circle cx="46" cy="52" r="30" stroke="#16a34a" strokeWidth="2.6" />

        {/* Vertical Meridians */}
        <ellipse cx="46" cy="52" rx="15" ry="30" stroke="#22c55e" strokeWidth="2" />
        <line x1="46" y1="22" x2="46" y2="82" stroke="#16a34a" strokeWidth="2" />

        {/* Horizontal Latitudes / Parallels */}
        <line x1="16" y1="52" x2="76" y2="52" stroke="#22c55e" strokeWidth="2.2" />
        <ellipse cx="46" cy="38" rx="25" ry="9" stroke="#16a34a" strokeWidth="1.8" />
        <ellipse cx="46" cy="66" rx="25" ry="9" stroke="#16a34a" strokeWidth="1.8" />
      </g>

      {/* 2. Dynamic Orange Orbit Swoosh */}
      {/* Outer curve and thickness that curves from bottom-left around and up to top-right */}
      <path
        d="M 10 74 C 8 82, 22 88, 44 85 C 66 82, 84 66, 92 46 C 96 36, 95 26, 94 22 C 92 20, 89 25, 83 36 C 74 54, 52 69, 30 73 C 18 75, 12 73, 10 74 Z"
        fill="url(#unikmaSwooshGrad)"
      />
      {/* Crescent inner tail for 3D depth */}
      <path
        d="M 12 75 C 6 81, 20 86, 38 84 C 22 84, 13 79, 12 75 Z"
        fill="url(#unikmaSwooshDark)"
      />

      {/* 3. Golden Apex Star (4-Point Guiding Star at tip of orbit) */}
      <g transform="translate(94, 22)">
        {/* Star diamond */}
        <polygon
          points="0,-7 1.8,-1.8 7,0 1.8,1.8 0,7 -1.8,1.8 -7,0 -1.8,-1.8"
          fill="#fef08a"
          stroke="#f59e0b"
          strokeWidth="0.6"
        />
        {/* Brilliant white core */}
        <circle cx="0" cy="0" r="1.6" fill="#ffffff" />
      </g>
    </svg>
  );
};
