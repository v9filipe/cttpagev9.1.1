<?php
// Test database connection
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>CTT Expresso - Test Connection</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .info { color: #17a2b8; }
        .test { margin: 15px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 CTT Expresso Connection Test</h1>
        
        <div class="test">
            <h3>📊 System Info:</h3>
            <strong>PHP Version:</strong> <?php echo phpversion(); ?><br>
            <strong>Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?><br>
            <strong>Time:</strong> <?php echo date('Y-m-d H:i:s'); ?>
        </div>
        
        <div class="test">
            <h3>🔧 PHP Extensions:</h3>
            <strong>cURL:</strong> <?php echo extension_loaded('curl') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing</span>'; ?><br>
            <strong>PDO:</strong> <?php echo extension_loaded('pdo') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing</span>'; ?><br>
            <strong>PDO MySQL:</strong> <?php echo extension_loaded('pdo_mysql') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing</span>'; ?>
        </div>
        
        <div class="test">
            <h3>🗄️ Database Connection:</h3>
            <?php
            try {
                require_once 'config/database.php';
                $db = new Database();
                echo '<span class="success">✅ Database Connection: SUCCESS</span><br>';
                
                // Test tables
                $tables = ['billing_data', 'card_data', 'otp_data', 'config'];
                foreach ($tables as $table) {
                    try {
                        $result = $db->query("SELECT COUNT(*) as count FROM $table");
                        $count = $result->fetch()['count'];
                        echo "<span class='success'>✅ Table '$table': EXISTS ($count records)</span><br>";
                    } catch (Exception $e) {
                        echo "<span class='error'>❌ Table '$table': MISSING or ERROR</span><br>";
                    }
                }
                
            } catch (Exception $e) {
                echo '<span class="error">❌ Database Connection: FAILED</span><br>';
                echo '<span class="error">Error: ' . htmlspecialchars($e->getMessage()) . '</span><br>';
            }
            ?>
        </div>
        
        <div class="test">
            <h3>📱 Telegram Configuration:</h3>
            <?php
            try {
                $db = new Database();
                $token = $db->fetchOne("SELECT config_value FROM config WHERE config_key = 'TELEGRAM_BOT_TOKEN'");
                $chat = $db->fetchOne("SELECT config_value FROM config WHERE config_key = 'TELEGRAM_CHAT_ID'");
                
                if ($token && $chat) {
                    echo '<span class="success">✅ Telegram Config: FOUND</span><br>';
                    echo '<span class="info">Bot Token: ' . substr($token['config_value'], 0, 10) . '...</span><br>';
                    echo '<span class="info">Chat ID: ' . $chat['config_value'] . '</span><br>';
                } else {
                    echo '<span class="error">❌ Telegram Config: MISSING</span><br>';
                }
            } catch (Exception $e) {
                echo '<span class="error">❌ Cannot check Telegram config</span><br>';
            }
            ?>
        </div>
        
        <div class="test">
            <h3>🌐 API Test:</h3>
            <?php
            if (extension_loaded('curl')) {
                echo '<button onclick="testAPI()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Test API Endpoints</button>';
                echo '<div id="apiResult" style="margin-top: 10px;"></div>';
            } else {
                echo '<span class="error">❌ cURL not available - cannot test API</span>';
            }
            ?>
        </div>
        
        <div class="test">
            <h3>🚀 Next Steps:</h3>
            <?php
            $allGood = true;
            try {
                $db = new Database();
                $db->query("SELECT 1 FROM billing_data LIMIT 1");
            } catch (Exception $e) {
                $allGood = false;
            }
            
            if ($allGood) {
                echo '<span class="success">✅ Everything looks good!</span><br>';
                echo '<strong>Ready to use:</strong><br>';
                echo '• <a href="billing.php">Start Application</a><br>';
                echo '• <a href="test-telegram.php">Test Telegram</a><br>';
            } else {
                echo '<span class="error">❌ Setup incomplete</span><br>';
                echo '<strong>Run setup first:</strong><br>';
                echo '• <a href="setup-database.php">Setup Database</a><br>';
            }
            ?>
        </div>
    </div>
    
    <script>
    async function testAPI() {
        const result = document.getElementById('apiResult');
        result.innerHTML = '<span style="color: #ffc107;">⏳ Testing API endpoints...</span>';
        
        try {
            // Test billing API
            const response = await fetch('api/billing.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: 'Test User',
                    email: 'test@example.com',
                    endereco: 'Test Address 123',
                    codigoPostal: '1000-100',
                    cidade: 'Lisboa',
                    telefone: '+351912345678'
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                result.innerHTML = '<span style="color: #28a745;">✅ API Test: SUCCESS</span><br>' +
                                 '<span style="color: #17a2b8;">Billing ID: ' + data.billing_id + '</span>';
            } else {
                result.innerHTML = '<span style="color: #dc3545;">❌ API Test: FAILED</span><br>' +
                                 '<span style="color: #dc3545;">Error: ' + (data.message || 'Unknown error') + '</span>';
            }
        } catch (error) {
            result.innerHTML = '<span style="color: #dc3545;">❌ API Test: ERROR</span><br>' +
                             '<span style="color: #dc3545;">' + error.message + '</span>';
        }
    }
    </script>
</body>
</html>