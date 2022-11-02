const express = require('express');
const router = express.Router();

// Controller
const { loginUser, registerUser } = require('../controller/user.controller');

router.post('/', registerUser)
router.post('/login', loginUser)




module.exports = router;