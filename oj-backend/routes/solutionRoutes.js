const express = require("express");
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');

const {
    getSolution,
    updateSolution,
} = require("../controllers/solutionController");

// Apply the validateToken middleware to protect these routes
router.use(validateToken);
  
router.get("/get_solution", getSolution);
router.put("/update_solution", updateSolution);

module.exports = router;


