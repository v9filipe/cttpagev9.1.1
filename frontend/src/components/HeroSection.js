import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Zap } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const HeroSection = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const handleClaimBonus = () => {
    toast({
      title: "Oferta Limitada",
      description: "Reclame o seu bónus de 50€ agora!",
      duration: 3000
    });
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber) {
      toast({
        title: "Erro",
        description: "Por favor, introduza o seu número de telemóvel",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep(2);
    toast({
      title: "Sucesso",
      description: "Número submetido! Aguarde a verificação.",
      duration: 3000
    });
  };

  const handleConfirmMBWay = () => {
    setCurrentStep(3);
    toast({
      title: "MBWay Confirmado",
      description: "Verificação completa! Bónus a ser creditado.",
      duration: 3000
    });
  };

  return (
    <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Limited Offer Badge */}
            <div className="inline-flex items-center bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              OFERTA LIMITADA
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              GANHE <span className="text-yellow-400">50€</span>
              <br />
              DE BÓNUS GRÁTIS
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-red-100 mb-6 leading-relaxed">
              Receba 50€ para apostar em slots ou desporto
            </p>

            {/* Description */}
            <p className="text-red-100 mb-8 text-lg leading-relaxed">
              Oferta limitada para utilizadores ativos e novos membros. Registe o seu 
              número de telemóvel e receba o seu bónus instantaneamente!
            </p>

            {/* CTA Button */}
            <Button 
              onClick={handleClaimBonus}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              RECLAMAR 50€ AGORA
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 mt-8 text-red-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                <span className="text-sm">+1.000 utilizadores hoje</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                <span className="text-sm">Licenciado & Seguro</span>
              </div>
            </div>
          </div>

          {/* Right Verification Card */}
          <div className="lg:ml-8">
            <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    Betclic
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    MBWay
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Verificação Segura
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Em parceria com MBWay
                </p>

                {/* Verification Steps */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    currentStep >= 1 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">Submeta o número</p>
                      <p className="text-gray-600 text-xs">Introduza o seu número MBWay</p>
                      {currentStep === 1 && (
                        <div className="mt-3 space-y-2">
                          <Input
                            type="tel"
                            placeholder="+351 9XX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="text-sm"
                          />
                          <Button 
                            onClick={handlePhoneSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          >
                            Submeter
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    currentStep >= 2 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= 2 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">Confirme no MBWay</p>
                      <p className="text-gray-600 text-xs">
                        Receberá notificação de <span className="font-semibold">0,00€</span> para verificar
                      </p>
                      {currentStep === 2 && (
                        <div className="mt-3">
                          <Button 
                            onClick={handleConfirmMBWay}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
                          >
                            Confirmar MBWay
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    currentStep >= 3 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">Receba os 50€</p>
                      <p className="text-gray-600 text-xs">Bónus creditado automaticamente</p>
                      {currentStep === 3 && (
                        <div className="mt-3">
                          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-semibold">
                            ✅ Bónus creditado com sucesso!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="mt-6 flex items-center text-xs text-gray-500">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Verificação oficial MBWay • 100% seguro
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;