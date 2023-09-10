const express = require("express");
const router = express.Router();

const {
    getUserDetails,
    updateUserDetails,
    getLeaderboard
} = require("../controllers/userController");
  
router.get("/get_user_details", getUserDetails);
router.put("/update_user_details", updateUserDetails);
router.get("/get_leaderboard", getLeaderboard);

module.exports = router;