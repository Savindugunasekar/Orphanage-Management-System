
const express = require("express");
const router = express.Router();

const applicationController = require("../../controllers/applicationController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(
    verifyRoles(
      ROLES_LIST.Head,
      ROLES_LIST.SocialWorker,
      ROLES_LIST.User,
      ROLES_LIST.Admin
    ),
    applicationController.createApplication
  )
  .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User, ROLES_LIST.SocialWorker), applicationController.getApplications)
  .put(verifyRoles(ROLES_LIST.Admin), applicationController.updateApplicationStatus)


router.route('/getchildren')
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), applicationController.getChildren)

router.route('/approve')
  .get(verifyRoles(ROLES_LIST.Head), applicationController.getApprovedApplications)
  .post(verifyRoles(ROLES_LIST.User), applicationController.addToApprovedList)

router.route('/approve/:parentId')
  .get(verifyRoles(ROLES_LIST.User), applicationController.getApprovedApplicationsByUser)

router.route('/countByChild/:childId')
  .get(verifyRoles(ROLES_LIST.Head, ROLES_LIST.Staff, ROLES_LIST.Admin), applicationController.checkChildInvolvement)

module.exports = router;







