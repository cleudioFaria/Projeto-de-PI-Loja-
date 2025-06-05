// codigo antigo da routa de produtos //

// const express = require('express');
// const router = express.Router();
// const produtoController = require('../controllers/produtoController');

// router.get('/', produtoController.listarProdutos);
// router.post('/', produtoController.criarProduto);

// module.exports = router;

// ********************************************************************//



// // codigo novo protejendo as rotas com token no midaware ///
// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middlewares/authMiddleware');
// const produtoController = require('../controllers/produtoController');

// // Rota protegida com JWT
// router.post('/', authMiddleware, produtoController.criarProduto);
// router.get('/', authMiddleware, produtoController.listarProdutos);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middlewares/authMiddleware');
// const produtoController = require('../controllers/produtoController');

// // Rota protegida com JWT
// router.post('/', authMiddleware, produtoController.criarProduto);
// router.get('/', authMiddleware, produtoController.listarProdutos);

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// 🔍 Listar todos os produtos
router.get('/', authMiddleware, (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    console.log('Resultado da consulta de produtos:', results);
    res.json(results);
  });
});

// 🔍 Buscar produto por ID
router.get('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM produtos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json(results[0]);
  });
});

// 📝 Criar produto
router.post('/', authMiddleware, (req, res) => {
  const { nome, preco, tipo, valor } = req.body;
  db.query('INSERT INTO produtos (nome, preco, tipo, valor) VALUES (?, ?, ?, ?)', [nome, preco, tipo, valor], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Produto cadastrado com sucesso', id: result.insertId });
  });
});

// ✏️ Atualizar produto
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { nome, preco, tipo, valor } = req.body;
  db.query('UPDATE produtos SET nome = ?, preco = ?, tipo = ?, valor = ? WHERE id = ?', [nome, preco, tipo, valor, id], (err) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Produto atualizado com sucesso' });
  });
});

// 🗑️ Deletar produto
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM produtos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Produto deletado com sucesso' });
  });
});

module.exports = router;




 
