const express = require('express');
const router = express.Router();

const staffController = require('../../controllers/staffController')
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin), staffController.addStaff)
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Head, ROLES_LIST.SocialWorker, ROLES_LIST.Staff), staffController.getStaffByOrphanage)

router.route(`/:orphanageid`)
    .delete(verifyRoles(ROLES_LIST.Admin), staffController.deleteStaffByOrphanage)

router.route(`/all`)
    .get(verifyRoles(ROLES_LIST.Admin), staffController.getAllStaff)


module.exports = router