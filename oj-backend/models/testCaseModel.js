const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    },
    input: {
        type: String,
        required: true
    },
    expectedOutput: {
        type: String,
        required: true
    }
});

const TestCase = mongoose.model("TestCase", testCaseSchema);

module.exports = TestCase;
