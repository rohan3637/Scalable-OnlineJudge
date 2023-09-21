const { exec } = require('child_process');
const path = require('path');

const executeCPP = {
  async compile(cppFilePath) {
    return new Promise((resolve, reject) => {
      // Compile the C++ code using g++
      const pathSegments = cppFilePath.split('/');
      const className = pathSegments[pathSegments.length - 1].replace('.cpp', '');
      const compiledExePath = path.join(path.dirname(cppFilePath), `${className}.exe`); // Get the correct path to the executable
      const compileCommand = `g++ ${cppFilePath} -o ${compiledExePath}`;
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError || compileStderr) {
          reject(`Compilation failed: ${compileError || compileStderr}`);
        } else {
          resolve(compiledExePath);
        }
      });
    });
  },
  
  async execute(cppFilePath, input, idx) {
    return new Promise((resolve, reject) => {
      // If compilation is successful, run the C++ program
      const pathSegments = cppFilePath.split('/');
      const className = pathSegments[pathSegments.length - 1].replace('.cpp', '');
      const runCommand = path.join(path.dirname(cppFilePath), `${className}.exe`);
      const runProcess = exec(runCommand, (runError, runStdout, runStderr) => {
          if (runError || runStderr) {
            reject(`Execution failed: ${runError || runStderr}`);
          } else {
            resolve(runStdout);
          }
      });

      runProcess.stdin.write(input);
      runProcess.stdin.end();

      runProcess.on('exit', (code) => {
        if (code !== 0) {
          reject(`C++ program exited with non-zero code: ${code}`);
        }
      });
  
      setTimeout(() => {
        runProcess.kill(); 
        reject(`Time Limit Exceeded (TLE) on testcase: ${idx}`);
      }, 1000); 
    });
  },
};


module.exports = executeCPP;
