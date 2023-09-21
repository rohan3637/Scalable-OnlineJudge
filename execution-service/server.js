const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');
const { executeCode } = require('./controllers/executionController');
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5151;

app.use(express.json());
app.use(cors());
executeCode();
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  //startServer();
});
