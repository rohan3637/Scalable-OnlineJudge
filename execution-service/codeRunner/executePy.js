const { exec } = require('child_process');
const asyncHandler = require("express-async-handler");

const PYTHON_PATH = process.env.PYTHON_PATH || "C:/Users/rohan.kumar01/AppData/Local/Programs/Python/Python311/python.exe";

const executePy = {
  async execute(pythonFilePath, input) {
    return new Promise((resolve, reject) => {
      // Run the Python script
      const runCommand = `python3 ${pythonFilePath}`;
      //const runCommand = `${PYTHON_PATH} ${pythonFilePath}`;
      const runProcess = exec(runCommand, (runError, runStdout, runStderr) => {
        if (runError || runStderr) {
          reject(`Execution failed: ${runError || runStderr}`);
        } else {
          resolve(runStdout);
        }
      });

      runProcess.stdin.on('error', (err) => {
        reject(`Error writing to stdin: ${err}`);
      });

      runProcess.on('exit', (code) => {
        if (code !== 0) {
          reject(`JS program exited with non-zero code: ${code}`);
        }
      }); 

      runProcess.stdin.write(input);
      runProcess.stdin.end(); 
    });
  },
};

module.exports = executePy;
