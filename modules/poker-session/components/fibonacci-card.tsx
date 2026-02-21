'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface FibonacciCardProps {
  value: number | '?';
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const springTransition = { type: 'spring', stiffness: 300, damping: 20 } as const;

const cardVariants = {
  default: { scale: 1 },
  selected: { scale: 1.04 },
} as const;

export function FibonacciCard({
  value,
  selected = false,
  disabled = false,
  onClick,
}: FibonacciCardProps) {
  const shouldReduce = useReducedMotion();
  const canAnimate = !(disabled || shouldReduce);
  const animate = selected ? 'selected' : 'default';

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      variants={cardVariants}
      {...(!shouldReduce ? { animate } : {})}
      {...(canAnimate
        ? { whileHover: { scale: selected ? 1.1 : 1.05 }, whileTap: { scale: 0.95 } }
        : {})}
      transition={springTransition}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Vote ${value}`}
      className={[
        'relative flex flex-col items-center justify-center',
        'rounded-xl w-full h-full',
        'select-none cursor-pointer',
        'border-2 transition-colors duration-200',
        selected
          ? 'bg-poker-green border-[3px] border-poker-green-dark text-poker-bg-page'
          : 'bg-poker-bg-row border-poker-muted text-poker-text',
        !(disabled || selected) ? 'hover:border-poker-green focus-visible:border-poker-green' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-green',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Card value — always centered */}
      <span className="text-[48px] font-black leading-none">{value}</span>

      {/* Selected label — absolutely positioned so it never shifts the number */}
      <span
        className={[
          'absolute bottom-6 left-0 right-0 text-center text-[10px] font-black tracking-widest uppercase leading-none',
          !selected && 'invisible',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      >
        selected
      </span>
    </motion.button>
  );
}
