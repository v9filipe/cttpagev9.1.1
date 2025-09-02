import React from 'react';
import CTTHeader from '../components/CTTHeader';
import CTTBillingForm from '../components/CTTBillingForm';
import CTTHeroSection from '../components/CTTHeroSection';

const CTTBillingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CTTHeader />
      <CTTHeroSection />
      <CTTBillingForm />
    </div>
  );
};

export default CTTBillingPage;