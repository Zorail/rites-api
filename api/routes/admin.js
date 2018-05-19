const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin');

router.get('/', AdminController.get_vacancies);

router.get('/all', AdminController.get_vacancies_with_user);

module.exports = router;