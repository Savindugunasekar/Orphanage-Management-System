const express = require('express');
const router = express.Router();

const orphanageController = require('../../controllers/orphanageController')

// const deleteOrphanageController = require('../../controllers/deleteOrphanageController')
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Head, ROLES_LIST.SocialWorker, ROLES_LIST.Staff), orphanageController.getAllOrphanage)
    .post(verifyRoles(ROLES_LIST.Admin), orphanageController.addOrphanage)

router.route('/byHead')
    .get(verifyRoles(ROLES_LIST.Admin), orphanageController.getOrphanageByHead)

router.route('/head')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SocialWorker, ROLES_LIST.Head, ROLES_LIST.Staff), orphanageController.getOrphanageHead)

//temporary route for admin overview
router.route('/overview')
    .get(verifyRoles(ROLES_LIST.Admin), orphanageController.getOverview)

router.route('/:id')
    .delete(verifyRoles(ROLES_LIST.Admin),orphanageController.deleteOrphanage)
    .put(verifyRoles(ROLES_LIST.Admin), orphanageController.updateOrphanage)
    .get(verifyRoles(ROLES_LIST.Admin), orphanageController.getOrphanageDetailsById)

module.exports = router