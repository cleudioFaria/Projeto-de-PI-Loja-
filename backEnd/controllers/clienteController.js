const db = require('../config/db');

exports.listarClientes = (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
};
