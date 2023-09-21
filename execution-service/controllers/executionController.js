const asyncHandler = require("express-async-handler");
const ErrorResponse = require('../utils/errorResponse');
const executeCPP = require('../codeRunner/executeCPP');
const executeJAVA = require('../codeRunner/executeJAVA');
const executePy = require('../codeRunner/executePy');
const executeJS = require('../codeRunner/executeJS');
const fs = require('fs');
const path = require('path');
const { setupRabbitMQ } = require('../config/connectRabbitMQ');

const executeCode = async() => {
  const rabbitMQChannel = await setupRabbitMQ();
  // Consume both queues/topics
  rabbitMQChannel.consume('userInput-queue', (msg) => {
    rabbitMQChannel.ack(msg);
    executeCodeOnUserInput(msg, rabbitMQChannel);
  });

  rabbitMQChannel.consume('submission-queue', (msg) => {
    rabbitMQChannel.ack(msg);
    executeCodeOnTestCases(msg, rabbitMQChannel);
  });
}

const executeCodeOnUserInput = asyncHandler(async(msg, rabbitMQChannel) => {
  try {
    const data = JSON.parse(msg.content.toString());
    const { language, codeContent, userInput, solutionCode } = data;
    if (!language || !codeContent || !userInput || !solutionCode) {
      let errResp = {message: "Missing required fields !!", statusCode: 400};
      rabbitMQChannel.sendToQueue('ui-response-queue', Buffer.from(JSON.stringify(errResp)));
      return;
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
        executeFunction.execute(userCodeFilePath, userInput, 0), 
        executeFunction.compile ? await executeFunction.compile(solutionFilePath) : null,
        executeFunction.execute(solutionFilePath, userInput, 0)
      ]);
      const isTestCasePassed = actualOutput.trim() === expectedOutput.trim();
      const response = { userInput, actualOutput: actualOutput.trim(), expectedOutput: expectedOutput.trim(), passed: isTestCasePassed };
      rabbitMQChannel.sendToQueue('ui-response-queue', Buffer.from(JSON.stringify(response)));
    } catch (error) {
      errResp = {message: error, statusCode: 400};
      rabbitMQChannel.sendToQueue('ui-response-queue', Buffer.from(JSON.stringify(errResp)));
    } finally {
        fs.rmdirSync(tempDir, { recursive: true });
    }
  } catch (error) {
    errResp = {message: error.message, statusCode: 400};
    rabbitMQChannel.sendToQueue('ui-response-queue', Buffer.from(JSON.stringify(errResp)));
    rabbitMQChannel.ack(msg);
  }
});

const executeCodeOnTestCases = asyncHandler(async(msg, rabbitMQChannel) => {
  try {
    const data = JSON.parse(msg.content.toString());
    const { language, codeContent, testcases } = data;

    if (!language || !codeContent || !testcases) {
      let errResp = {message: "Missing required fields !!", statusCode: 400};
      rabbitMQChannel.sendToQueue('ui-response-queue', Buffer.from(JSON.stringify(errResp)));
      return;
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
        errResp = {message: compileError, statusCode: 400};
        rabbitMQChannel.sendToQueue('response-queue', Buffer.from(JSON.stringify(errResp)));
        return;
      }
    }

    try {
      const results = await Promise.all(testcases.map(async (testCase) => {
        let idx = 1;
        const { input, expectedOutput } = testCase;
        const result = await executeFunction.execute(codeFilePath, input, idx);
        idx = idx + 1;

        // Check if the output matches the expected output
        const isTestCasePassed = result.trim() === String(expectedOutput).trim();
        return { input, actualOutput: result.trim(), expectedOutput, passed: isTestCasePassed };
      }));
      rabbitMQChannel.sendToQueue('response-queue', Buffer.from(JSON.stringify(results)));
    } catch (error) {
      errResp = {message: error, statusCode: 400};
      rabbitMQChannel.sendToQueue('response-queue', Buffer.from(JSON.stringify(errResp)));
    } finally {
      fs.rmdirSync(tempDir, { recursive: true });
    }
  } catch (error) {
    errResp = {message: error.message, statusCode: 500};
    rabbitMQChannel.sendToQueue('response-queue', Buffer.from(JSON.stringify(errResp)));
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

module.exports = { executeCode };  