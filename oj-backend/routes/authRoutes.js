const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");
  
router.post("/register_user", registerUser);
router.post("/login_user", loginUser);

module.exports = router;