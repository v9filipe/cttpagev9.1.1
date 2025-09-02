import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Package, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CTTConfirmation = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a realistic tracking number
    const generateTrackingNumber = () => {
      const prefix = 'RR';
      const middle = Math.floor(Math.random() * 900000000) + 100000000; // 9 digits
      const suffix = 'PT';
      return `${prefix}${middle}${suffix}`;
    };

    setTrackingNumber(generateTrackingNumber());
  }, []);

  const handleTrackPackage = () => {
    toast({
      title: "Redirecionando...",
      description: "A carregar página de rastreamento da encomenda",
      duration: 2000
    });
    
    setTimeout(() => {
      navigate('/tracking');
    }, 2000);
  };

  const handleSendEmail = () => {
    toast({
      title: "Email enviado!",
      description: "Receberá a confirmação no seu email em breve",
      duration: 3000
    });
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Recibo gerado",
      description: "O seu recibo de pagamento será descarregado em breve",
      duration: 3000
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pagamento realizado com sucesso!
        </h1>
        <p className="text-gray-600">
          A sua taxa alfandegária foi paga. A encomenda será entregue nos próximos dias úteis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Summary */}
        <Card className="shadow-lg border-0 rounded-lg">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Resumo do Pagamento
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Taxa alfandegária</span>
                <span className="font-semibold text-gray-900">€ 2,99</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Taxa de processamento</span>
                <span className="font-semibold text-gray-900">€ 0,00</span>
              </div>
              
              <div className="flex justify-between items-center py-2 font-bold text-lg">
                <span className="text-gray-900">Total pago</span>
                <span className="text-green-600">€ 2,99</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-800 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-medium">Pagamento confirmado às {new Date().toLocaleTimeString('pt-PT')}</span>
              </div>
            </div>

            <Button 
              onClick={handleDownloadReceipt}
              variant="outline" 
              className="w-full mt-4 border-red-600 text-red-600 hover:bg-red-50"
            >
              Descarregar recibo
            </Button>
          </CardContent>
        </Card>

        {/* Tracking Information */}
        <Card className="shadow-lg border-0 rounded-lg">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 text-red-600 mr-2" />
              Informações da Encomenda
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Número de rastreamento</div>
                <div className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                  {trackingNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Estado atual</div>
                  <div className="font-semibold text-orange-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Taxa paga - Em trânsito
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Entrega prevista</div>
                  <div className="font-semibold text-gray-900">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT')}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Endereço de entrega</div>
                <div className="font-semibold text-gray-900 flex items-start">
                  <MapPin className="w-4 h-4 mr-1 mt-0.5 text-gray-400" />
                  <div>
                    Rua das Flores, 123<br />
                    1000-100 Lisboa<br />
                    Portugal
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleTrackPackage}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
            >
              Rastrear encomenda
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 rounded-lg mt-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos passos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Confirmação por email</h3>
              <p className="text-sm text-gray-600 mb-3">
                Receberá um email de confirmação com todos os detalhes
              </p>
              <Button 
                onClick={handleSendEmail}
                variant="outline" 
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Reenviar email
              </Button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processamento</h3>
              <p className="text-sm text-gray-600 mb-3">
                A sua encomenda será processada e enviada em 24h
              </p>
              <div className="text-xs text-orange-600 font-medium">
                Em processamento
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contacto de entrega</h3>
              <p className="text-sm text-gray-600 mb-3">
                Será contactado antes da entrega
              </p>
              <div className="text-xs text-green-600 font-medium">
                +351 912 345 678
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="text-center mt-8">
        <div className="text-sm text-gray-600 mb-4">
          Precisa de ajuda? Contacte o nosso apoio ao cliente: 707 26 26 26
        </div>
        <div className="space-x-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/billing')}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Nova encomenda
          </Button>
          <Button 
            onClick={handleTrackPackage}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Ver rastreamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTTConfirmation;