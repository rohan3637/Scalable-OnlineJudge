const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const executeCPP = require('./executeCPP');
const executeJAVA = require('./executeJAVA');
const executePy = require('./executePy');
const executeJS = require('./executeJS');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require("express-async-handler");
const Solution = require("../models/solutionModel");

const compileAndRunCodeOnUserInput = asyncHandler(async (language, codeContent, userInput, questionId) => {
    // Create a temporary directory
    const tempDir = path.join(__dirname, 'temp');
    fs.mkdirSync(tempDir, { recursive: true });

    // Write code to a temporary file
    const userCodeFilePath = path.join(tempDir, 'submission.' + getExtensionForLanguage(language));
    fs.writeFileSync(userCodeFilePath, codeContent);
  
    const solution = await Solution.findOne({questionId});

    let executeFunction;
    let solutionCode;
    if (language === 'JAVASCRIPT') {
        executeFunction = executeJS;
        solutionCode = solution.javascript;
    } 
    else if (language === 'JAVA') {
        executeFunction = executeJAVA;
        solutionCode = solution.java;
    }    
    else if (language === 'CPP') {
        executeFunction = executeCPP;
        solutionCode = solution.cpp;
    }    
    else if (language === 'PYTHON') {
        executeFunction = executePy;
        solutionCode = solution.python;
    }

    const solutionFilePath = path.join(tempDir, 'solution.' + getExtensionForLanguage(language));
    fs.writeFileSync(solutionFilePath, solutionCode);

    try {
        const [a, actualOutput, b, expectedOutput] = await Promise.all([ 
            executeFunction.compile ? await executeFunction.compile(userCodeFilePath) : null,
            executeFunction.execute(userCodeFilePath, userInput), 
            executeFunction.compile ? await executeFunction.compile(solutionFilePath) : null,
            executeFunction.execute(solutionFilePath, userInput)
        ]);
        const isTestCasePassed = actualOutput.trim() === expectedOutput.trim();
        return { userInput, actualOutput: actualOutput.trim(), expectedOutput: expectedOutput.trim(), passed: isTestCasePassed };
    } catch (error) {
        return new ErrorResponse(error, 400);
    } finally {
        fs.rmdirSync(tempDir, { recursive: true });
    }
});

const getExtensionForLanguage = (language) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return 'js';
      case 'cpp':
        return 'cpp';
      case 'java':
        return 'java';
      case 'python':
        return 'py';
      default:
        throw new ErrorResponse(`Unsupported language: ${language}`, 400);
    }
}

module.exports = compileAndRunCodeOnUserInput;