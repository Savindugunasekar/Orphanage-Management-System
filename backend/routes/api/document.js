const express = require('express');
const router = express.Router();

const documentController = require('../../controllers/documentController')
const ROLES_LIST = require('../../config/roles_list')

const verifyRoles = require('../../middleware/verifyRoles')

router.route('/child/:childId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), documentController.getChildDocuments)
router.route('/:documentId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), documentController.getChildDocument)

module.exports = router