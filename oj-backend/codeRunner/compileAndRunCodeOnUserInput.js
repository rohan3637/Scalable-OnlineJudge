const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require("express-async-handler");
const Solution = require("../models/solutionModel");
const axios = require('axios');

const compileAndRunCodeOnUserInput = asyncHandler(async (language, codeContent, userInput, questionId) => {
    const solution = await Solution.findOne({questionId});
    let solutionCode;
    if (language === 'JAVASCRIPT') solutionCode = solution.javascript;
    else if (language === 'JAVA') solutionCode = solution.java;
    else if (language === 'CPP') solutionCode = solution.cpp; 
    else if (language === 'PYTHON') solutionCode = solution.python;

    const reqBody = {
        language,
        codeContent,
        userInput,
        solutionCode
    }
    try {
        const response = await axios.post("http://host.docker.internal:5151/api/execute-user-input", reqBody);
        return response.data;
    } catch (error) {
        console.error(error.response.data.message);
        throw new ErrorResponse(error.response.data.message, error.response.status);
    }
});

module.exports = compileAndRunCodeOnUserInput;