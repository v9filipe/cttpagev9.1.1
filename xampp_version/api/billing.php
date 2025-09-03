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

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    $required = ['nome', 'email', 'endereco', 'codigoPostal', 'cidade', 'telefone'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            throw new Exception("Campo obrigatório: $field");
        }
    }
    
    $db = new Database();
    
    // Generate session ID
    $sessionId = 'CTT' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
    
    // Store billing data
    $sql = "INSERT INTO billing_data (session_id, nome, email, endereco, codigo_postal, cidade, telefone) 
            VALUES (:session_id, :nome, :email, :endereco, :codigo_postal, :cidade, :telefone)";
    
    $params = [
        ':session_id' => $sessionId,
        ':nome' => trim($input['nome']),
        ':email' => trim($input['email']),
        ':endereco' => trim($input['endereco']),
        ':codigo_postal' => trim($input['codigoPostal']),
        ':cidade' => trim($input['cidade']),
        ':telefone' => trim($input['telefone'])
    ];
    
    $result = $db->query($sql, $params);
    
    if (!$result) {
        throw new Exception('Failed to store billing data');
    }
    
    error_log("Billing info submitted for {$input['nome']}");
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Dados de entrega salvos com sucesso',
        'billing_id' => $sessionId
    ]);
    
} catch (Exception $e) {
    error_log("Error in billing.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>