const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },
    title: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const Discussion = mongoose.model("Discussion", discussionSchema);

module.exports = Discussion;
