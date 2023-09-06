const express = require("express");
const router = express.Router();

const {
    getSubmissionDetails,
    getSubmissionsByFilter,
    compileAndRun,
    submitCode
} = require("../controllers/submissionController");
  
router.get("/get_submission", getSubmissionDetails);
router.get("/get_submissions", getSubmissionsByFilter);
router.post("/compile", compileAndRun);
router.post("/submit", submitCode);

module.exports = router;