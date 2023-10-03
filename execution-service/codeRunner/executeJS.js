const { exec } = require('child_process');

const executeJS = {
  async execute(jsFilePath, input, idx) {
    return new Promise((resolve, reject) => {
      // Run the JS script
      const runCommand = `node ${jsFilePath}`;
      console.log(runCommand);
      const runProcess = exec(runCommand, (runError, runStdout, runStderr) => {
        if (runError || runStderr) {
          reject(`Execution failed: ${runError || runStderr}`);
        } else {
          resolve(runStdout);
        }
      });

      runProcess.stdin.write(input);
      runProcess.stdin.end();

      setTimeout(() => {
        runProcess.kill(); 
        reject('Time Limit Exceeded (TLE) on testcase: ' + idx);
      }, 1200); 
    });
  },
};

module.exports = executeJS;
