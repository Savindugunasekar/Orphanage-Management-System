const express = require('express')
const router = express.Router()



const fileController = require('../../controllers/fileController')
const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')

router.route('/childPhoto/:path')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), fileController.getChildPhotoUploadURL)
router.route('/childDocument/:path')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), fileController.getChildDocUploadURL)


router.route('/caseDocuments')
.get(verifyRoles(ROLES_LIST.SocialWorker,ROLES_LIST.Head),fileController.getDocumentUrls)
.post(verifyRoles(ROLES_LIST.Head, ROLES_LIST.User),fileController.uploadDocuments
)

module.exports = router;