const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const executeCPP = require('./executeCPP');
const executeJAVA = require('./executeJAVA');
const executePy = require('./executePy');
const executeJS = require('./executeJS');
const ErrorResponse = require('../utils/ErrorResponse');

const compileAndRunCodeOnTestCases = async (language, codeContent, testcases) => {
    // Create a temporary directory
    const tempDir = path.join(__dirname, 'temp');
    fs.mkdirSync(tempDir, { recursive: true });

    // Write code to a temporary file
    const codeFilePath = path.join(tempDir, 'submission.' + getExtensionForLanguage(language));
    fs.writeFileSync(codeFilePath, codeContent);

    const results = [];
    
    // Determine the execution function based on the language
    let executeFunction;
    if (language === 'JAVASCRIPT') executeFunction = executeJS;
    else if (language === 'JAVA') executeFunction = executeJAVA;
    else if (language === 'CPP') executeFunction = executeCPP;
    else if (language === 'PYTHON') executeFunction = executePy;

    await Promise.all(testcases.map(async (testCase) => {
        try {
          const { input, expectedOutput } = testCase;
          const result = await executeFunction(codeFilePath, input);

          // Check if the output matches the expected output
          const isTestCasePassed = result.trim() === expectedOutput.trim();
          results.push({ input, actualOutput: result, expectedOutput, passed: isTestCasePassed });  
        } catch (error) {
           throw new ErrorResponse(error.message, 500);
        }
    }));

    //await new Promise((resolve) => setTimeout(resolve, 1000));
    // Clean up the temporary directory
    //fs.rmdirSync(tempDir, { recursive: true });
    return results;
}

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
        throw new Error(`Unsupported language: ${language}`);
    }
  }

module.exports = compileAndRunCodeOnTestCases;