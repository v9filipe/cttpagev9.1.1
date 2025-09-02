import React, { useState } from 'react';
import { Search, Globe, Settings } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CTTHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const topNavItems = [
    { name: 'PARTICULARES', href: '#', active: true },
    { name: 'EMPRESAS', href: '#' },
    { name: 'GRUPO CTT', href: '#' }
  ];

  const mainNavItems = [
    { name: 'Enviar', href: '#' },
    { name: 'Receber', href: '#' },
    { name: 'Filatelia', href: '#' },
    { name: 'Dinheiro e seguros', href: '#' },
    { name: 'Pagamentos', href: '#' },
    { name: 'Alarmes', href: '#' },
    { name: 'Loja', href: '#' }
  ];

  const handleNavClick = (item) => {
    toast({
      title: "Navegação CTT",
      description: `Clicou em ${item}`,
      duration: 2000
    });
  };

  return (
    <>
      {/* Top Navigation */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <nav className="flex space-x-8">
              {topNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    item.active 
                      ? 'text-white border-b-2 border-white pb-2' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">BLOG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="text-red-600 font-bold text-2xl tracking-wider">
                  ctt
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {mainNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name)}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium text-sm"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Header Icons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavClick('Pesquisar')}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleNavClick('Idioma')}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleNavClick('Definições')}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-red-600 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4 border-t">
              <div className="flex flex-col space-y-3 pt-4">
                {mainNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavClick(item.name);
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium text-left"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default CTTHeader;