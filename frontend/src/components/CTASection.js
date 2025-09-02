import React from 'react';
import { Button } from './ui/button';
import { Zap, Star, Shield, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CTASection = () => {
  const { toast } = useToast();

  const handleJoinAction = () => {
    toast({
      title: "Junte-se à Ação!",
      description: "Registe-se agora e receba o seu bónus de 50€!",
      duration: 3000
    });
  };

  const stats = [
    { icon: Users, value: '100K+', label: 'Jogadores ativos' },
    { icon: Star, value: '500+', label: 'Jogos disponíveis' },
    { icon: Shield, value: '100%', label: 'Seguro e licenciado' },
    { icon: Zap, value: '24/7', label: 'Suporte disponível' }
  ];

  return (
    <>
      {/* Main CTA Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-16 lg:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Junte-se à Ação
          </h2>
          
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Milhares de jogadores já aproveitaram esta oferta exclusiva. 
            Não perca a oportunidade de ganhar o seu bónus de 50€ grátis!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleJoinAction}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Registar e Reclamar 50€
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={() => toast({
                title: "Mais Informações",
                description: "Consulte os termos e condições da oferta",
                duration: 3000
              })}
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              Ver mais ofertas
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-red-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="bg-red-600 text-white px-4 py-2 rounded font-bold text-lg inline-block mb-4">
                Betclic
              </div>
              <p className="text-gray-400 text-sm mb-4">
                A sua plataforma de apostas e casino online de confiança.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <span className="text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <span className="text-xs font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <span className="text-xs font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Sports */}
            <div>
              <h4 className="font-semibold text-white mb-4">Desportos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-400 transition-colors">Futebol</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Ténis</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Basquetebol</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Apostas ao Vivo</a></li>
              </ul>
            </div>

            {/* Casino */}
            <div>
              <h4 className="font-semibold text-white mb-4">Casino</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-400 transition-colors">Slots</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Blackjack</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Roleta</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Casino ao Vivo</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-400 transition-colors">Centro de Ajuda</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Chat ao Vivo</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Jogo Responsável</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Contactos</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Betclic. Todos os direitos reservados. | Jogue com responsabilidade | +18</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTASection;