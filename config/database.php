<?php
// Configuração do banco de dados para MySQL externo
define('DB_HOST', 'localhost');
define('DB_NAME', 'sitejv'); // Nome do banco criado
define('DB_USER', 'root'); // Usuário do seu MySQL
define('DB_PASS', 'root'); // Senha do seu MySQL

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Erro na conexão: " . $e->getMessage());
}
?> 