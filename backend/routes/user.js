const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); // la route signup utilisera le contôleur signup
router.post('/login', userCtrl.login); // la route post utilisera le contrôleur post

module.exports = router;
