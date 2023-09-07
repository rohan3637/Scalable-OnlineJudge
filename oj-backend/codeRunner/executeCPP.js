const { exec } = require('child_process');
const asyncHandler = require("express-async-handler");

const executeCPP = {
  async compile(cppFilePath) {
    return new Promise((resolve, reject) => {
      // Compile the C++ code using g++
      const compileCommand = `g++ ${cppFilePath} -o ${cppFilePath.replace('.cpp', '')}.out`;
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError || compileStderr) {
            reject(`Compilation failed: ${compileError || compileStderr}`);
        } else {
            resolve();
        }
      });
    });
  },
  
  async execute(cppFilePath, input) {
    return new Promise((resolve, reject) => {
      // If compilation is successful, run the C++ program
      const runCommand = `./${cppFilePath.replace('.cpp', '')}.out`;
      const runProcess = exec(runCommand, (runError, runStdout, runStderr) => {
          if (runError || runStderr) {
              reject(`Execution failed: ${runError || runStderr}`);
          } else {
              resolve(runStdout);
          }
      });

      runProcess.stdin.write(input);
      runProcess.stdin.end();
    });
  },
};


module.exports = executeCPP;
