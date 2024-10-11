const express = require('express')

const router = express.Router()

const notificationController = require('../../controllers/notificationController')

const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
.get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Head,ROLES_LIST.SocialWorker,ROLES_LIST.Staff,ROLES_LIST.User),notificationController.getNotifications) 

module.exports = router