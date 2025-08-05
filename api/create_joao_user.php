<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    // Verificar se o usuário já existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = 'joao' OR email = 'joaovictor4@gmail.com'");
    $stmt->execute();
    $existingUser = $stmt->fetch();
    
    if ($existingUser) {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário joao ou email joaovictor4@gmail.com já existe',
            'credentials' => [
                'username' => 'joao',
                'email' => 'joaovictor4@gmail.com',
                'password' => 'Jvml#3000990'
            ]
        ]);
    } else {
        // Criar hash da senha
        $hashedPassword = password_hash('Jvml#3000990', PASSWORD_DEFAULT);
        
        // Primeiro, adicionar a coluna is_admin se ela não existir
        try {
            $pdo->exec("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0");
        } catch (PDOException $e) {
            // Coluna já existe, ignorar erro
        }
        
        // Inserir o novo usuário
        $stmt = $pdo->prepare("
            INSERT INTO users (username, email, password, is_admin) 
            VALUES (?, ?, ?, 1)
        ");
        $stmt->execute(['joao', 'joaovictor4@gmail.com', $hashedPassword]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuário joao criado com sucesso como administrador',
            'credentials' => [
                'username' => 'joao',
                'email' => 'joaovictor4@gmail.com',
                'password' => 'Jvml#3000990',
                'is_admin' => true
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