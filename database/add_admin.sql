-- Adicionar coluna is_admin na tabela users
ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0;

-- Definir o usuário 'jota' como administrador
UPDATE users SET is_admin = 1 WHERE username = 'jota';

-- Definir o usuário 'teste' como administrador também (opcional)
UPDATE users SET is_admin = 1 WHERE username = 'teste';

-- Verificar se foi aplicado corretamente
SELECT id, username, is_admin FROM users; 