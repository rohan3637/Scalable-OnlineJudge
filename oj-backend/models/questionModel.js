const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    topicIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    }],
    difficulty: {
        type: String,
        enum: ["EASY", "MEDIUM", "HARD"],
        required: true
    },
    authorSolution: {
        type: String
    },
    totalSubmission: {
        type: Number,
        default: 0
    },
    correctSubmission: {
        type: Number,
        default: 0
    },
    hint : {
        type: String 
    },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;