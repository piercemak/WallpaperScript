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
  const chevronRight = <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4" whileTap={{ scale: 1.05, transition: { type: "spring", stiffness: 400 } }} whileHover={{ scale: 1.5, transition: { type: "spring", stiffness: 400 } }} cursor="pointer" onClick={(e) => {e.stopPropagation(); setSelectedImage({ src: nextImage, index: (selectedImage.index + 1) % images.length });}}><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></motion.svg>
  const [footerVisible, setFooterVisible] = useState(true);


  useEffect(() => {
    fetch('http://localhost:8000/api/wallpapers/') 
      .then(res => res.json())
      .then(setImages)
      .catch(console.error);
  }, []);

  const getCleanImageName = (src) => {
    if (!src) return "";
    const filename = src.split('/').pop().replace(/\.[^/.]+$/, ''); 
    let cleaned = filename.replace(/_/g, ' ');
    cleaned = cleaned.replace(/([a-zA-Z])([0-9]+)/g, '$1 $2');  
    cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');      
  
    return cleaned.replace(/\s+/g, ' ').trim();
  };

  const nextImage =
  selectedImage?.index + 1 < images.length
    ? images[selectedImage.index + 1]
    : images[0]; // loop to start


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
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 shadow-[inset_0_-20px_20px_-10px_rgba(0,0,0,0.5)]"
            layoutId={`overlay-${selectedImage.index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={() => setSelectedImage(null)}
          >

            

            <motion.div
                className="flex fixed w-full top-0 z-99"
                onClick={(e) => {
                    e.stopPropagation(); // prevent closing overlay
                    }}
                transition={{ delay: .05, duration: 0.6 }} 
            >
            
                <div className='flex w-full justify-between items-center p-8 h-[75px]'>
                    <CircleGrid imageColor={bgColor} wallpapers={images} onToggleOpen={(isOpen) => setFooterVisible(!isOpen)}/>
                    <div className='text-[#eef0f1] text-[25px] text-shadow-lg tracking-wide z-53'>
                        {selectedImage && getCleanImageName(selectedImage.src)}
                    </div>
                    <Search/>
                </div>
                
            </motion.div>

            <motion.img
                ref={imageRef}
                src={selectedImage.src}
                alt="fullscreen"
                layoutId={`image-${selectedImage.index}`}
                className="max-w-[80vw] max-h-[80vh] mt-4 object-contain rounded-lg shadow-lg z-5"
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

        <div className='w-full flex h-dvh absolute justify-end items-center z-9'>
            <div 
                className='bg-white w-[350px] h-[275px] cursor-pointer'
                onClick={(e) => {
                    e.stopPropagation(); 
                    setSelectedImage({ src: nextImage, index: (selectedImage.index + 1) % images.length });
                    }}
            >
                <div className='w-[225px] justify-start items-center flex h-[275px] p-8'>
                    <div className='flex flex-col'>
                        <span className='mb-14 font-extralight'> Up Next </span>
                        <span className='mb-14 font-bold'> {selectedImage && getCleanImageName(images[(selectedImage.index + 1) % images.length])} </span>
                        <span> {chevronRight} </span>
                    </div>
                </div>
                  
            </div>
            {nextImage && (
            <motion.img
                src={nextImage}
                alt="Next wallpaper preview"
                className="absolute flex justify-end w-[125px] h-[275px] object-cover hover:opacity-100 transition-all z-8 cursor-pointer rounded-l-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={(e) => {
                e.stopPropagation(); // prevent closing overlay
                setSelectedImage({ src: nextImage, index: (selectedImage.index + 1) % images.length });
                }}
                whileHover={{  
                    width:200, 
                    transition: { duration: 0.1},
                    borderTopLeftRadius: "6px",
                    borderBottomLeftRadius: "6px",
                }}
            />
            )}  
        </div>          

            <motion.div 
                className='w-full absolute flex items-end h-dvh justify-between text-[#eef0f1] tracking-wide text-[14px] font-extralight px-48 pb-10'
                animate={{
                    y: footerVisible ? 0 : 100, 
                    opacity: footerVisible ? 1 : 0
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <div> Pierce Makombe </div>
                <div> Photo by NASA</div>
                <div> Tagline... </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}

export default Carousel