const { exec } = require('child_process');

const executeJS = async (jsFilePath, input) => {
    return new Promise((resolve, reject) => {
        const runCommand = `node ${jsFilePath}`;
        const runProcess = exec(runCommand, (runError, runStdout, runStderr) => {
            if (runError || runStderr) {
                console.error(`Execution error: ${runError || runStderr}`);
                reject(`Execution failed: ${runError || runStderr}`);
            } else {
                resolve(runStdout);
            }
        });

        runProcess.stdin.write(input);
        runProcess.stdin.end();

        // Handle any error events from the child process
        runProcess.on('error', (error) => {
            reject(`Child process error: ${error}`);
        });

        // Handle any process exit events
        runProcess.on('exit', (code) => {
            if (code !== 0) {
                reject(`Child process exited with code ${code}`);
            }
        });
    });
}

module.exports = executeJS;
