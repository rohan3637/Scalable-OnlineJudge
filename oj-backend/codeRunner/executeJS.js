const { exec } = require('child_process');

const executeJS = {
  async execute(jsFilePath, input) {
    return new Promise((resolve, reject) => {
      // Run the JS script
      const runCommand = `node ${jsFilePath}`;
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

module.exports = executeJS;
