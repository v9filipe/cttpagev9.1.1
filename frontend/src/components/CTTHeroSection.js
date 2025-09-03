import React from 'react';

const CTTHeroSection = () => {
  return (
    <div className="relative">
      {/* Hero Background Image - Smaller height */}
      <div 
        className="h-32 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(185, 28, 28, 0.8), rgba(239, 68, 68, 0.6)), 
                           url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23b91c1c;stop-opacity:1" /><stop offset="100%" style="stop-color:%23ef4444;stop-opacity:1" /></linearGradient></defs><rect width="1000" height="300" fill="url(%23bg)"/><path d="M0,100 Q250,50 500,100 T1000,100 L1000,300 L0,300 Z" fill="rgba(255,255,255,0.1)"/></svg>')`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Hero Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full">
            <p className="text-white text-base font-medium">
              Siga os passos abaixo para finalizar a entrega da sua encomenda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTTHeroSection;