require('dotenv').config();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync('admin123', 10);

try {
  db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run('Admin', 'admin@biblioteca.com', hash, 'admin');
  console.log('Admin criado com sucesso!');
} catch (e) {
  console.log('Admin já existe.');
}