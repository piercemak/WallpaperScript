import React from 'react';
import { motion } from 'framer-motion';

const GRID_SIZE = 3;
const SPACING = 10;

const CircleGrid = () => {
  const circles = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const delay = (row + col) * 0.1;
      const cx = 25 + col * SPACING;
      const cy = 25 + row * SPACING;
  
      circles.push(
        <motion.circle
          key={`${row}-${col}`}
          cx={cx}
          cy={cy}
          r={1.5}
          fill="#eef0f1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{
            delay,
            duration: 0.2,
            type: "spring",
            stiffness: 80,
            damping: 12,
          }}
        />
      );
    }
  }

  return (
    <svg width="80" height="80">
      {circles}
    </svg>
  );
};

export default CircleGrid;
