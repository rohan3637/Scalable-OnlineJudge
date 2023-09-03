const express = require("express");
const router = express.Router();

const {
    getSubmissionDetails
} = require("../controllers/submissionController");
  
router.get("/get_details", getSubmissionDetails);

module.exports = router;