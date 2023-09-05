const express = require("express");
const router = express.Router();

const {
    getUserDetails,
    updateUserDetails
} = require("../controllers/userController");
  
router.get("/get_user_details", getUserDetails);
router.put("/update_user_details", updateUserDetails);

module.exports = router;