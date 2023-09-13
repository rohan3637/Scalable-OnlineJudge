const express = require("express");
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');

const {
    addQuestion,
    getAllQuestions,
    getQuestionDetails,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");
  
router.post("/add_question", validateToken, addQuestion);
router.get("/get_all_questions", getAllQuestions);
router.get("/get_details", getQuestionDetails);
router.put("/update_question", validateToken, updateQuestion);
router.delete("/delete_question", validateToken, deleteQuestion);

module.exports = router;