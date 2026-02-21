'use client';

import { motion } from 'framer-motion';

export interface TimerRingProps {
  seconds: number;
  totalSeconds: number;
  size?: number;
  strokeWidth?: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getColorClass(seconds: number): string {
  if (seconds > 60) return 'text-poker-green';
  if (seconds > 30) return 'text-poker-gold';
  return 'text-poker-error';
}

const pulseAnimation = { opacity: [1, 0.6, 1] };
const pulseTransition = {
  duration: 0.8,
  repeat: Number.POSITIVE_INFINITY,
  ease: 'easeInOut' as const,
};
const staticAnimation = { opacity: 1 };

export function TimerRing({ seconds, totalSeconds, size = 80, strokeWidth = 4 }: TimerRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const colorClass = getColorClass(seconds);
  const isRed = seconds <= 30;
  const center = size / 2;

  return (
    <motion.svg
      className={colorClass}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={isRed ? pulseAnimation : staticAnimation}
      {...(isRed ? { transition: pulseTransition } : {})}
      aria-label={`${formatTime(seconds)} remaining`}
      role="timer"
    >
      {/* Track circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        className="stroke-poker-bg-header"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
      />
      {/* Center text */}
      <text
        x={center}
        y={center}
        dominantBaseline="middle"
        textAnchor="middle"
        fill="currentColor"
        fontWeight="bold"
        fontSize={size * 0.2}
        style={{ transition: 'fill 0.3s ease' }}
      >
        {formatTime(seconds)}
      </text>
    </motion.svg>
  );
}
