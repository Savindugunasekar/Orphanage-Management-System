const express = require('express');
const router = express.Router();

const orphanageController = require('../../controllers/orphanageController')
const updateOrphanageController = require('../../controllers/updateOrphanageController')

// const deleteOrphanageController = require('../../controllers/deleteOrphanageController')
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin), orphanageController.addOrphanage)
    .get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Head,ROLES_LIST.SocialWorker,ROLES_LIST.Staff), orphanageController.getAllOrphanage)

router.route('/:id')
.put(verifyRoles(ROLES_LIST.Admin),updateOrphanageController.updateOrphanage)

router.route('/byHead')
    .get(verifyRoles(ROLES_LIST.Admin), orphanageController.getOrphanageByHead)
router.route('/head')
.get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.SocialWorker,ROLES_LIST.Head,ROLES_LIST.Staff),orphanageController.getOrphanageHead)
// router.route('/:id')
// .delete(verifyRoles(ROLES_LIST.Admin),deleteOrphanageController.deleteOrphanage)

module.exports = router