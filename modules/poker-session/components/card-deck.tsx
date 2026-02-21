'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FibonacciCard } from './fibonacci-card';

export interface CardDeckProps {
  values?: (number | '?')[];
  selectedValue?: number | '?' | undefined;
  disabled?: boolean | undefined;
  onSelect?: ((value: number | '?') => void) | undefined;
}

const DEFAULT_VALUES: (number | '?')[] = [1, 2, 3, 5, 8, 13, '?'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

export function CardDeck({
  values = DEFAULT_VALUES,
  selectedValue,
  disabled = false,
  onSelect,
}: CardDeckProps) {
  const shouldReduce = useReducedMotion();

  // Separate the last value ('?') from the rest for grid layout
  const mainValues = values.slice(0, -1);
  const lastValue = values.length > 0 ? values[values.length - 1] : undefined;

  return (
    <motion.div
      className="w-full h-full"
      variants={containerVariants}
      initial={shouldReduce ? 'visible' : 'hidden'}
      animate="visible"
    >
      {/* 2-column grid; 4 equal rows fill available height */}
      <div className="grid grid-cols-2 grid-rows-4 gap-3 h-full">
        {mainValues.map((value) => (
          <motion.div
            key={String(value)}
            className="h-full"
            {...(!shouldReduce ? { variants: cardVariants } : {})}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <FibonacciCard
              value={value}
              selected={selectedValue === value}
              disabled={disabled}
              onClick={() => onSelect?.(value)}
            />
          </motion.div>
        ))}

        {/* Last card spans both columns */}
        {lastValue !== undefined && (
          <motion.div
            key={String(lastValue)}
            className="col-span-2 h-full"
            {...(!shouldReduce ? { variants: cardVariants } : {})}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <FibonacciCard
              value={lastValue}
              selected={selectedValue === lastValue}
              disabled={disabled}
              onClick={() => onSelect?.(lastValue)}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
