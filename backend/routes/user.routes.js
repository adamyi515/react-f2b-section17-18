const express = require('express');
const router = express.Router();

// Middleware
const {protectRoute} = require('../middlewares/auth.middleware');

// Controller
const { loginUser, registerUser, getMe } = require('../controller/user.controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protectRoute, getMe);



module.exports = router;