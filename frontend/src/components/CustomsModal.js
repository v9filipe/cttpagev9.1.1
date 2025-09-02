import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Package } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CustomsModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const handlePayNow = () => {
    toast({
      title: "Pagamento de Taxa Aduaneira",
      description: "Redirecionando para o sistema de pagamento...",
      duration: 3000
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl border-0">
        <div className="flex flex-col items-center text-center p-6">
          {/* Package Icon */}
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-orange-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            A sua encomenda está na alfândega
          </h3>

          {/* Description */}
          <div className="text-gray-600 mb-6 space-y-3">
            <p className="text-sm leading-relaxed">
              Caro destinatário,
            </p>
            <p className="text-sm leading-relaxed">
              Recebeu esta mensagem para o informar de que a sua 
              encomenda proveniente do estrangeiro está sujeita a 
              taxas alfandegárias.
            </p>
            <p className="text-sm leading-relaxed font-medium">
              Pagar a taxa aduaneira de € 2,99 antes da entrega da 
              encomenda.
            </p>
          </div>

          {/* Pay Now Button */}
          <Button
            onClick={handlePayNow}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition-colors duration-200"
          >
            Pagar agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomsModal;