-- Adicionar coluna is_admin na tabela users (se não existir)
ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0;

-- Criar o usuário joao com as credenciais especificadas
-- Senha: Jvml#3000990 (hash gerado com password_hash)
INSERT INTO users (username, email, password, is_admin) 
VALUES ('joao', 'joaovictor4@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- Verificar se foi criado corretamente
SELECT id, username, email, is_admin FROM users WHERE username = 'joao'; 