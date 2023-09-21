const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require("express-async-handler");
const axios = require('axios');
const { setupRabbitMQ } = require('../config/connectRabbitMQ');
const { response } = require('express');

const compileAndRunCodeOnTestCases = asyncHandler(async (language, codeContent, testcases) => {
  const rabbitMQChannel = await setupRabbitMQ();
  const reqBody = {
    language,
    codeContent,
    testcases
  }

  rabbitMQChannel.sendToQueue('submission-queue', Buffer.from(JSON.stringify(reqBody)));

  return await new Promise((resolve, reject) => {
    // Set up a one-time message consumer
    rabbitMQChannel.consume('response-queue', (msg) => {
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

module.exports = compileAndRunCodeOnTestCases;