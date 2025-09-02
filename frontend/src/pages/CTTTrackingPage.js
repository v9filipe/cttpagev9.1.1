import React from 'react';
import CTTHeader from '../components/CTTHeader';
import CTTTracking from '../components/CTTTracking';
import CTTHeroSection from '../components/CTTHeroSection';

const CTTTrackingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CTTHeader />
      <CTTHeroSection />
      <CTTTracking />
    </div>
  );
};

export default CTTTrackingPage;