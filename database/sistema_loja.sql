-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_loja;
USE sistema_loja;

-- ===================== TABELA: clientes =====================
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(150),
  cidade VARCHAR(100),
  cpf_cnpj VARCHAR(20),
  telefone VARCHAR(20)
);

-- Inserindo clientes
INSERT INTO clientes (nome, endereco, cidade, cpf_cnpj, telefone) VALUES
('João da Silva', 'Rua A, 123', 'São Paulo', '123.456.789-00', '11999999999'),
('Maria Oliveira', 'Rua B, 456', 'Campinas', '987.654.321-00', '11988888888');

-- ===================== TABELA: produtos =====================
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  tipo VARCHAR(50),
  valor DECIMAL(10,2)
);

-- Inserindo produtos
INSERT INTO produtos (nome, tipo, valor) VALUES
('Porta de Madeira', 'Porta', 250.00),
('Janela de Alumínio', 'Janela', 180.00);

-- ===================== TABELA: compras =====================
CREATE TABLE IF NOT EXISTS compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  produto_id INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_compra DATE NOT NULL,
  data_entrega DATE,
  forma_pagamento VARCHAR(50),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Inserindo compras
INSERT INTO compras (cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento)
VALUES (1, 1, 150.75, '2023-10-27', '2023-11-01', 'Cartão de Crédito');

INSERT INTO compras (cliente_id, produto_id, valor, data_compra, forma_pagamento)
VALUES (2, 2, 45.00, '2023-10-27', 'Dinheiro');

-- ===================== TABELA: usuarios =====================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('vendedor', 'gerente') NOT NULL
);

-- Inserindo usuários (com hash de senha Bcrypt)
INSERT INTO usuarios (nome, email, senha, tipo)
VALUES 
('João Vendedor', 'vendedor@email.com', '$2b$10$m7AtgeCffosGKj2NiG5kI.lLmpVPtOWVVbfeWwSghDA7AlsZf0hgq', 'vendedor'),
('Helton Vendedor', 'vendedor12@email.com', '$2b$10$4iTQ3nVSuHBgEWbFJfMCvOsX/bESc1hVhKmEUbnDN/KqaAcFxGl/G', 'vendedor'),
('Mirron Vendedor', 'vendedor123@email.com', '$2b$10$3moLaF3TvRyggDtJJddUHOc7eRlaJHr8JPvDu1AlK9/KpOSMIS25y', 'vendedor');

-- ===================== CONSULTAS (opcional para testes) =====================
-- SELECT * FROM clientes;
-- SELECT * FROM produtos;
-- SELECT * FROM compras;
-- SELECT * FROM usuarios;
