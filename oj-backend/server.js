const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/connectDB");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

connectDb();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/discussion", discussionRoutes);
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
