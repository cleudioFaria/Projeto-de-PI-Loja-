const db = require('../config/db');

// Listar todas as compras
exports.listarCompras = (req, res) => {
  const sql = `
    SELECT c.*, cl.nome as nome_cliente, p.nome as nome_produto
    FROM compras c
    JOIN clientes cl ON c.cliente_id = cl.id
    JOIN produtos p ON c.produto_id = p.id
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
};

// Obter compra por ID
exports.obterCompraPorId = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT c.*, cl.nome as nome_cliente, p.nome as nome_produto
    FROM compras c
    JOIN clientes cl ON c.cliente_id = cl.id
    JOIN produtos p ON c.produto_id = p.id
    WHERE c.id = ?
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ erro: 'Compra não encontrada' });
    res.json(results[0]);
  });
};

// Cadastrar nova compra
exports.criarCompra = (req, res) => {
  const { cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento } = req.body;

  if (!cliente_id || !produto_id || !valor || !data_compra) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando!' });
  }

  const sql = `
    INSERT INTO compras (cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento], (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Compra registrada com sucesso!', id: resultado.insertId });
  });
};

// Atualizar compra
exports.atualizarCompra = (req, res) => {
  const { id } = req.params;
  const { cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento } = req.body;

  if (!cliente_id || !produto_id || !valor || !data_compra) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando!' });
  }

  const sql = `
    UPDATE compras 
    SET cliente_id = ?, produto_id = ?, valor = ?, data_compra = ?, data_entrega = ?, forma_pagamento = ?
    WHERE id = ?
  `;

  db.query(sql, [cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento, id], (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });
    if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Compra não encontrada' });
    res.json({ mensagem: 'Compra atualizada com sucesso!' });
  });
};

// Deletar compra
exports.deletarCompra = (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM compras WHERE id = ?';
  
  db.query(sql, [id], (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });
    if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Compra não encontrada' });
    res.json({ mensagem: 'Compra deletada com sucesso!' });
  });
};
