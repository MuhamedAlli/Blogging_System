var express = require('express');
const router = express.Router();
var authCtrl = require('../controllers/authController');

router.post('/user/register',authCtrl.register);
router.post('/user/login',authCtrl.logIn);

module.exports = router;