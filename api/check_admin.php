<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Função para verificar se usuário está logado
function isLoggedIn() {
    session_start();
    return isset($_SESSION['user_id']);
}

// Função para verificar se o usuário é administrador
function isAdmin($userId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT is_admin FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return false;
        }
        
        return $user['is_admin'] == 1;
    } catch (PDOException $e) {
        return false;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'error' => 'Dados inválidos'
        ]);
        exit;
    }
    
    $userId = $input['user_id'] ?? null;
    
    if (!$userId) {
        echo json_encode([
            'success' => false,
            'error' => 'ID do usuário é obrigatório'
        ]);
        exit;
    }
    
    // Verificar se o usuário é administrador
    if (isAdmin($userId)) {
        echo json_encode([
            'success' => true,
            'is_admin' => true,
            'message' => 'Usuário é administrador'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'is_admin' => false,
            'message' => 'Usuário não é administrador'
        ]);
    }
    
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido'
    ]);
}
?> 