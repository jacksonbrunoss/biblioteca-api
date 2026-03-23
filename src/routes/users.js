const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getAll, remove } = require('../controllers/userController');

router.get('/', authenticate, requireAdmin, getAll);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;