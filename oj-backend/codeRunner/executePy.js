const { exec } = require('child_process');

const executePy = async (pythonFilePath, input) => {
  return new Promise((resolve, reject) => {
    // Run the Python script
    const runCommand = `python3 ${pythonFilePath}`;
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

    runProcess.on('error', (error) => {
      reject(`Execution process error: ${error}`);
    });

    runProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(`Execution process exited with code ${code}`);
      }
    });
  });
};

module.exports = executePy;
