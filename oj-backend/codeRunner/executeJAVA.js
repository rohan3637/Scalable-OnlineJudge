const {exec} = require('child_process');
const asyncHandler = require("express-async-handler");

const executeJAVA = {
  async compile(javaFilePath) {
    return new Promise((resolve, reject) => {
      // Compile the Java code using javac
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
  
  async execute(javaFilePath, input) {
    return new Promise((resolve, reject) => {
      // If compilation is successful, run the JAVA program
      const runCommand = `java -classpath ${javaFilePath.replace('submission.java', '')} submission`;
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



module.exports = executeJAVA;
