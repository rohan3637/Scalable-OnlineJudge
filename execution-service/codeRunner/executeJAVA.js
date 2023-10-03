const {exec} = require('child_process');
const asyncHandler = require("express-async-handler");

const executeJAVA = {
  async compile(javaFilePath) {
    return new Promise((resolve, reject) => {
      // Compile the Java code using javac
      console.log(javaFilePath)
      const compileCommand = `javac ${javaFilePath}`;
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError || compileStderr) {
          reject(`Compilation failed: ${compileError || compileStderr}`);
        } else {
          resolve();
        }
      });
    });
  },
  
  async execute(javaFilePath, input, idx) {
    return new Promise((resolve, reject) => {
      // If compilation is successful, run the JAVA program
      const pathSegments = javaFilePath.split('/');
      const className = pathSegments[pathSegments.length - 1].replace('.java', '');
      const runCommand = `java -classpath ${javaFilePath.replace(`${className}.java`, '')} ${className}`;
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
        reject(`Time Limit Exceeded (TLE) on testcase: ${idx}`);
      }, 1000); 
    });
  },
};

module.exports = executeJAVA;
