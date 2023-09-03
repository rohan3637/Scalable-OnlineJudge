const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Submission = require("..//models/submissionModel");
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');
const Discussion = require("../models/discussionModel");
const Question = require("../models/questionModel");

const addQuestion = asyncHandler(async (req, res, next) => {
    const { title, description, difficulty, hint, authorId } = req.body;
    if (!title || !description || !difficulty || !authorId) {
      return next(new ErrorResponse("Missing required fields !!", 404));
    }
    if (!mongoose.isValidObjectId(authorId)) {
        return next(new ErrorResponse(`Invalid user ID: ${authorId}`, 400));
    }
    const user = await User.findById(authorId);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${authorId}`, 400));
    }
    const newQuestion = await Question.create({
        title,
        description,
        difficulty,
        hint,
        authorId 
    });
    res.status(201).json(newQuestion);
});

const getQuestionDetails = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    const questionId = req.query.questionId;
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 400));
    }
    res.status(200).json(question);
});

const updateQuestion = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    const questionId = req.query.questionId;
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 400));
    }
    if(question.authorId != userId) {
        return next(new ErrorResponse("Only author can edit their question !!", 400));
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
        questionId, req.body, {new : true}
    );
    res.status(200).json(updateQuestion);
});

const deleteQuestion = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    const questionId = req.query.questionId;
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 400));
    }
    if(question.authorId != userId) {
        return next(new ErrorResponse("Only author can delete their question !!", 400));
    }
    await TestCase.deleteMany({ questionId: questionId });
    await Submission.deleteMany({ questionId: questionId });
    await question.remove();

    res.status(200).json({ success: true, message: "Question deleted successfully." });
});

const getAllQuestions = asyncHandler(async (req, res, next) => {
    const userId = req.query.id;
    console.log(userId);
    const statusList = req.query.statuses ? req.query.statuses.split(',') : null;
    const topics = req.query.topics ? req.query.topics.split(',') : null;
    const difficulties = req.query.difficulties ? req.query.difficulties.split(',') : null;
    const searchQuery = req.query.searchQuery || null;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (!mongoose.isValidObjectId(userId)) {
        return next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${req.query.id}`, 400));
    }

    const query = {};
    if(topics) query['topicIds'] = { $in: topics };
    if(difficulties) query['difficulty'] = { $in: difficulties }
    if(searchQuery) {
        query.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
        ];
    }

    let questionIdsWithStatus = [];
    if (statusList) {
        const userSubmissionsWithStatus = await Submission.find({
            userId: userId,
            status: { $in: statusList }
        });
        questionIdsWithStatus = userSubmissionsWithStatus.map(submission => submission.questionId);
        query['_id'] = { $in: questionIdsWithStatus };
    }

    const totalQuestions = await Question.countDocuments(query);

    const questions = await Question.find(query)
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize);

    res.status(200).json({
        totalQuestions,
        currentPage: pageNo,
        pageSize,
        questions,
    });

});

const getDiscussionsByQuestion = asyncHandler(async (req, res, next) => {
    const questionId = req.query.questionId;
    const searchQuery = req.query.searchQuery || null;
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const query = {
        questionId: questionId,
    };
    if(searchQuery) {
        query.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { comment: { $regex: searchQuery, $options: 'i' } },
        ];
    }

    const totalDiscussions = await Discussion.countDocuments(query);
    const discussions = await Discussion.find(query)
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize);

    res.status(200).json({
        totalDiscussions,
        currentPage: pageNo,
        pageSize,
        discussions,
    });    

})

module.exports = { addQuestion, getAllQuestions, updateQuestion, getQuestionDetails, deleteQuestion, getDiscussionsByQuestion };  