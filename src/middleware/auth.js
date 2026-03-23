const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // salva os dados do usuário no request
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
}

module.exports = { authenticate, requireAdmin };