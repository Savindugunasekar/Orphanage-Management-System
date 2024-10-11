const express = require('express')
const router = express.Router()



const fileController = require('../../controllers/fileController')
const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')

router.route('/childPhotoUpload/:path')
    .get(verifyRoles(ROLES_LIST.Staff), fileController.getChildPhotoUploadURL)
router.route('/childPhotoUpdate/:path')
    .get(verifyRoles(ROLES_LIST.Staff), fileController.getChildPhotoUpdateURL)
    .delete(verifyRoles(ROLES_LIST.Staff), fileController.deleteChildPhoto)
router.route('/childPhotoDownload/:childId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), fileController.getChildPhotoDownloadURL)
router.route('/requestPhotoDownload/:requestId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), fileController.getRequestPhotoDownloadURL)
router.route('/childDocumentUpload/:childId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), fileController.getChildDocUploadURL)
router.route('/tempDocument/:documentId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), fileController.getTempDocumentURL)
router.route('/childDocument/:documentId')
    .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff), fileController.getChildDocumentURL)
router.route('/caseDocuments')
    .get(verifyRoles(ROLES_LIST.SocialWorker, ROLES_LIST.Head), fileController.getDocumentUrls)
    .post(verifyRoles(ROLES_LIST.Head, ROLES_LIST.User), fileController.uploadDocuments
    )

module.exports = router;

