const express = require("express");
const router = express.Router();

const {
    getUserDetails,
    updateUserDetails,
    getSubmissionsByFilter,
    getUserDiscussions
} = require("../controllers/userController");
  
router.get("/get_user_details", getUserDetails);
router.put("/update_user_details", updateUserDetails);
router.get("/get_user_submissions", getSubmissionsByFilter);
router.get("/get_user_discussions", getUserDiscussions);

module.exports = router;