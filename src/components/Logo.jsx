import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpg';

export default function Logo({ width = '60px', height = '60px' }) {
  const [transparentLogo, setTransparentLogo] = useState(logoImg);

  useEffect(() => {
    const img = new Image();
    img.src = logoImg;
    img.crossOrigin = 'anonymous'; // Prevent security errors if loaded externally
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Loop through all pixels and make near-white/light-grey pixels transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // If pixel is very light (the greyish background screenshot area)
          if (r > 215 && g > 215 && b > 215) {
            data[i + 3] = 0; // Set alpha to 0 (fully transparent)
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentUrl = canvas.toDataURL('image/png');
        setTransparentLogo(transparentUrl);
      } catch (e) {
        console.error('Failed to extract transparent logo via canvas', e);
        // Fallback to original image if context access fails (e.g. CORS)
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img 
        src={transparentLogo} 
        alt="Luchyhomes Logo" 
        style={{ 
          width: width, 
          height: height, 
          objectFit: 'contain',
          display: 'block'
        }} 
      />
    </div>
  );
}
