import React from 'react';
import CTTHeader from '../components/CTTHeader';
import CTTConfirmation from '../components/CTTConfirmation';
import CTTHeroSection from '../components/CTTHeroSection';

const CTTConfirmationPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CTTHeader />
      <CTTHeroSection />
      <CTTConfirmation />
    </div>
  );
};

export default CTTConfirmationPage;