import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import GamesSection from '../components/GamesSection';
import CTASection from '../components/CTASection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <GamesSection />
      <CTASection />
    </div>
  );
};

export default HomePage;