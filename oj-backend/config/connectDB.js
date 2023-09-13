const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/online-judge';

const connectDb = asyncHandler(async (next) => {
    try {
        const connect = await mongoose.connect(dbUrl);
        console.log(`Database connected: ${connect.connection.host} ${connect.connection.name}`)
    } catch (err) {
        return next(new ErrorResponse(err), 500);
        process.exit(1);
    }
});

module.exports = connectDb;