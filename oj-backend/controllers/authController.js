const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next(new ErrorResponse("Missing required fields !!", 400));
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return next(new ErrorResponse("User already exists with this email !!", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username, 
        email, 
        password: hashedPassword,
        score: 0
    });
    const responseUser = {
        userId: newUser._id,
        name: newUser.username,
        email: newUser.email,
        role: newUser.role
    };
    res.status(201).json(responseUser);
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorResponse("Missing required fields !!", 400));  
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse(`User not found with this email: ${email}`, 404));
    }
    if (await bcrypt.compare(password, user.password)) {
      const jwtToken = jwt.sign({
        user: {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
      }, 
        process.env.JWT_SECRET,
        { expiresIn: "1000m" }  
      );
      res.status(200).json({
        success: true,
        jwtToken: jwtToken 
      })
    }
    else {
      return next(new ErrorResponse("Invalid username or password !!", 401)); 
    } 
});

module.exports = { registerUser, loginUser };  