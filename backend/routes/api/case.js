const express = require('express')

const router = express.Router()

const caseController = require('../../controllers/caseController')

const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
.post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Head),caseController.createCase)
.get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Head,ROLES_LIST.SocialWorker),caseController.getAllCases)

router.route('/byId')
.get(verifyRoles(ROLES_LIST.SocialWorker,ROLES_LIST.Admin,ROLES_LIST.User,ROLES_LIST.Head),caseController.getCaseById)

router.route('/byUser')
.get(verifyRoles(ROLES_LIST.User),caseController.getUserCases)

router.route('/phase1')
.put(verifyRoles(ROLES_LIST.Head,ROLES_LIST.SocialWorker),caseController.phase1Completed)

module.exports = router


