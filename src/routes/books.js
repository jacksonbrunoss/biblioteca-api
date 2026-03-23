const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getAll, getOne, create, update, remove } = require('../controllers/bookController');

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getOne);
router.post('/', authenticate, requireAdmin, create);
router.put('/:id', authenticate, requireAdmin, update);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;