const express = require("express");
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');

const {
    getUserDetails,
    updateUserDetails,
    getLeaderboard
} = require("../controllers/userController");

// Apply the validateToken middleware to protect these routes
router.use(validateToken);
  
router.get("/get_user_details", getUserDetails);
router.put("/update_user_details", updateUserDetails);
router.get("/get_leaderboard", getLeaderboard);

module.exports = router;