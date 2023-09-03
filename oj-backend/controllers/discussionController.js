const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');
const Discussion = require("../models/discussionModel");
const Question = require("../models/questionModel");

const addDiscussion = asyncHandler(async (req, res, next) => {
    const { userId, questionId, title, comment } = req.body;

    if (!userId || !questionId || !title || !comment) {
        return next(new ErrorResponse("Missing required fields !!", 404));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${userId}`, 400));
    }

    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 400));
    }

    const newDiscussion = await Discussion.create({
        userId,
        questionId,
        title: title,
        comment: comment
    });

    res.status(201).json(newDiscussion);
});


const getDiscussion = asyncHandler(async (req, res, next) => {
    const discussionId = req.query.discussionId;

    if (!mongoose.isValidObjectId(discussionId)) {
        return next(new ErrorResponse(`Invalid discussion ID: ${discussionId}`, 400));
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
        return next(new ErrorResponse(`Discussion not found with id: ${discussionId}`, 400));
    }

    res.status(200).json(discussion);
});

const updateDiscussion = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    const discussionId = req.query.discussionId;

    if (!mongoose.isValidObjectId(discussionId)) {
        return next(new ErrorResponse(`Invalid discussion ID: ${discussionId}`, 400));
    }
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
        return next(new ErrorResponse(`Discussion not found with id: ${questionId}`, 400));
    }
    if(discussion.userId != userId) {
        return next(new ErrorResponse("Only author can edit their discussion !!", 400));
    }
    const updatedDiscussion = await Question.findByIdAndUpdate(
        discussionId, req.body, {new : true}
    );
    res.status(200).json(updatedDiscussion);
});


const deleteDiscussion = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    const discussionId = req.query.discussionId;

    if (!mongoose.isValidObjectId(discussionId)) {
        return next(new ErrorResponse(`Invalid discussion ID: ${discussionId}`, 400));
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
        return next(new ErrorResponse(`Discussion not found with id: ${discussionId}`, 400));
    }

    if(discussion.userId != userId) {
        return next(new ErrorResponse("Only author can delete their discussion !!", 400));
    }

    await discussion.remove();

    res.status(200).json({ success: true, message: "Discussion deleted successfully." });
});


module.exports = { addDiscussion, updateDiscussion, getDiscussion, deleteDiscussion }; 