const asyncHandler = require("express-async-handler");
const ErrorResponse = require('../utils/errorResponse');
const executeCPP = require('../codeRunner/executeCPP');
const executeJAVA = require('../codeRunner/executeJAVA');
const executePy = require('../codeRunner/executePy');
const executeJS = require('../codeRunner/executeJS');
const fs = require('fs');
const path = require('path');

const executeCodeOnUserInput = asyncHandler(async (req, res, next) => {
    const { language, codeContent, userInput, solutionCode } = req.body;
    if (!language || !codeContent || !userInput || !solutionCode) {
      return next(new ErrorResponse("Missing required fields !!", 400));
    }
    const tempDir = path.join(__dirname, 'temp');
    fs.mkdirSync(tempDir, { recursive: true });

    // Write code to a temporary file
    const userCodeFilePath = path.join(tempDir, 'submission.' + getExtensionForLanguage(language));
    fs.writeFileSync(userCodeFilePath, codeContent);

    let executeFunction;
    if (language === 'JAVASCRIPT') executeFunction = executeJS;
    else if (language === 'JAVA') executeFunction = executeJAVA;
    else if (language === 'CPP') executeFunction = executeCPP;
    else if (language === 'PYTHON') executeFunction = executePy;

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
        const response = { userInput, actualOutput: actualOutput.trim(), expectedOutput: expectedOutput.trim(), passed: isTestCasePassed };
        res.status(200).json(response);
    } catch (error) {
        return next(new ErrorResponse(error, 400));
    } finally {
        fs.rmdirSync(tempDir, { recursive: true });
    }
});

const executeCodeOnTestCases = asyncHandler(async (req, res, next) => {
    console.log("reached here");
    const { language, codeContent, testcases} = req.body;
    if (!language || !codeContent || !testcases) {
      return next(new ErrorResponse("Missing required fields !!", 400));
    }
    // Create a temporary directory
    const tempDir = path.join(__dirname, 'temp');
    fs.mkdirSync(tempDir, { recursive: true });

    // Write code to a temporary file
    const codeFilePath = path.join(tempDir, 'submission.' + getExtensionForLanguage(language));
    fs.writeFileSync(codeFilePath, codeContent);
  
    // Determine the execution function based on the language
    let executeFunction;
    if (language === 'JAVASCRIPT') executeFunction = executeJS;
    else if (language === 'JAVA') executeFunction = executeJAVA;
    else if (language === 'CPP') executeFunction = executeCPP;
    else if (language === 'PYTHON') executeFunction = executePy;

    if (executeFunction.compile) {
      try {
          await executeFunction.compile(codeFilePath);
      } catch (compileError) {
          return new ErrorResponse(compileError, 400);
      }
    }

    try {
      const results = await Promise.all(testcases.map(async (testCase) => {
          const { input, expectedOutput } = testCase;
          const result = await executeFunction.execute(codeFilePath, input);

          // Check if the output matches the expected output
          const isTestCasePassed = result.trim() === String(expectedOutput).trim();
          return { input, actualOutput: result.trim(), expectedOutput, passed: isTestCasePassed };
          
      }));
      res.status(200).json(results);
    } catch (error) {
      return next(new ErrorResponse(error, 400));
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

module.exports = { executeCodeOnUserInput, executeCodeOnTestCases };  