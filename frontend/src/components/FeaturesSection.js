import React from 'react';
import { Card, CardContent } from './ui/card';
import { Gamepad2, TrendingUp, Zap, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Slots Premium',
      description: 'Use o seu bónus de 50€ nos melhores slots online',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: TrendingUp,
      title: 'Apostas Desportivas',
      description: 'Aposte nos seus desportos favoritos com o bónus',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Zap,
      title: 'Processamento Rápido',
      description: 'Bónus creditado em até 15 minutos na sua conta',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Plataforma licenciada e regulamentada',
      color: 'bg-red-50 text-red-600'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Porquê Escolher Esta Oferta?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desfrute da melhor experiência de apostas com benefícios exclusivos
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
            >
              <CardContent className="p-8 text-center">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;