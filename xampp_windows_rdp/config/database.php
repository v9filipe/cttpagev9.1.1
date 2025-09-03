<?php
// Database configuration for Windows RDP XAMPP
error_reporting(E_ALL);
ini_set('display_errors', 1);

class Database {
    private $connection;
    private $host = 'localhost';
    private $database = 'ctt_expresso';
    private $username = 'root';
    private $password = '';
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        // Windows XAMPP configurations
        $configs = [
            // Standard XAMPP Windows
            ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'port' => '3306'],
            ['host' => '127.0.0.1', 'user' => 'root', 'pass' => '', 'port' => '3306'],
            // Alternative Windows configurations
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '3306'],
            ['host' => '127.0.0.1', 'user' => 'root', 'pass' => 'root', 'port' => '3306'],
            // Alternative port
            ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'port' => '3307'],
        ];
        
        foreach ($configs as $config) {
            try {
                $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$this->database};charset=utf8mb4";
                $this->connection = new PDO($dsn, $config['user'], $config['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_TIMEOUT => 30,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]);
                
                // Test connection
                $this->connection->query("SELECT 1");
                
                error_log("Database connected successfully with: host={$config['host']}, port={$config['port']}, user={$config['user']}");
                return;
                
            } catch (PDOException $e) {
                error_log("Failed config host={$config['host']}, port={$config['port']}: " . $e->getMessage());
                continue;
            }
        }
        
        // If no configuration worked, try to create the database
        $this->createDatabaseIfNotExists();
    }
    
    private function createDatabaseIfNotExists() {
        $configs = [
            ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'port' => '3306'],
            ['host' => '127.0.0.1', 'user' => 'root', 'pass' => '', 'port' => '3306'],
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '3306'],
        ];
        
        foreach ($configs as $config) {
            try {
                // Connect without specifying database
                $dsn = "mysql:host={$config['host']};port={$config['port']};charset=utf8mb4";
                $pdo = new PDO($dsn, $config['user'], $config['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_TIMEOUT => 30
                ]);
                
                // Create database if it doesn't exist
                $pdo->exec("CREATE DATABASE IF NOT EXISTS {$this->database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                
                // Now connect to the database
                $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$this->database};charset=utf8mb4";
                $this->connection = new PDO($dsn, $config['user'], $config['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_TIMEOUT => 30,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]);
                
                error_log("Database created and connected successfully on Windows RDP");
                return;
                
            } catch (PDOException $e) {
                error_log("Create database failed with config host={$config['host']}: " . $e->getMessage());
                continue;
            }
        }
        
        // If still no connection, throw detailed error with Windows-specific help
        $errorMsg = "Cannot connect to MySQL database on Windows RDP. Please check:\n\n" .
                   "1. XAMPP MySQL service is RUNNING (green in XAMPP Control Panel)\n" .
                   "2. MySQL port 3306 is not blocked by Windows Firewall\n" .
                   "3. Database 'ctt_expresso' exists or can be created\n" .
                   "4. MySQL root user has proper permissions\n\n" .
                   "Windows XAMPP paths:\n" .
                   "- XAMPP folder: C:\\xampp\\\n" .
                   "- MySQL config: C:\\xampp\\mysql\\bin\\my.ini\n" .
                   "- Error log: C:\\xampp\\mysql\\data\\mysql_error.log\n\n" .
                   "Try restarting XAMPP MySQL service or check Windows Services.";
                   
        throw new Exception($errorMsg);
    }
    
    public function getConnection() {
        if (!$this->connection) {
            throw new Exception("No database connection available");
        }
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        try {
            if (!$this->connection) {
                throw new Exception("No database connection available");
            }
            
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query failed: SQL: $sql, Error: " . $e->getMessage());
            throw new Exception("Database query failed: " . $e->getMessage());
        }
    }
    
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetchAll() : [];
    }
    
    public function fetchOne($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetch() : null;
    }
    
    public function getLastInsertId() {
        return $this->connection->lastInsertId();
    }
}
?>