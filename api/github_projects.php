<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Configuração do GitHub API
$username = 'Jotavmk'; // Seu username do GitHub
$api_url = "https://api.github.com/users/{$username}/repos";

// Função para fazer requisição ao GitHub API
function fetchGitHubProjects($url) {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => [
                'User-Agent: PHP',
                'Accept: application/vnd.github.v3+json'
            ]
        ]
    ]);
    
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        return null;
    }
    
    return json_decode($response, true);
}

// Função para determinar ícone baseado no nome do projeto
function getProjectIcon($projectName) {
    $name = strtolower($projectName);
    
    if (strpos($name, 'portfolio') !== false || strpos($name, 'portifolio') !== false) {
        return 'fas fa-user-tie';
    } elseif (strpos($name, 'lar') !== false || strpos($name, 'idosos') !== false) {
        return 'fas fa-home';
    } elseif (strpos($name, 'adv') !== false || strpos($name, 'advogado') !== false) {
        return 'fas fa-gavel';
    } elseif (strpos($name, 'calculadora') !== false || strpos($name, 'calculator') !== false) {
        return 'fas fa-calculator';
    } elseif (strpos($name, 'carro') !== false || strpos($name, 'car') !== false || strpos($name, 'mostruario') !== false) {
        return 'fas fa-car';
    } elseif (strpos($name, 'loja') !== false || strpos($name, 'store') !== false) {
        return 'fas fa-store';
    } elseif (strpos($name, 'site') !== false || strpos($name, 'web') !== false) {
        return 'fas fa-globe';
    } elseif (strpos($name, 'app') !== false || strpos($name, 'mobile') !== false) {
        return 'fas fa-mobile-alt';
    } else {
        return 'fas fa-code';
    }
}

// Função para determinar tecnologias baseado no nome e descrição
function getProjectTech($projectName, $description, $language) {
    $tech = [];
    $name = strtolower($projectName);
    $desc = strtolower($description);
    
    // Detectar tecnologias baseado no nome e descrição
    if (strpos($name, 'django') !== false || strpos($desc, 'django') !== false) {
        $tech[] = 'Django';
    }
    if (strpos($name, 'python') !== false || strpos($desc, 'python') !== false || $language === 'Python') {
        $tech[] = 'Python';
    }
    if (strpos($name, 'js') !== false || strpos($desc, 'javascript') !== false || $language === 'JavaScript') {
        $tech[] = 'JavaScript';
    }
    if (strpos($name, 'html') !== false || strpos($desc, 'html') !== false) {
        $tech[] = 'HTML5';
    }
    if (strpos($name, 'css') !== false || strpos($desc, 'css') !== false) {
        $tech[] = 'CSS3';
    }
    if (strpos($name, 'react') !== false || strpos($desc, 'react') !== false) {
        $tech[] = 'React';
    }
    if (strpos($name, 'node') !== false || strpos($desc, 'node') !== false) {
        $tech[] = 'Node.js';
    }
    
    // Se não encontrou tecnologias específicas, usar a linguagem principal
    if (empty($tech) && $language) {
        $tech[] = $language;
    }
    
    // Fallback para tecnologias básicas
    if (empty($tech)) {
        $tech = ['HTML5', 'CSS3', 'JavaScript'];
    }
    
    return array_slice($tech, 0, 4); // Máximo 4 tecnologias
}

// Função para gerar URL de demo baseado no nome do projeto
function getDemoUrl($projectName) {
    $name = strtolower($projectName);
    
    // Mapeamento de projetos conhecidos
    $demoUrls = [
        'portifolio' => 'https://portifolio-drab-delta.vercel.app',
        'portfolio' => 'https://portifolio-drab-delta.vercel.app',
        'lar_de_idosos' => 'https://lar-de-idosos.vercel.app',
        'lar-de-idosos' => 'https://lar-de-idosos.vercel.app',
        'adv_lp' => 'https://adv-lp-one.vercel.app',
        'adv-lp' => 'https://adv-lp-one.vercel.app',
        'calculadora_django' => 'https://calculadora-django.vercel.app',
        'calculadora-django' => 'https://calculadora-django.vercel.app',
        'mostruario_de_carros_django' => 'https://mostruario-de-carros-django.vercel.app',
        'mostruario-de-carros-django' => 'https://mostruario-de-carros-django.vercel.app',
        'loja_de_veiculos_js' => null, // Sem demo
        'loja-de-veiculos-js' => null // Sem demo
    ];
    
    // Debug: log para verificar se o projeto está sendo encontrado
    error_log("Checking demo URL for project: " . $name);
    if (isset($demoUrls[$name])) {
        error_log("Found demo URL: " . $demoUrls[$name]);
    } else {
        error_log("No demo URL found for: " . $name);
    }
    
    return $demoUrls[$name] ?? null;
}

try {
    // Buscar projetos do GitHub
    $projects = fetchGitHubProjects($api_url);
    
    if (!$projects) {
        throw new Exception('Erro ao buscar projetos do GitHub');
    }
    
    // Filtrar e formatar projetos
    $formattedProjects = [];
    
    foreach ($projects as $project) {
        // Pular projetos privados ou forks
        if ($project['private'] || $project['fork']) {
            continue;
        }
        
        // Pular projetos muito antigos ou sem atividade
        $lastUpdate = new DateTime($project['updated_at']);
        $now = new DateTime();
        $diff = $now->diff($lastUpdate);
        
        // Pular projetos não atualizados há mais de 2 anos
        if ($diff->y > 2) {
            continue;
        }
        
        $demoUrl = getDemoUrl($project['name']);
        
        // Debug: log para verificar se o demo_url está sendo encontrado
        error_log("Project: " . $project['name'] . " -> Demo URL: " . ($demoUrl ?: 'null'));
        
        $formattedProject = [
            'name' => $project['name'],
            'title' => ucwords(str_replace(['_', '-'], ' ', $project['name'])),
            'description' => $project['description'] ?: 'Projeto desenvolvido com as melhores práticas e tecnologias modernas.',
            'github_url' => $project['html_url'],
            'demo_url' => $demoUrl,
            'language' => $project['language'],
            'icon' => getProjectIcon($project['name']),
            'tech' => getProjectTech($project['name'], $project['description'], $project['language']),
            'updated_at' => $project['updated_at'],
            'stars' => $project['stargazers_count'],
            'forks' => $project['forks_count']
        ];
        
        $formattedProjects[] = $formattedProject;
    }
    
    // Ordenar por data de atualização (mais recentes primeiro)
    usort($formattedProjects, function($a, $b) {
        return strtotime($b['updated_at']) - strtotime($a['updated_at']);
    });
    
    // Limitar a 6 projetos mais recentes
    $formattedProjects = array_slice($formattedProjects, 0, 6);
    
    echo json_encode([
        'success' => true,
        'projects' => $formattedProjects,
        'count' => count($formattedProjects),
        'last_updated' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 