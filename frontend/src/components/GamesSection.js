import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, Star } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const GamesSection = () => {
  const { toast } = useToast();

  const handleSportsClick = () => {
    toast({
      title: "Apostas Desportivas",
      description: "Futebol, Ténis, Basquetebol e muito mais!",
      duration: 3000
    });
  };

  const handleCasinoClick = () => {
    toast({
      title: "Casino & Slots",
      description: "Centenas de slots e jogos de mesa disponíveis!",
      duration: 3000
    });
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Apostas e Casino de Classe Mundial
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desfrute da melhor seleção de desportos e jogos de casino com o seu bónus de 50€
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Sports Betting Card */}
          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              {/* Sports Image Background */}
              <div className="h-64 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Apostas Desportivas</h3>
                    <p className="text-green-100">Futebol, Ténis, Basquetebol e muito mais</p>
                  </div>
                </div>
                
                {/* Live Odds Badge */}
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Odds competitivas ao vivo
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Apostas ao vivo com as melhores odds do mercado</h4>
                    <p className="text-sm text-gray-600">Transmissões ao vivo disponíveis</p>
                  </div>
                  <Button 
                    onClick={handleSportsClick}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Apostar
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Casino & Slots Card */}
          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              {/* Casino Image Background */}
              <div className="h-64 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Casino & Slots</h3>
                    <p className="text-orange-100">Centenas de slots e jogos de mesa</p>
                  </div>
                </div>
                
                {/* Jackpot Badge */}
                <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Jackpots progressivos
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Centenas de slots e jogos de mesa</h4>
                    <p className="text-sm text-gray-600">Jackpots progressivos</p>
                  </div>
                  <Button 
                    onClick={handleCasinoClick}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  >
                    Jogar
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Popular Games Preview */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Jogos Populares Esta Semana
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Book of Dead', 'Starburst', 'Gonzo\'s Quest', 
              'Sweet Bonanza', 'Big Bass Bonanza', 'Gates of Olympus'
            ].map((game, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => toast({
                  title: game,
                  description: "Jogo disponível com o seu bónus!",
                  duration: 2000
                })}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{game}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;