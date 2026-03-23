const db = require('../config/database');

// Aluno pega um livro emprestado
function borrow(req, res) {
  const bookId = req.params.bookId;
  const userId = req.user.id; // vem do token JWT

  // verifica se o livro existe e está disponível
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
  if (!book.available) return res.status(400).json({ error: 'Livro já está emprestado' });

  // verifica se o aluno já tem esse livro emprestado
  const existing = db.prepare(
    'SELECT * FROM loans WHERE user_id = ? AND book_id = ? AND returned_at IS NULL'
  ).get(userId, bookId);
  if (existing) return res.status(400).json({ error: 'Você já pegou esse livro emprestado' });

  // cria o empréstimo e marca o livro como indisponível
  db.prepare('INSERT INTO loans (user_id, book_id) VALUES (?, ?)').run(userId, bookId);
  db.prepare('UPDATE books SET available = 0 WHERE id = ?').run(bookId);

  res.status(201).json({ message: `Livro "${book.title}" emprestado com sucesso!` });
}

// Aluno devolve o livro
function returnBook(req, res) {
  const loanId = req.params.id;
  const userId = req.user.id;

  // busca o empréstimo
  const loan = db.prepare(
    'SELECT * FROM loans WHERE id = ? AND returned_at IS NULL'
  ).get(loanId);

  if (!loan) return res.status(404).json({ error: 'Empréstimo não encontrado ou já devolvido' });

  // aluno só pode devolver o próprio empréstimo (admin pode devolver qualquer um)
  if (req.user.role !== 'admin' && loan.user_id !== userId) {
    return res.status(403).json({ error: 'Você não pode devolver o empréstimo de outro aluno' });
  }

  // registra devolução e marca o livro como disponível novamente
  db.prepare(
    "UPDATE loans SET returned_at = datetime('now') WHERE id = ?"
  ).run(loanId);
  db.prepare('UPDATE books SET available = 1 WHERE id = ?').run(loan.book_id);

  res.json({ message: 'Livro devolvido com sucesso!' });
}

// Lista os empréstimos ativos do aluno logado
function myLoans(req, res) {
  const loans = db.prepare(`
    SELECT loans.id, books.title, books.author, loans.loaned_at
    FROM loans
    JOIN books ON loans.book_id = books.id
    WHERE loans.user_id = ? AND loans.returned_at IS NULL
  `).all(req.user.id);

  res.json(loans);
}

// Admin vê todos os empréstimos ativos
function allLoans(req, res) {
  const loans = db.prepare(`
    SELECT loans.id, users.name AS aluno, books.title AS livro,
           loans.loaned_at, loans.returned_at
    FROM loans
    JOIN users ON loans.user_id = users.id
    JOIN books ON loans.book_id = books.id
    ORDER BY loans.loaned_at DESC
  `).all();

  res.json(loans);
}

module.exports = { borrow, returnBook, myLoans, allLoans };