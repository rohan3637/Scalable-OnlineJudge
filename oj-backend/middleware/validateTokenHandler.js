const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new ErrorResponse("User is not authorized !!", 401));
      }  
      req.user = decoded.user;
      next();      
    })
  }
  if (!token) {
    return next(new ErrorResponse("User is not authorized or token is missing", 401));
  }
})

module.exports = validateToken;