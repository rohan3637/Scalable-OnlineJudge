const express = require("express");
const router = express.Router();

const {
    executeCodeOnUserInput,
    executeCodeOnTestCases
} = require("../controllers/executionController");
  
router.post("/execute-user-input", executeCodeOnUserInput);
router.post("/execute-test-case", executeCodeOnTestCases);

module.exports = router;