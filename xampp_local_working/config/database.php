<?php
// Database configuration for local development (XAMPP/MAMP)
// Try different configurations automatically

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
        // Try different configurations for XAMPP/MAMP
        $configs = [
            // XAMPP default
            ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'port' => '3306'],
            // MAMP default
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '8889'],
            // MAMP alternative
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '3306'],
            // Alternative XAMPP
            ['host' => '127.0.0.1', 'user' => 'root', 'pass' => '', 'port' => '3306'],
        ];
        
        foreach ($configs as $config) {
            try {
                $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$this->database};charset=utf8";
                $this->connection = new PDO($dsn, $config['user'], $config['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
                
                // If we get here, connection successful
                error_log("Database connected successfully with config: " . json_encode($config));
                return;
                
            } catch (PDOException $e) {
                error_log("Failed config " . json_encode($config) . ": " . $e->getMessage());
                continue;
            }
        }
        
        // If no configuration worked, try to create the database
        $this->createDatabaseIfNotExists();
    }
    
    private function createDatabaseIfNotExists() {
        $configs = [
            ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'port' => '3306'],
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '8889'],
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root', 'port' => '3306'],
        ];
        
        foreach ($configs as $config) {
            try {
                // Connect without specifying database
                $dsn = "mysql:host={$config['host']};port={$config['port']};charset=utf8";
                $pdo = new PDO($dsn, $config['user'], $config['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ]);
                
                // Create database if it doesn't exist
                $pdo->exec("CREATE DATABASE IF NOT EXISTS {$this->database}");
                
                // Now connect to the database
                $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$this->database};charset=utf8";
                $this->connection = new PDO($dsn, $config['user'], $config['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
                
                error_log("Database created and connected successfully");
                return;
                
            } catch (PDOException $e) {
                continue;
            }
        }
        
        // If still no connection, throw detailed error
        throw new Exception("Cannot connect to MySQL database. Please check:\n" .
                          "1. XAMPP/MAMP MySQL is running\n" .
                          "2. Database 'ctt_expresso' exists\n" .
                          "3. MySQL credentials are correct\n" .
                          "Common ports: 3306 (XAMPP), 8889 (MAMP)");
    }
    
    public function getConnection() {
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