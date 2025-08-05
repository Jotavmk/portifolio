# Sistema de Comentários - Portfolio João Victor

Sistema completo de comentários com autenticação de usuários, desenvolvido em PHP/MySQL e pronto para deploy na Hostinger.

## 📁 Estrutura do Projeto

```
sitejv/
├── config/
│   └── database.php          # Configuração do banco de dados
├── database/
│   └── schema.sql            # Script SQL para criar as tabelas
├── api/
│   ├── register.php          # API para registro de usuários
│   ├── login.php             # API para login
│   ├── logout.php            # API para logout
│   └── comments.php          # API para gerenciar comentários
├── js/
│   ├── main.js               # JavaScript principal do portfolio
│   └── api.js                # JavaScript para gerenciar a API
├── css/
│   └── style.css             # Estilos do portfolio
├── index.html                # Página inicial
├── portfolio.html            # Portfolio principal
└── README.md                 # Esta documentação
```

## 🚀 Instalação na Hostinger

### 1. Configurar Banco de Dados

1. Acesse o **cPanel** da sua Hostinger
2. Vá em **phpMyAdmin**
3. Crie um novo banco de dados ou use um existente
4. Execute o script SQL em `database/schema.sql`

### 2. Configurar Conexão

1. Edite o arquivo `config/database.php`
2. Substitua as credenciais:

```php
define('DB_NAME', 'seu_banco_de_dados'); // Nome do seu banco
define('DB_USER', 'seu_usuario');        // Usuário do banco
define('DB_PASS', 'sua_senha');          // Senha do banco
```

### 3. Upload dos Arquivos

1. Faça upload de todos os arquivos para a raiz do seu domínio
2. Certifique-se de que a estrutura de pastas está correta
3. Verifique se o PHP está habilitado (geralmente já está na Hostinger)

## 🔧 Configuração

### Variáveis de Ambiente

O sistema usa as seguintes configurações padrão:

- **Host**: `localhost` (padrão da Hostinger)
- **Charset**: `utf8`
- **Timezone**: Configurado automaticamente pelo servidor

### Permissões de Arquivo

Certifique-se de que os arquivos têm as permissões corretas:
- Arquivos PHP: `644`
- Pastas: `755`

## 📊 Estrutura do Banco de Dados

### Tabela `users`
- `id` - ID único do usuário
- `username` - Nome de usuário único
- `email` - Email único
- `password` - Senha criptografada
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela `comments`
- `id` - ID único do comentário
- `user_id` - ID do usuário (opcional, para comentários anônimos)
- `name` - Nome do autor
- `email` - Email do autor
- `rating` - Avaliação (1-5 estrelas)
- `message` - Conteúdo do comentário
- `created_at` - Data de criação

## 🔌 APIs Disponíveis

### POST `/api/register.php`
Registra um novo usuário.

**Parâmetros:**
```json
{
    "username": "usuario123",
    "email": "usuario@email.com",
    "password": "senha123"
}
```

**Resposta:**
```json
{
    "success": true,
    "message": "Usuário registrado com sucesso",
    "user_id": 1
}
```

### POST `/api/login.php`
Faz login do usuário.

**Parâmetros:**
```json
{
    "email": "usuario@email.com",
    "password": "senha123"
}
```

**Resposta:**
```json
{
    "success": true,
    "message": "Login realizado com sucesso",
    "user": {
        "id": 1,
        "username": "usuario123",
        "email": "usuario@email.com"
    },
    "token": "abc123..."
}
```

### POST `/api/logout.php`
Faz logout do usuário.

**Resposta:**
```json
{
    "success": true,
    "message": "Logout realizado com sucesso"
}
```

### GET `/api/comments.php`
Lista comentários com paginação.

**Parâmetros:**
- `page` - Página atual (padrão: 1)
- `limit` - Itens por página (padrão: 10)

