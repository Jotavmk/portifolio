<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

try {
    // Verificar se o usuário de teste já existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = 'teste'");
    $stmt->execute();
    $existingUser = $stmt->fetch();
    
    if ($existingUser) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuário de teste já existe',
            'credentials' => [
                'username' => 'teste',
                'password' => '123456'
            ]
        ]);
    } else {
        // Criar usuário de teste
        $hashedPassword = password_hash('123456', PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("
            INSERT INTO users (username, email, password) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute(['teste', 'teste@example.com', $hashedPassword]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuário de teste criado com sucesso',
            'credentials' => [
                'username' => 'teste',
                'password' => '123456'
            ]
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao criar usuário: ' . $e->getMessage()
    ]);
}
?> 