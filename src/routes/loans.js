const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { borrow, returnBook, myLoans, allLoans } = require('../controllers/loanController');

router.post('/:bookId', authenticate, borrow);           // aluno pega emprestado
router.put('/:id/return', authenticate, returnBook);     // aluno devolve
router.get('/my', authenticate, myLoans);                // aluno vê seus empréstimos
router.get('/', authenticate, requireAdmin, allLoans);   // admin vê todos

module.exports = router;