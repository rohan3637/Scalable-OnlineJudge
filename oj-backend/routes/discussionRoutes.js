const express = require("express");
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');

const {
    addDiscussion,
    getDiscussion,
    updateDiscussion,
    deleteDiscussion,
    getDiscussionsByFilter
} = require("../controllers/discussionController");

// Apply the validateToken middleware to protect these routes
router.use(validateToken);
  
router.post("/add_discussion", addDiscussion);
router.get("/get_discussion", getDiscussion);
router.post("/update_discussion", updateDiscussion);
router.delete("/delete_discussion", deleteDiscussion);
router.get("/get_discussions", getDiscussionsByFilter);

module.exports = router;