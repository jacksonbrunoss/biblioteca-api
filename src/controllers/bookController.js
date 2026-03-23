const db = require('../config/database');

const getAll = (req, res) => {
  const books = db.prepare('SELECT * FROM books').all();
  res.json(books);
};

const getOne = (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
  res.json(book);
};

const create = (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Título e autor são obrigatórios' });

  const result = db.prepare(
    'INSERT INTO books (title, author, year) VALUES (?, ?, ?)'
  ).run(title, author, year || null);

  res.status(201).json({ message: 'Livro adicionado!', id: result.lastInsertRowid });
};

const update = (req, res) => {
  const { title, author, year, available } = req.body;
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });

  db.prepare(
    'UPDATE books SET title = ?, author = ?, year = ?, available = ? WHERE id = ?'
  ).run(
    title ?? book.title,
    author ?? book.author,
    year ?? book.year,
    available ?? book.available,
    req.params.id
  );

  res.json({ message: 'Livro atualizado!' });
};

const remove = (req, res) => {
  const result = db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Livro não encontrado' });
  res.json({ message: 'Livro removido!' });
};

module.exports = { getAll, getOne, create, update, remove };