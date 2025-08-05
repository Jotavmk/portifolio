<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Função para verificar se usuário está logado
function isLoggedIn() {
    session_start();
    return isset($_SESSION['user_id']);
}

// Função para verificar se o usuário é o autor do comentário
function isCommentAuthor($commentId, $userId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT user_id FROM comments WHERE id = ?");
        $stmt->execute([$commentId]);
        $comment = $stmt->fetch();
        
        if (!$comment) {
            return false;
        }
        
        // Se o comentário não tem user_id (comentário anônimo), ninguém pode deletar
        if ($comment['user_id'] === null) {
            return false;
        }
        
        return $comment['user_id'] == $userId;
    } catch (PDOException $e) {
        return false;
    }
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

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || empty($input['id'])) {
        echo json_encode([
            'success' => false,
            'error' => 'ID do comentário é obrigatório'
        ]);
        exit;
    }
    
    $commentId = intval($input['id']);
    $userId = null;
    
    // Verificar se usuário está logado via sessão ou via JSON
    if (isLoggedIn()) {
        $userId = $_SESSION['user_id'];
    } elseif (isset($input['user_id']) && !empty($input['user_id'])) {
        $userId = intval($input['user_id']);
    }
    
    if (!$userId) {
        echo json_encode([
            'success' => false,
            'error' => 'Você precisa estar logado para apagar depoimentos'
        ]);
        exit;
    }
    
    // Verificar se o usuário é administrador ou autor do comentário
    $isAdmin = isAdmin($userId);
    $isAuthor = isCommentAuthor($commentId, $userId);
    
    if (!$isAdmin && !$isAuthor) {
        echo json_encode([
            'success' => false,
            'error' => 'Você só pode apagar seus próprios depoimentos'
        ]);
        exit;
    }
    
    try {
        // Verificar se o comentário existe
        $stmt = $pdo->prepare("SELECT id FROM comments WHERE id = ?");
        $stmt->execute([$commentId]);
        
        if (!$stmt->fetch()) {
            echo json_encode([
                'success' => false,
                'error' => 'Comentário não encontrado'
            ]);
            exit;
        }
        
        // Deletar o comentário
        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
        $result = $stmt->execute([$commentId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Comentário deletado com sucesso'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao deletar comentário'
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