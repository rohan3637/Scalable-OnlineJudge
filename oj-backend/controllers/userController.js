const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Submission = require("..//models/submissionModel");
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');
const Discussion = require("../models/discussionModel");

const getUserDetails = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    if (!mongoose.isValidObjectId(userId)) {
        return next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }
    const user = await User.findById(req.query.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${req.query.id}`, 400));
    }

    const submissions = await Submission.find({ user: userId });

    // Calculate user statistics
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;
    const seen = new Set();

    submissions.forEach((submission) => {
        const question = submission.question;
        if (submission.status === 'ACCEPTED') {
            if (!seen.has(question.questionId)) {
                seen.add(question.questionId);
                if (question.difficulty === 'EASY') easySolved++;
                else if (question.difficulty === 'MEDIUM') mediumSolved++;
                else hardSolved++;
            }
        }
    });

    const totalSubmission = submissions.length;
    const correctSubmission = easySolved + mediumSolved + hardSolved;
    const accuracy = (correctSubmission / totalSubmission) || 0;
    const totalPoints = easySolved * 10 + mediumSolved * 20 + hardSolved * 30;

    // Create the response object
    const response = {
        userId: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        totalSolved: correctSubmission,
        easySolved,
        mediumSolved,
        hardSolved,
        accuracy,
        totalPoints,
    };

    res.status(200).json(response);
});


const updateUserDetails = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId;
    if (!mongoose.isValidObjectId(userId)) {
        return next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${req.query.id}`, 400));
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId, req.body, {new : true}
    ).select("id username email role");

    const userResponseDto = {
        userId: updatedUser.id,
        name: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        score: null,
    };

    res.status(200).json(userResponseDto);
});

module.exports = { getUserDetails, updateUserDetails };  