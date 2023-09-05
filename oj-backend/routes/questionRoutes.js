const express = require("express");
const router = express.Router();

const {
    addQuestion,
    getAllQuestions,
    getQuestionDetails,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");
  
router.post("/add_question", addQuestion);
router.get("/get_all_questions", getAllQuestions);
router.get("/get_details", getQuestionDetails);
router.put("/update_question", updateQuestion);
router.delete("/delete_question", deleteQuestion);

module.exports = router;