const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5151;

// routes
const executionRoutes = require('./routes/executionRoutes');

app.use(express.json());
app.use(cors());
app.use("/api", executionRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});