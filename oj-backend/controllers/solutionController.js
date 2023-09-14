const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const Question = require("../models/questionModel");
const Solution = require("../models/solutionModel");

const getSolution = asyncHandler(async (req, res, next) => {
    const questionId = req.query.questionId;
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 404));
    }
    const solution = Solution.findOne({questionId});
    return res.status(200).json(solution);
});

const updateSolution = asyncHandler(async (req, res, next) => {
    const questionId = req.query.questionId;
    const { cppCode, javaCode, pythonCode, jsCode } = req.body;
    if (!mongoose.isValidObjectId(questionId)) {
        return next(new ErrorResponse(`Invalid question ID: ${questionId}`, 400));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Question not found with id: ${questionId}`, 404));
    }
    const solution = await Solution.findOne({ questionId });
    console.log(solution);
    let updatedSolution = null;
    if (!solution) {
        updatedSolution = await Solution.create({
            questionId: questionId,
            cpp: cppCode,
            java: javaCode,
            python: pythonCode,
            javascript: jsCode
        })
        console.log("all good");
    }
    else {
        solution.cpp = cppCode;
        solution.java = javaCode;
        solution.python = pythonCode,
        solution.javascript = jsCode
        updatedSolution = await solution.save();
    }
    //console.log("all good");
    res.status(200).json(updatedSolution);
}) 

module.exports = {getSolution, updateSolution};