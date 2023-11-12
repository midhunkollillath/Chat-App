const express = require('express')
const {registerUser,loginUser,fetchAllUser} = require('../Controller/userController'); 
const { Protect } = require('../Middleware/authMiddleware');
const router = express.Router()

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/fetchuser',Protect,fetchAllUser)
module.exports = router
