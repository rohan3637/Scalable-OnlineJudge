const express = require("express");
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');

const {
    getSubmissionDetails,
    getSubmissionsByFilter,
    compileAndRun,
    submitCode
} = require("../controllers/submissionController");

// Apply the validateToken middleware to protect these routes
router.use(validateToken);
  
router.get("/get_submission", getSubmissionDetails);
router.get("/get_submissions", getSubmissionsByFilter);
router.post("/compile", compileAndRun);
router.post("/submit", submitCode);

module.exports = router;