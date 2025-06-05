require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET = 'secreto123';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ mensagem: 'Token mal formatado.' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ mensagem: 'Token mal formatado.' });
  }

  console.log('Token:', token);

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) {
      console.log('Erro na verificação do token:', err.message);
      return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
    }

    console.log('Usuário autenticado:', usuario);
    req.usuario = usuario; // inclui os dados do usuário no request
    next(); // continua para a rota
  });
};

module.exports = authMiddleware;
