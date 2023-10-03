const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Submission = require("..//models/submissionModel");
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const Question = require("../models/questionModel");
const TestCase = require("../models/testCaseModel");
const compileAndRunCodeOnTestCases = require("../codeRunner/compileAndRunCodeOnTestCases");
const compileAndRunCodeOnUserInput = require("../codeRunner/compileAndRunCodeOnUserInput");

const getSubmissionDetails = asyncHandler(async (req, res, next) => {
    const submissionId = req.query.submissionId;
    if (!mongoose.isValidObjectId(submissionId)) {
        return next(new ErrorResponse(`Invalid submission ID: ${submissionId}`, 400));
    }
    const submission = await Submission.findById(submissionId);
    if (!submission) {
        return next(new ErrorResponse(`Submission not found with id: ${submissionId}`, 404));
    }
    res.status(200).json(submission);
})

const compileAndRun = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId;
    const questionId = req.query.questionId;
    const language = req.body.language || null;
    const codeContent = req.body.codeContent || null;
    const userInput = req.body.userInput || null;

    if(!language || !codeContent) {
        return next(new ErrorResponse("Missing language or codeContent", 404));
    }    
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid User ID or Question ID: ${userId}, ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse("Question not found", 404));
    }
    let response = null;
    if (userInput != null) {
        response = await compileAndRunCodeOnUserInput(language, codeContent, userInput, questionId);
    }
    else {
        const testcases = await TestCase.find({questionId}).limit(2);
        response = await compileAndRunCodeOnTestCases(language, codeContent, testcases);
    }    
    if (response instanceof ErrorResponse) return next(response);
    res.status(200).json(response);
}) 

const submitCode = asyncHandler(async (req, res, next) => {
    const userId = req.query.userId;
    const questionId = req.query.questionId;
    const language = req.body.language || null;
    const codeContent = req.body.codeContent || null;

    if(!language || !codeContent) {
        return next(new ErrorResponse("Missing language or codeContent", 404));
    }    
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid User ID or Question ID: ${userId}, ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse("Question not found", 404));
    }
    const testCases = await TestCase.find({questionId});
    const testResultDtos = await compileAndRunCodeOnTestCases(language, codeContent, testCases); 
    let status;
    if (testResultDtos instanceof ErrorResponse) {
        if (testResultDtos.message.includes("TLE")) status = 'TLE';
        else if (testResultDtos.message.includes("Compilation failed")) status = 'COMPILATION_ERROR';
        else status = 'RUNTIME_ERROR';
        
        await Submission.create({
            userId,
            questionId,
            language,
            codeContent,
            submissionTime: new Date(),
            testCasesPassed: 0,
            status
        });
        return next(testResultDtos);
    }    

    let testCasesPassed = 0;
    let failedTestCase = null;
    for (const testResultDto of testResultDtos) {
        if (testResultDto.passed) testCasesPassed++;
        else if (!failedTestCase) failedTestCase = testResultDto;
    }
    status = testCasesPassed === testCases.length ? 'ACCEPTED' : 'WRONG_ANSWER';

    question.totalSubmission = question.totalSubmission + 1;
    if(status == 'ACCEPTED') question.correctSubmission = question.correctSubmission + 1;
    await question.save()

    // Create a submission record
    const submission = await Submission.create({
        userId,
        questionId,
        language,
        codeContent,
        submissionTime: new Date(),
        testCasesPassed,
        status,
    });

    const totalTc = testCases.length;
    res.status(200).json({
        status, 
        testCasesPassed, 
        totalTc,
        failedTestCase
    });
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


module.exports = { getSubmissionDetails, getSubmissionsByFilter, compileAndRun, submitCode };

