const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.post('/', authController.handleAuth);
router.get('/check', authController.handleCookieCheck);

module.exports = router;