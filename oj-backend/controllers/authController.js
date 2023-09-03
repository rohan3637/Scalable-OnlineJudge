const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ErrorResponse = require('../utils/ErrorResponse');

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next(new ErrorResponse("Missing required fields !!", 404));
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return next(new ErrorResponse("User already exists with this email !!", 400));
    }
    const newUser = await User.create({
        username, email, password
    });
    const responseUser = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
    };
    res.status(201).json(responseUser);
});

module.exports = { registerUser };  