**Resposta:**
```json
{
    "success": true,
    "comments": [
        {
            "id": 1,
            "name": "João Silva",
            "email": "joao@email.com",
            "rating": 5,
            "message": "Excelente trabalho!",
            "created_at": "2024-01-15 10:30:00",
            "user_username": "joao123"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 25,
        "pages": 3
    }
}
```

### POST `/api/comments.php`
Cria um novo comentário.

**Parâmetros:**
```json
{
    "name": "João Silva",
    "email": "joao@email.com",
    "rating": 5,
    "message": "Excelente trabalho!"
}
```

**Resposta:**
```json
{
    "success": true,
    "message": "Comentário enviado com sucesso",
    "comment_id": 1
}
```

## 🛡️ Segurança

### Medidas Implementadas

1. **Hash de Senhas**: Usa `password_hash()` com `PASSWORD_DEFAULT`
2. **Prepared Statements**: Previne SQL Injection
3. **Validação de Input**: Validação rigorosa de todos os dados
4. **Escape HTML**: Previne XSS nos comentários
5. **CORS**: Headers configurados para requisições
6. **Sessões**: Gerenciamento seguro de sessões

### Validações

- **Email**: Formato válido
- **Senha**: Mínimo 6 caracteres
- **Rating**: Entre 1 e 5
- **Mensagem**: Mínimo 10 caracteres
- **Usuário/Email**: Únicos no sistema

## 🎨 Integração com o Frontend

### JavaScript

O arquivo `js/api.js` contém:

- Classe `CommentAPI` para gerenciar requisições
- Classe `CommentSystem` para gerenciar a interface
- Event listeners para formulários
- Renderização dinâmica de comentários

### CSS

Adicione estes estilos ao seu `css/style.css`:

```css
/* Estilos para mensagens */
.message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message.success {
    background-color: #28a745;
}

.message.error {
    background-color: #dc3545;
}

.message.info {
    background-color: #17a2b8;
}

/* Estilos para comentários */
.comment-item {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1rem;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.comment-rating .fas.fa-star.filled {
    color: #ffc107;
}

.comment-date {
    font-size: 0.9rem;
    opacity: 0.7;
}

.no-comments {
    text-align: center;
    padding: 2rem;
    opacity: 0.7;
}
```

## 🔍 Testando o Sistema

### 1. Teste de Conexão
Acesse `seu-dominio.com/api/comments.php` - deve retornar JSON com comentários.

### 2. Teste de Registro
Use o formulário de registro no portfolio ou teste via API.

### 3. Teste de Login
Faça login com um usuário registrado.

### 4. Teste de Comentários
Crie comentários logado e anonimamente.

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
- Verifique as credenciais em `config/database.php`
- Confirme se o banco existe no phpMyAdmin
- Verifique se o MySQL está ativo

### Erro 500
- Verifique os logs de erro do PHP
- Confirme se todos os arquivos foram uploadados
- Verifique as permissões dos arquivos

### CORS Errors
- Confirme se os headers estão corretos
- Verifique se o domínio está configurado corretamente

### Sessões não Funcionam
- Verifique se o PHP tem permissão para escrever em `/tmp`
- Confirme se as sessões estão habilitadas

## 📈 Próximos Passos

### Melhorias Sugeridas

1. **JWT Tokens**: Implementar autenticação JWT
2. **Rate Limiting**: Limitar requisições por IP
3. **Moderação**: Sistema de moderação de comentários
4. **Notificações**: Email de confirmação
5. **Recuperação de Senha**: Sistema de reset
6. **Upload de Imagens**: Permitir imagens nos comentários

### Deploy em Produção

1. Configure HTTPS
2. Ative backup automático do banco
3. Configure monitoramento de logs
4. Implemente cache se necessário
5. Configure CDN para assets estáticos

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique esta documentação
2. Consulte os logs de erro
3. Teste as APIs individualmente
4. Verifique a configuração do banco

---

**Desenvolvido para o Portfolio de João Victor**  
*Sistema completo e pronto para produção* 