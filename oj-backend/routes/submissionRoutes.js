const express = require("express");
const router = express.Router();

const {
    getSubmissionDetails,
    getSubmissionsByFilter
} = require("../controllers/submissionController");
  
router.get("/get_submission", getSubmissionDetails);
router.get("/get_submissions", getSubmissionsByFilter);

module.exports = router;