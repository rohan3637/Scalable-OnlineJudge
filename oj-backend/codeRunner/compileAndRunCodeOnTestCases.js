const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require("express-async-handler");
const axios = require('axios');

const compileAndRunCodeOnTestCases = asyncHandler(async (language, codeContent, testcases) => {
  const reqBody = {
    language,
    codeContent,
    testcases
  }
  try {
    const response = await axios.post("http://host.docker.internal:5151/api/execute-test-case", reqBody);
    return response?.data;
  } catch (error) {
    console.error(error.response.data.message);
    throw new ErrorResponse(error.response.data.message, error.response.status);
  }
});

module.exports = compileAndRunCodeOnTestCases;