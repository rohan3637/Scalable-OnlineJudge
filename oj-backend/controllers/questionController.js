const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Submission = require("..//models/submissionModel");
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');
const Question = require("../models/questionModel");
const TestCase = require("../models/testCaseModel");
const Topic = require("../models/topicModel");

const addQuestion = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId;
    const { title, description, difficulty, hints, topics, testCaseDtos} = req.body;
    if (!title || !description || !difficulty || !testCaseDtos || !userId) {
        return next(new ErrorResponse("Missing required fields !!", 404));
    }
    if (!mongoose.isValidObjectId(userId)) {
        return next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse(`User not found with id: ${userId}`, 400));
    }
    const newQuestion = await Question.create({
        title,
        description,
        topicIds: topics,
        difficulty,
        hint: hints,
        authorId: user._id, 
    });
    const savedTestCases = await Promise.all(
        testCaseDtos?.map(async (testCaseDto) => {
            const { input, expectedOutput } = testCaseDto;
            return await TestCase.create({
                questionId: newQuestion._id,
                input: input,
                expectedOutput: expectedOutput
            });
        })
    ); 
    (topics === null) ? [] : topics;
    const topicDtos = await Promise.all(topics?.map(async (topicId) => {
        return await Topic.findById(topicId);
    }));
    const response = {
        ...newQuestion.toObject(),
        topics: topicDtos,
        testCases: savedTestCases
    }
    res.status(200).json(response);
});

const getQuestionDetails = asyncHandler(async (req, res, next) => {
    const questionId = req.query.questionId;
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 400));
    }
    const testCases = await TestCase.find({ questionId });
    const topicDtos = await Promise.all(question?.topicIds?.map(async (topicId) => {
        return await Topic.findById(topicId);
    }));
    const response = {
        ...question.toObject(),
        topics: topicDtos,
        testCases
    }
    res.status(200).json(response);
});

const updateQuestion = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId;
    const questionId = req.query.questionId;
    const { title, description, difficulty, hints, topics, testCaseDtos} = req.body;
    if (!title || !description || !difficulty || !testCaseDtos || !userId) {
        return next(new ErrorResponse("Missing required fields !!", 404));
    }
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 400));
    }
    if(question.authorId !== userId) {
        return next(new ErrorResponse("Only author can edit their question !!", 400));
    }
    question.title = title;
    question.description = description;
    question.hint = hints;
    question.difficulty = difficulty;
    question.topicIds = topics;

    await TestCase.deleteMany({ questionId: question._id });
    const newTestCases = testCaseDtos?.map(testCaseDto => ({
        questionId: question._id,
        input: testCaseDto.input,
        expectedOutput: testCaseDto.expectedOutput
    }));
    await TestCase.insertMany(newTestCases);  
    (topics === null) ? [] : topics;
    const topicDtos = await Promise.all(question?.topicIds?.map(async (topicId) => {
        return await Topic.findById(topicId);
    })); 
    await TestCase.insertMany(newTestCases); 
    const updatedQuestion = await question.save();
    const response = {
        ...updatedQuestion.toObject(),
        topics: topicDtos,
        testCases: newTestCases
    }
    res.status(200).json(response);
});

const deleteQuestion = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId;
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
    await Question.findByIdAndDelete(question._id)

    res.status(200).json({
        success: true, 
        message: "Question deleted successfully." 
    });
});

const getAllQuestions = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId ? req.query.userId : null;
    const statuses = req.query.statuses ? req.query.statuses.split(',') : null;
    const topics = req.query.topics ? req.query.topics.split(',') : null;
    const difficulties = req.query.difficulties ? req.query.difficulties.split(',') : null;
    const searchQuery = req.query.searchQuery || null;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (userId && !mongoose.isValidObjectId(userId)) {
        return next(new ErrorResponse(`Invalid user ID: ${userId}`, 400));
    }

    const query = {};
    if(userId) query['authorId'] = userId;
    if(topics) query['topicIds'] = { $in: topics };
    if(difficulties) query['difficulty'] = { $in: difficulties }
    if(searchQuery) {
        query.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
        ];
    }

    let questionIdsWithStatus = [];
    if (statuses) {
        const userSubmissionsWithStatus = await Submission.find({
            userId: userId,
            status: { $in: statuses }
        });
        questionIdsWithStatus = userSubmissionsWithStatus.map(submission => submission.questionId);
        query['_id'] = { $in: questionIdsWithStatus };
    }

    const totalQuestions = await Question.countDocuments(query);

    let questions = await Question.find(query)
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize);

    questions = await Promise.all(questions.map(async (question) => {
        const topicDtos = await Promise.all(
            question.topicIds.map(async (topicId) => {
                return await Topic.findById(topicId);
            })
        );

        return {
            ...question.toObject(),
            accuracy: (question.totalSubmission == 0) ? 0 : question.correctSubmission / question.totalSubmission,
            topics: topicDtos,
        };
    }));    

    res.status(200).json({
        pageNo,
        pageSize,
        totalQuestions,
        questions,
    });

});

module.exports = { addQuestion, getAllQuestions, updateQuestion, getQuestionDetails, deleteQuestion };  