const {exec} = require('child_process');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require("express-async-handler");

const executeJAVA = asyncHandler(async (javaFilePath, input) => {
  return new Promise((resolve, reject) => {
    // Compile the Java code using javac
    const compileCommand = `javac ${javaFilePath}`;
    const compileProcess = exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError || compileStderr) {
        reject(`Compilation failed: ${compileError || compileStderr}`);
      }

      // If compilation is successful, run the Java program
      const runCommand = `java -classpath ${javaFilePath.replace('submission.java', '')} submission`; // Replace 'Main' with your Java class name
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
  });
});

module.exports = executeJAVA;
