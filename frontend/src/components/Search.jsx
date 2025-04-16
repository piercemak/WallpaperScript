import React from 'react';
import { motion } from 'framer-motion';

const Search = ({ size = 25, color = "#eef0f1" }) => {
  return (
    <svg
    className='z-63'
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.circle
        cx="11"
        cy="11"
        r="8"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
        stroke={color}
        strokeWidth="2"
        initial={{ opacity: 0, x: -4, y: -4 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />
    </svg>
  );
};

export default Search;
