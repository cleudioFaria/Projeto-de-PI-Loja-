const db = require('../config/db');

exports.listarProdutos = (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
};

exports.criarProduto = (req, res) => {
  const { nome, tipo, valor } = req.body;

  if (!nome || !tipo || !valor) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  const sql = 'INSERT INTO produtos (nome, tipo, valor) VALUES (?, ?, ?)';
  db.query(sql, [nome, tipo, valor], (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', id: resultado.insertId });
  });
};
