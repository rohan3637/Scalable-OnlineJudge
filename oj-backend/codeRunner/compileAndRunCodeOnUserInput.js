const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require("express-async-handler");
const Solution = require("../models/solutionModel");
const axios = require('axios');
const { setupRabbitMQ } = require('../config/connectRabbitMQ');

const compileAndRunCodeOnUserInput = asyncHandler(async (language, codeContent, userInput, questionId) => {
    const rabbitMQChannel = await setupRabbitMQ();
    const solution = await Solution.findOne({ questionId });
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
    rabbitMQChannel.sendToQueue('userInput-queue', Buffer.from(JSON.stringify(reqBody)));

    // Create a Promise that resolves with the response
    return await new Promise((resolve, reject) => {
        // Set up a one-time message consumer
        rabbitMQChannel.consume('ui-response-queue', (msg) => {
            try {
                const parsedResponse = JSON.parse(msg.content.toString());
                rabbitMQChannel.ack(msg);
                if (parsedResponse.statusCode) resolve(new ErrorResponse(parsedResponse.message, parsedResponse.statusCode));
                else resolve(parsedResponse);
            } catch (error) {
                rabbitMQChannel.ack(msg);
                reject(new ErrorResponse('Error processing response', 500));
            } finally {
                // Remove the consumer to avoid blocking subsequent requests
                rabbitMQChannel.cancel(msg.fields.consumerTag);
            }
        }, { noAck: false }); // Set noAck to false to manually acknowledge the message
    });
});


module.exports = compileAndRunCodeOnUserInput;