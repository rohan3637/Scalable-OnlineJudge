const { exec } = require('child_process');
const asyncHandler = require("express-async-handler");

const PYTHON_PATH = process.env.PYTHON_PATH

const executePy = asyncHandler(async (pythonFilePath, input) => {
  return new Promise((resolve, reject) => {
    // Run the Python script
    const runCommand = `${PYTHON_PATH} ${pythonFilePath}`;
    const runProcess = exec(runCommand, (runError, runStdout, runStderr) => {
      if (runError || runStderr) {
        console.error(`Execution error: ${runError || runStderr}`);
        reject(`Execution failed: ${runError || runStderr}`);
        return;
      } else {
        resolve(runStdout);
      }
    });

    runProcess.stdin.write(input);
    runProcess.stdin.end();
  });
});

module.exports = executePy;
