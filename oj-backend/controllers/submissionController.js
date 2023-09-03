const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Submission = require("..//models/submissionModel");
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');
const Question = require("../models/questionModel");

const getSubmissionDetails = asyncHandler(async (req, res, next) => {
    const submissionId = req.query.id;
    if (!mongoose.isValidObjectId(submissionId)) {
        return next(new ErrorResponse(`Invalid submission ID: ${submissionId}`, 400));
    }
    const submission = await Submission.findById(questionId);
    if (!submission) {
        return next(new ErrorResponse(`Submission not found with id: ${submissionId}`, 400));
    }
    res.status(200).json(submission);
})

module.exports = { getSubmissionDetails };

