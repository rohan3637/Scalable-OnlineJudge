const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const executeCPP = require('./executeCPP');
const executeJAVA = require('./executeJAVA');
const executePy = require('./executePy');
const executeJS = require('./executeJS');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require("express-async-handler");

const compileAndRunCodeOnTestCases = asyncHandler(async (language, codeContent, testcases) => {
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

    try {
      const results = await Promise.all(testcases.map(async (testCase) => {
          const { input, expectedOutput } = testCase;
          const result = await executeFunction(codeFilePath, input);

          // Check if the output matches the expected output
          const isTestCasePassed = result.trim() === expectedOutput.trim();
          return { input, actualOutput: result, expectedOutput, passed: isTestCasePassed };
      }));
      return results;
  } catch (error) {
      return new ErrorResponse(error, 500);
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

module.exports = compileAndRunCodeOnTestCases;