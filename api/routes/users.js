const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth.js')
const UserController = require('../controllers/user')

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.put('/:userId', checkAuth, UserController.user_update);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;