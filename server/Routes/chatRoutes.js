const express = require('express')
const { Protect } = require('../Middleware/authMiddleware')
const { accessChat, fetchChats, createGroups, fetchGroups, deleteGroups, addToGroup,renameGroup } = require('../Controller/chatController')

const router= express.Router()

router.route('/').post(Protect,accessChat)
router.route('/').get(Protect,fetchChats)
router.route('/creategroups').post(Protect,createGroups)
router.route('/rename').post(Protect,renameGroup)
router.route('/fetchgroups').get(Protect,fetchGroups)
router.route('/groupexit').put(Protect,deleteGroups)
router.route('/addgroup').put(Protect,addToGroup)

module.exports=router