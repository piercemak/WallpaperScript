import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 3;
const SPACING = 10;

const CircleGrid = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(prev => !prev);
  const [isHovered, setIsHovered] = useState(false);
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
          fill={isHovered ? "#b1b5b6" : "#eef0f1"} // change color on hover
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isHovered ? 2.2 : 1.5,            // pulse on hover
            opacity: 1,
          }}
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
    <div>
        <svg
          onClick={toggleOpen}
          className='fixed z-51 top-0 cursor-pointer'
    
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {circles}
        </svg>


        <AnimatePresence>
          {open && (
            <motion.div
            className="fixed inset-0 z-50 bg-[#111] m-8 flex justify-center items-center rounded-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            >

            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default CircleGrid;
