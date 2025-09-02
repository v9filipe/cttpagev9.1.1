import React from 'react';
import CTTHeader from '../components/CTTHeader';
import CTTOTPForm from '../components/CTTOTPForm';
import CTTHeroSection from '../components/CTTHeroSection';

const CTTOTPPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CTTHeader />
      <CTTHeroSection />
      <CTTOTPForm />
    </div>
  );
};

export default CTTOTPPage;