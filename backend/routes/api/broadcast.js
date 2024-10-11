const express = require('express')

const router = express.Router()

const BroadcastMsgController = require('../../controllers/BroadcastMsgController')

const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
.post(verifyRoles(ROLES_LIST.Admin),BroadcastMsgController.sendBroadcastMsg)
.get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff,ROLES_LIST.SocialWorker,ROLES_LIST.User), BroadcastMsgController.getBroadcastMsg)

module.exports = router