const express = require('express');
const router = express.Router();
const multer = require('multer');

const AdminController = require('../controllers/admin');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/admin');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
});

// const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    }
    // fileFilter: fileFilter
});

router.get('/', AdminController.get_vacancies);

router.get('/all', AdminController.get_vacancies_with_user);

router.post('/login', AdminController.login_admin);

router.post('/', upload.any(), AdminController.vacancy_upload);

module.exports = router;