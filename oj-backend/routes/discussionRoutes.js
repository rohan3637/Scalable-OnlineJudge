const express = require("express");
const router = express.Router();

const {
    addDiscussion,
    getDiscussion,
    updateDiscussion,
    deleteDiscussion
} = require("../controllers/discussionController");
  
router.post("/add_discussion", addDiscussion);
router.get("/get_discussion", getDiscussion);
router.post("/update_discussion", updateDiscussion);
router.delete("/delete_discussion", deleteDiscussion);

module.exports = router;