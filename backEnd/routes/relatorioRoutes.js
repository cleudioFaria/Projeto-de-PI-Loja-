const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const relatorioController = require('../controllers/relatorioController');

// Clientes que mais compraram
router.get('/clientes-top', authMiddleware, relatorioController.listarTopClientes);

// Produtos mais vendidos
router.get('/produtos-top', authMiddleware, relatorioController.listarTopProdutos);

// Exportar arquivos em CSV
router.get('/compras-csv', authMiddleware, relatorioController.exportarComprasCsv);

// Exportar relatórios em PDF
// router.get('/compras-pdf', authMiddleware, relatorioController.exportarComprasPdf); // Removido

module.exports = router;
