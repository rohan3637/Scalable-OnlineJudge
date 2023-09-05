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
    const submission = await Submission.findById(submissionId);
    if (!submission) {
        return next(new ErrorResponse(`Submission not found with id: ${submissionId}`, 400));
    }
    res.status(200).json(submission);
})

const getSubmissionsByFilter = asyncHandler(async (req, res, next) => {
    const userId = req.query.id || null;
    const questionId = req.query.questionId || null;
    const statusList = req.query.status ? req.query.status.split(',') : ['Accepted'];
    const languages = req.query.languages || null;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const query = {
        status: { $in: statusList }
    };
    if (userId) query['userId'] = userId;
    if (questionId) query['questionId'] = questionId;
    if (languages) query['language'] = { $in: languages};

    const totalSubmissions = await Submission.countDocuments(query);

    const submissions = await Submission.find(query)
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)

    res.status(200).json({
        totalSubmissions,
        currentPage: pageNo,
        pageSize,
        submissions,
    });
}); 


module.exports = { getSubmissionDetails, getSubmissionsByFilter };

