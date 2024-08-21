const express = require('express');
const router = express.Router();

const requestController = require('../../controllers/requestController')
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/get/:requestId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), requestController.getRequest)
router.route('/sent')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), requestController.getSentRequests)
router.route('/received')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), requestController.getReceivedRequests)
router.route('/addChild')
    .post(verifyRoles(ROLES_LIST.Staff), requestController.createAddChildRequest)
    .put(verifyRoles(ROLES_LIST.Head), requestController.handleAddChildRequest)
router.route('/editChild')
    .post(verifyRoles(ROLES_LIST.Staff), requestController.createEditChildRequest)
    .put(verifyRoles(ROLES_LIST.Head), requestController.handleEditChildRequest)
router.route('/deleteChild')
    .post(verifyRoles(ROLES_LIST.Staff), requestController.createDeleteChildRequest)
    .put(verifyRoles(ROLES_LIST.Head), requestController.handleDeleteChildRequest)
router.route('/childDocument')
    .post(verifyRoles(ROLES_LIST.Staff), requestController.createChildDocumentRequest)
    .put(verifyRoles(ROLES_LIST.Head), requestController.handleChildDocumentRequest)

module.exports = router