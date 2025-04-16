import React from 'react'
import styles from './modules/carousel.module.css'
import CircleGrid from './CircleGrid.jsx'
import Search from './Search.jsx'
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";



const Carousel = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [bgColor, setBgColor] = useState('rgba(0,0,0,0.8)');
  const imageRef = useRef();



  useEffect(() => {
    fetch('http://localhost:8000/api/wallpapers/') 
      .then(res => res.json())
      .then(setImages)
      .catch(console.error);
  }, []);


  return (
    <LayoutGroup>
      {/* Carousel (only shows when no image is selected) */}
      {!selectedImage && (
        <div
          className={styles["carousel"]}
          style={{
            '--items': images.length,
            '--carousel-duration': `${images.length * 5}s`,
          }}
        >
          
          {images.map((file, i) => (
            <motion.article
              key={i}
              layoutId={`image-${i}`} 
              style={{ '--i': i }}
              className='cursor-pointer'
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400 } }}
              onClick={() => setSelectedImage({ src: file, index: i })}
            >
              <img src={file} alt={`img-${i}`} />
            </motion.article>
          ))}
        </div>
      )}

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            style={{ backgroundColor: bgColor }}
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
            layoutId={`overlay-${selectedImage.index}`}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >

            <motion.div
                className="flex absolute w-full top-0"
                transition={{ delay: .05, duration: 0.6 }} 
            >
                <div className='flex w-full items-center justify-between px-[100px]'>
                    <div className=''>
                        <CircleGrid />
                    </div>
                    <div className=''>
                        <CircleGrid />
                    </div>
                    <div className=''>
                        <Search />
                    </div>
                   
                </div>
            </motion.div>

            <motion.img
                ref={imageRef}
                src={selectedImage.src}
                alt="fullscreen"
                layoutId={`image-${selectedImage.index}`}
                className="max-w-[80vw] max-h-[80vh] mt-4 object-contain rounded-lg shadow-lg"
                crossOrigin="anonymous"
                transition={{
                    duration: 0.9,
                    ease: [0.25, 0.8, 0.25, 1] 
                  }}
                onLoad={() => {
                    try {
                      const img = imageRef.current;
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                  
                      canvas.width = img.naturalWidth;
                      canvas.height = img.naturalHeight;
                      ctx.drawImage(img, 0, 0);
                  
                      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                      const { data } = imageData;
                  
                      let r = 0, g = 0, b = 0;
                      const totalPixels = data.length / 4;
                  
                      for (let i = 0; i < data.length; i += 4) {
                        r += data[i];     
                        g += data[i + 1]; 
                        b += data[i + 2]; 
                      }
                  
                      r = Math.floor(r / totalPixels);
                      g = Math.floor(g / totalPixels);
                      b = Math.floor(b / totalPixels);
                  
                      setBgColor(`rgb(${r}, ${g}, ${b})`);
                    } catch (err) {
                      console.error('Custom canvas color extraction failed:', err);
                      setBgColor('rgba(0,0,0,0.8)');
                    }
                  }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}

export default Carousel