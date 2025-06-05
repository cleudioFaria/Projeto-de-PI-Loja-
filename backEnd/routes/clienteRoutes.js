// const express = require('express');
// const router = express.Router();
// const clienteController = require('../controllers/clienteController');

// router.get('/', clienteController.listarClientes);

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// 🔍 Listar todos os clientes
router.get('/', authMiddleware, (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// 🔍 Buscar cliente por ID
router.get('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    res.json(results[0]);
  });
});

// 📝 Criar cliente
router.post('/', authMiddleware, (req, res) => {
  const { nome, telefone, endereco, cidade, cpf_cnpj } = req.body;
  db.query('INSERT INTO clientes (nome, telefone, endereco, cidade, cpf_cnpj) VALUES (?, ?, ?, ?, ?)', [nome, telefone, endereco, cidade, cpf_cnpj], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso', id: result.insertId });
  });
});

// ✏️ Atualizar cliente
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { nome, telefone, endereco, cidade, cpf_cnpj } = req.body;
  db.query('UPDATE clientes SET nome = ?, telefone = ?, endereco = ?, cidade = ?, cpf_cnpj = ? WHERE id = ?', [nome, telefone, endereco, cidade, cpf_cnpj, id], (err) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Cliente atualizado com sucesso' });
  });
});

// 🗑️ Deletar cliente
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  });
});

module.exports = router;
