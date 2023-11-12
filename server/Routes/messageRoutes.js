const express = require('express')
const { Protect } = require('../Middleware/authMiddleware')
const { Allmessages, sendMessages } = require('../Controller/messageController')

const router = express.Router()
router.route('/:chatId').get(Protect,Allmessages)
router.route('/send').post(Protect,sendMessages)
// router.post('/send-message', messageController.sendMessage);
module.exports = router