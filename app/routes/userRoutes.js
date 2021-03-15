const express = require('express');
const { route } = require('../../app');
const router = express.Router()
const mainController = require('../controllers/mainController');
const authController = require('../controllers/authController');

router.post('/sign_up', mainController.createUser);
router.patch('/:userId',mainController.userEdit);
router.post('/login', authController.Login);
router.get('/list', mainController.userIndex);

module.exports = router;