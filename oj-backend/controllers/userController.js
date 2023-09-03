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
    const user = await User.findById(req.query.id)
        .select('username email role');
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${req.query.id}`, 400));
    }
    res.status(200).json(user);
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    if (!mongoose.isValidObjectId(userId)) {
        return next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }
    const user = await User.findById(req.query.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${req.query.id}`, 400));
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId, req.body, {new : true}
    ).select("username email role");
    res.status(200).json(updatedUser);
});

const getSubmissionsByFilter = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    const questionId = req.query.questionId;
    const statusList = req.query.status ? req.query.status.split(',') : ['Accepted'];
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (!mongoose.isValidObjectId(userId)) {
        next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }
    const user = await User.findById(req.query.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${req.query.id}`, 400));
    }
    const query = {
        userId: userId,
        status: { $in: statusList }
    };
    if (questionId) query.questionId = questionId;

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

const getUserDiscussions = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    const questionId = req.query.questionId;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (!mongoose.isValidObjectId(userId)) {
        next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }
    const user = await User.findById(req.query.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${req.query.id}`, 400));
    }
    const query = {
        userId: userId,
    };
    if (questionId) query.questionId = questionId;
    const discussions = await Discussion.find(query)
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)
    res.status(200).json(discussions);
}); 

module.exports = { getUserDetails, updateUserDetails, getSubmissionsByFilter, getUserDiscussions };  