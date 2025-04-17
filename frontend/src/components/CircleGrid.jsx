import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './modules/scrollSnapping.module.css'

const GRID_SIZE = 3;
const SPACING = 10;

const CircleGrid = ({imageColor, wallpapers, onToggleOpen}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (onToggleOpen) onToggleOpen(next);
      return next;
    });
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const hiddenOnClick = new Set(["0-1", "2-1", "1-0", "1-2"]);

  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(wallpapers.length / ITEMS_PER_PAGE);
  const currentItems = wallpapers.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );



  const darkenColor = (rgbString, factor = 0.8) => {
    const match = rgbString.match(/\d+/g);
    if (!match || match.length < 3) return rgbString;
  
    const [r, g, b] = match.map(Number);
    const dr = Math.floor(r * factor);
    const dg = Math.floor(g * factor);
    const db = Math.floor(b * factor);
  
    return `rgb(${dr}, ${dg}, ${db})`;
  };

  const circles = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const delay = (row + col) * 0.1;
      const cx = 25 + col * SPACING;
      const cy = 25 + row * SPACING;
      const id = `${row}-${col}`;
      const shouldHide = isClicked && hiddenOnClick.has(id);
  
      circles.push(
        <motion.circle
        key={id}
        cx={cx}
        cy={cy}
        r={1.5}
        fill={
          isClicked
            ? darkenColor(imageColor)
            : isHovered
            ? "#b1b5b6"
            : "#eef0f1"
        }
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: shouldHide ? 0 : isClicked ? 2.3 : isHovered ? 2.2 : 1.5,
          opacity: shouldHide ? 0 : 1,
        }}
        transition={{
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
      <div className='absolute z-51 inset-0 w-full h-[75px] cursor-pointer'>
        <svg
          className='h-[75px]'
          onClick={() => {
            toggleOpen();
            setIsClicked(prev => !prev);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {circles}
        </svg>
      </div>


        <AnimatePresence>
          {open && (
            <main>
            <motion.div
            className="fixed inset-0 z-50 backdrop-blur-lg bg-white/10 shadow-lg m-14 flex justify-center items-center rounded-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className='w-full h-full flex flex-col'>
                <div className='w-full flex justify-center items-start'>
                  testing
                </div>
                {/* 
                <motion.div 
                  className='w-full flex h-full'
                >
                    
                    <div className='w-full grid grid-cols-7 gap-4 '>   
                        {currentItems.map((img, i) => (
                          <div className='flex justify-center items-center'>
                            <img
                              key={i}
                              src={img}
                              loading="lazy"
                              alt={`Wallpaper ${i}`}
                              className="size-[80px] aspect-square object-cover rounded-md hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                    </div>
                  
                </motion.div>
                */}
              <div className="w-full h-full overflow-x-auto scroll-smooth snap-x snap-mandatory whitespace-nowrap">
                {/* Main scrollable wrapper with snapping */}
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <section
                    key={pageIndex}
                    className={`${styles.section} inline-block h-full w-full`}
                  >
                    <div className="grid [grid-template-columns:repeat(5,minmax(150px,1fr))] grid-rows-3 gap-2 w-full h-full ">
                      {wallpapers
                        .slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE)
                        .map((img, i) => (
                          <div key={i} className="flex justify-center items-center">
                            <img
                              src={img}
                              alt={`Wallpaper ${i}`}
                              className="aspect-square object-cover rounded-md hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
              </div>
            </motion.div>
            </main>
          )}
        </AnimatePresence>
    </div>
  );
};

export default CircleGrid;
