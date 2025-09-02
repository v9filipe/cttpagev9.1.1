import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const navItems = [
    { name: 'Desporto', href: '#' },
    { name: 'Casino', href: '#' },
    { name: 'Slots', href: '#' },
    { name: 'Promoções', href: '#' }
  ];

  const handleNavClick = (item) => {
    toast({
      title: "Navegação",
      description: `Clicou em ${item}`,
      duration: 2000
    });
  };

  const handleLogin = () => {
    toast({
      title: "Entrar",
      description: "Funcionalidade de login será implementada em breve",
      duration: 3000
    });
  };

  const handleRegister = () => {
    toast({
      title: "Registar",
      description: "Funcionalidade de registo será implementada em breve",
      duration: 3000
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="bg-red-600 text-white px-4 py-2 rounded font-bold text-lg">
              Betclic
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className="text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogin}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Entrar
            </Button>
            <Button 
              size="sm"
              onClick={handleRegister}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Registar
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.name);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex space-x-3 pt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Entrar
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    handleRegister();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Registar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;