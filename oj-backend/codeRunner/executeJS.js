const { exec } = require('child_process');
const asyncHandler = require("express-async-handler");

const executeJS =  {
  async execute(jsFilePath, input) {
    return new Promise((resolve, reject) => {
      const runCommand = "node " + `${jsFilePath}`;
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
  

module.exports = executeJS;