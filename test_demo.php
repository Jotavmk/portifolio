<?php
// Teste simples para verificar a API de projetos
$api_url = 'http://localhost/sitejv/api/github_projects.php';

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: PHP Test',
            'Accept: application/json'
        ]
    ]
]);

$response = file_get_contents($api_url, false, $context);

if ($response === false) {
    echo "Erro ao acessar a API\n";
} else {
    $data = json_decode($response, true);
    
    if ($data && isset($data['projects'])) {
        echo "Projetos encontrados: " . count($data['projects']) . "\n\n";
        
        foreach ($data['projects'] as $project) {
            echo "Nome: " . $project['name'] . "\n";
            echo "Demo URL: " . ($project['demo_url'] ?: 'null') . "\n";
            echo "---\n";
        }
    } else {
        echo "Erro na resposta da API: " . $response . "\n";
    }
}
?> 