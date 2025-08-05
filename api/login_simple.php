<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'error' => 'Dados inválidos'
        ]);
        exit;
    }
    
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        echo json_encode([
            'success' => false,
            'error' => 'Usuário e senha são obrigatórios'
        ]);
        exit;
    }
    
    try {
        // Verificar se o usuário existe
        $stmt = $pdo->prepare("SELECT id, username, email, password FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user) {
            echo json_encode([
                'success' => false,
                'error' => 'Usuário não encontrado'
            ]);
            exit;
        }
        
        // Verificar senha
        if (password_verify($password, $user['password'])) {
            // Iniciar sessão
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            
            echo json_encode([
                'success' => true,
                'message' => 'Login realizado com sucesso',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Senha incorreta'
            ]);
        }
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Erro no banco de dados: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido'
    ]);
}
?> 