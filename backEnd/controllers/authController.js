const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'secreto123';  // Depois movemos pra .env

exports.register = async (req, res) => {
  console.log('Received registration request:', req.body);
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha) {
    console.error('Registration Error: Missing required fields');
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  // Verificar se o email já está cadastrado
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Registration Error - Email check DB query:', err);
      return res.status(500).json({ erro: 'Erro ao verificar email no banco de dados.' });
    }
    if (results.length > 0) {
      console.warn('Registration Warning: Email already registered', email);
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Hash da senha
    try {
      console.log('Hashing password...');
      const senhaHash = await bcrypt.hash(senha, 10);
      console.log('Password hashed.');

      // Inserir novo usuário
      db.query(
        'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
        [nome, email, senhaHash, tipo || 'usuario'],
        (err, result) => {
          if (err) {
            console.error('Registration Error - User insert DB query:', err);
            return res.status(500).json({ erro: 'Erro ao cadastrar usuário no banco de dados.' });
          }
          console.log('User registered successfully:', result.insertId);
          res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        }
      );
    } catch (bcryptError) {
      console.error('Registration Error - Password hashing:', bcryptError);
      res.status(500).json({ erro: 'Erro ao processar senha.' });
    }
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const usuario = results[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });

    console.log('Usuário logado:', usuario.nome);

    const payload = {
      id: usuario.id,
      tipo: usuario.tipo,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: '24h' });

    res.json({ 
      mensagem: 'Login realizado com sucesso!', 
      token,
      nome: usuario.nome 
    });
  });
}; 