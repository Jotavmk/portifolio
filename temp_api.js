// Configuração da API
const API_BASE_URL = '/sitejv/api';

// Função para buscar comentários
async function getComments() {
    try {
        const response = await fetch(API_BASE_URL + '/test_comments.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Função para criar comentário
async function createComment(commentData) {
    try {
        const response = await fetch(API_BASE_URL + '/test_comments.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await getComments();
        console.log('Comentários carregados:', response);
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}); 