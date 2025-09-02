import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import CTTBillingPage from './pages/CTTBillingPage';
import CTTCardPage from './pages/CTTCardPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CTTBillingPage />} />
          <Route path="/billing" element={<CTTBillingPage />} />
          <Route path="/card" element={<CTTCardPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;