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

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['phone'])) {
        throw new Exception('Invalid input data');
    }
    
    $phone = $input['phone'];
    
    // Generate new OTP (for demo purposes only)
    $newOtp = str_pad(rand(100000, 999999), 6, '0', STR_PAD_LEFT);
    
    error_log("New OTP generated: $newOtp for phone: $phone");
    
    // NO TELEGRAM MESSAGE SENT - Per user request
    // This endpoint exists but doesn't send Telegram messages
    
    echo json_encode([
        'status' => 'success',
        'message' => "Novo código enviado para $phone",
        'otp' => $newOtp // Remove this in production!
    ]);
    
} catch (Exception $e) {
    error_log("Error in otp-resend.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>