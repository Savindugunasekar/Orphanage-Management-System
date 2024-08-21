const express = require('express');
const router = express.Router();

const socialworkerController = require('../../controllers/socialworkerController')
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
.post(verifyRoles(ROLES_LIST.Admin),socialworkerController.addSocialWorker)
.get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.SocialWorker),socialworkerController.getOrphanage)

router.route('/all')
.get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Head,ROLES_LIST.Staff,ROLES_LIST.SocialWorker),socialworkerController.getAllSocialWorkers)


module.exports = router