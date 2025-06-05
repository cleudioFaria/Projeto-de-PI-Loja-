const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const db = require('../config/db');
const compraController = require('../controllers/compraController');

// Listar todas as compras
// router.get('/', (req, res) => {
//   db.query('SELECT * FROM compras', (err, results) => {
//     if (err) return res.status(500).json({ erro: err });
//     res.json(results);
//   });
// });

// Listar todas as compras

// router.get('/', authMiddleware, (req, res) => {
//   db.query('SELECT * FROM compras', (err, results) => {
//     if (err) return res.status(500).json({ erro: err });
//     res.json(results);
//   });
// });

// CRUD protegido por autenticação
router.post('/', authMiddleware, compraController.criarCompra);
router.get('/', authMiddleware, compraController.listarCompras);
router.get('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  // Modifica a query SQL para juntar com a tabela clientes e buscar o nome
  db.query('SELECT c.*, cl.nome AS nome_cliente FROM compras c JOIN clientes cl ON c.cliente_id = cl.id WHERE c.id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ mensagem: 'Compra não encontrada' });
    res.json(results[0]);
  });
});
router.put('/:id', authMiddleware, compraController.atualizarCompra);
router.delete('/:id', authMiddleware, compraController.deletarCompra);

module.exports = router;
