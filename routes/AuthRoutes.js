const express = require('express');
const router = express.Router();
const { loginWithGoogle } = require('../controllers/auth.controller');

router.post('/google', loginWithGoogle);

module.exports = router;
