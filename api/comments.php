<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Função para verificar se usuário está logado
function isLoggedIn() {
    session_start();
    return isset($_SESSION['user_id']);
}

// GET - Listar comentários
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;
        
        // Buscar comentários com informações do usuário (se logado)
        $stmt = $pdo->prepare("
            SELECT 
                c.id,
                c.name,
                c.email,
                c.rating,
                c.message,
                c.created_at,
                c.user_id,
                u.username as user_username
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
            LIMIT $limit OFFSET $offset
        ");
        $stmt->execute();
        $comments = $stmt->fetchAll();
        
        // Contar total de comentários
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM comments");
        $stmt->execute();
        $total = $stmt->fetch()['total'];
        
        echo json_encode([
            'success' => true,
            'comments' => $comments,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erro interno do servidor: ' . $e->getMessage()
        ]);
    }
}

// POST - Criar novo comentário
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }
    
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $rating = (int)($input['rating'] ?? 0);
    $message = trim($input['message'] ?? '');
    $userId = null;
    
    // Se usuário está logado, usar dados da sessão
    if (isLoggedIn()) {
        $userId = $_SESSION['user_id'];
        $name = $_SESSION['username'];
        $email = $_SESSION['email'] ?? $email; // Usar email da sessão se disponível
        
        error_log("Usuário logado - ID: $userId, Nome: $name, Email: $email");
    } else {
        error_log("Usuário não logado - comentário anônimo");
    }
    
    // Validações
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nome, email e mensagem são obrigatórios']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email inválido']);
        exit;
    }
    
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Avaliação deve ser entre 1 e 5']);
        exit;
    }
    
    if (strlen($message) < 10) {
        http_response_code(400);
        echo json_encode(['error' => 'Mensagem deve ter pelo menos 10 caracteres']);
        exit;
    }
    
    try {
        // Inserir comentário
        $stmt = $pdo->prepare("
            INSERT INTO comments (user_id, name, email, rating, message) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $name, $email, $rating, $message]);
        
        $commentId = $pdo->lastInsertId();
        
        error_log("Comentário criado - ID: $commentId, User ID: $userId");
        
        echo json_encode([
            'success' => true,
            'message' => 'Comentário enviado com sucesso',
            'comment_id' => $commentId,
            'user_id' => $userId
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro interno do servidor: ' . $e->getMessage()]);
    }
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
?> 