const express = require('express');
const router = express.Router();

const childController = require('../../controllers/childController')
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/orphanage/:orphanageid')
    .get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Head, ROLES_LIST.Staff,ROLES_LIST.SocialWorker), childController.getOrphanageChildren)
router.route('/:childid')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), childController.getChild)

module.exports = router