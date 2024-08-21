const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

const messageController = require('../../controllers/messageController')

router.route('/')
.post(messageController.createMessage)
.get(messageController.getAllMessages)


router.route('/reply').post(verifyRoles(ROLES_LIST.Admin),messageController.setReply)


module.exports = router