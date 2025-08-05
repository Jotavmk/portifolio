<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

try {
    // Verificar se o usuário "jota" existe
    $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE username = 'jota'");
    $stmt->execute();
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário "jota" não encontrado'
        ]);
        exit;
    }
    
    // Verificar comentários deste usuário
    $stmt = $pdo->prepare("
        SELECT id, name, user_id, message, created_at 
        FROM comments 
        WHERE user_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$user['id']]);
    $comments = $stmt->fetchAll();
    
    // Verificar todos os comentários
    $stmt = $pdo->prepare("
        SELECT id, name, user_id, message, created_at 
        FROM comments 
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $allComments = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'user_comments' => $comments,
        'all_comments' => $allComments,
        'message' => 'Dados verificados'
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro no banco: ' . $e->getMessage()
    ]);
}
?> 