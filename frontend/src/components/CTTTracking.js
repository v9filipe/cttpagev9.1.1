import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Package, Truck, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CTTTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTracking, setCurrentTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const mockTrackingData = {
    trackingNumber: 'RR123456789PT',
    status: 'in_transit',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT'),
    sender: 'Amazon UK',
    recipient: 'João Silva',
    address: 'Rua das Flores, 123, 1000-100 Lisboa',
    weight: '0.8 kg',
    value: '€ 45.99',
    customsFee: '€ 2.99',
    events: [
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString('pt-PT'),
        status: 'paid',
        description: 'Taxa alfandegária paga - Encomenda liberada',
        location: 'Centro de Processamento, Lisboa',
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100'
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('pt-PT'),
        status: 'customs',
        description: 'Encomenda retida na alfândega - Taxa em atraso',
        location: 'Alfândega, Aeroporto de Lisboa',
        icon: AlertCircle,
        color: 'text-orange-600 bg-orange-100'
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString('pt-PT'),
        status: 'arrived',
        description: 'Encomenda chegou a Portugal',
        location: 'Aeroporto de Lisboa',
        icon: Package,
        color: 'text-blue-600 bg-blue-100'
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('pt-PT'),
        status: 'shipped',
        description: 'Encomenda enviada do país de origem',
        location: 'Centro de Distribuição, Reino Unido',
        icon: Truck,
        color: 'text-gray-600 bg-gray-100'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading current tracking if we have a tracking number from URL or storage
    const urlParams = new URLSearchParams(window.location.search);
    const trackingFromUrl = urlParams.get('tracking');
    
    if (trackingFromUrl) {
      setSearchTerm(trackingFromUrl);
      handleSearch(trackingFromUrl);
    } else {
      // Simulate having a current tracking
      setCurrentTracking(mockTrackingData);
    }
  }, []);

  const handleSearch = (trackingNumber = searchTerm) => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, introduza um número de rastreamento",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentTracking(mockTrackingData);
      setIsLoading(false);
      
      toast({
        title: "Encomenda encontrada",
        description: `Estado: ${getStatusText(mockTrackingData.status)}`,
        duration: 3000
      });
    }, 1500);
  };

  const getStatusText = (status) => {
    const statusMap = {
      'shipped': 'Enviada',
      'in_transit': 'Em trânsito',
      'customs': 'Na alfândega',
      'paid': 'Taxa paga',
      'out_for_delivery': 'Em entrega',
      'delivered': 'Entregue'
    };
    return statusMap[status] || 'Desconhecido';
  };

  const getStatusBadge = (status) => {
    const variants = {
      'shipped': 'default',
      'in_transit': 'secondary',
      'customs': 'destructive',
      'paid': 'default',
      'out_for_delivery': 'default',
      'delivered': 'default'
    };
    
    const colors = {
      'shipped': 'bg-gray-100 text-gray-800',
      'in_transit': 'bg-blue-100 text-blue-800',
      'customs': 'bg-orange-100 text-orange-800',
      'paid': 'bg-green-100 text-green-800',
      'out_for_delivery': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {getStatusText(status)}
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Section */}
      <Card className="shadow-lg border-0 rounded-lg mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 text-red-600 mr-2" />
            Rastreamento de Encomendas
          </h2>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Introduza o número de rastreamento (ex: RR123456789PT)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pesquisar
                </div>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Pesquisar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentTracking && (
        <>
          {/* Package Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="shadow-lg border-0 rounded-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 text-red-600 mr-2" />
                  Estado da Encomenda
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estado atual:</span>
                    {getStatusBadge(currentTracking.status)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entrega prevista:</span>
                    <span className="font-semibold text-gray-900">{currentTracking.estimatedDelivery}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Número de rastreamento</div>
                    <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                      {currentTracking.trackingNumber}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 rounded-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-2" />
                  Detalhes da Encomenda
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Remetente:</span>
                    <div className="font-semibold text-gray-900">{currentTracking.sender}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Destinatário:</span>
                    <div className="font-semibold text-gray-900">{currentTracking.recipient}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Endereço:</span>
                    <div className="font-semibold text-gray-900">{currentTracking.address}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 rounded-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  Informações Alfandegárias
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peso:</span>
                    <span className="font-semibold text-gray-900">{currentTracking.weight}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor declarado:</span>
                    <span className="font-semibold text-gray-900">{currentTracking.value}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa alfandegária:</span>
                    <span className="font-semibold text-green-600">{currentTracking.customsFee} ✓ Paga</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Timeline */}
          <Card className="shadow-lg border-0 rounded-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                Histórico de Rastreamento
              </h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {currentTracking.events.map((event, index) => (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${event.color}`}>
                        <event.icon className="w-5 h-5" />
                      </div>
                      
                      {/* Event content */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{event.description}</h4>
                          <time className="text-sm text-gray-500">{event.date}</time>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center mt-8">
            <div className="space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/confirmation')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Ver confirmação
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Notificações ativadas",
                    description: "Receberá atualizações por SMS e email",
                    duration: 3000
                  });
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Receber notificações
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 mt-4">
              Última atualização: {new Date().toLocaleString('pt-PT')}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CTTTracking;