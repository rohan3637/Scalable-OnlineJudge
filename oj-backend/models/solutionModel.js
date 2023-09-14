const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    cpp: {
        type: String
    },
    java: {
        type: String
    },
    python: {
        type: String
    },
    javascript: {
        type: String
    },
});

const Solution = mongoose.model("Solution", solutionSchema);

module.exports = Solution;