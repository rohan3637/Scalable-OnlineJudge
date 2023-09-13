const { exec } = require('child_process');
const { error } = require('console');
const asyncHandler = require("express-async-handler");
const path = require('path');

const executeCPP = {
  async compile(cppFilePath) {
    return new Promise((resolve, reject) => {
      // Compile the C++ code using g++
      const compiledExePath = path.join(path.dirname(cppFilePath), 'submission.exe'); // Get the correct path to the executable
      const compileCommand = `g++ ${cppFilePath} -o ${compiledExePath}`;
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError || compileStderr) {
          console.error(compileError || compileStderr);
          reject(`Compilation failed: ${compileError || compileStderr}`);
        } else {
          resolve(compiledExePath);
        }
      });
    });
  },
  
  async execute(cppFilePath, input) {
    return new Promise((resolve, reject) => {
      // If compilation is successful, run the C++ program
      const runCommand = path.join(path.dirname(cppFilePath), 'submission.exe');
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

      runProcess.stdin.write(input);
      runProcess.stdin.end();

      runProcess.on('exit', (code) => {
        if (code !== 0) {
          reject(`C++ program exited with non-zero code: ${code}`);
        }
      });  
    });
  },
};


module.exports = executeCPP;
