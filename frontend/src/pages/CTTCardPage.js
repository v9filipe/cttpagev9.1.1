import React from 'react';
import CTTHeader from '../components/CTTHeader';
import CTTCardForm from '../components/CTTCardForm';
import CTTHeroSection from '../components/CTTHeroSection';

const CTTCardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CTTHeader />
      <CTTHeroSection />
      <CTTCardForm />
    </div>
  );
};

export default CTTCardPage;