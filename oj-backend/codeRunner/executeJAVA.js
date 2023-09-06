const {exec} = require('child_process');

const executeJAVA = async (javaFilePath, input) => {
  return new Promise((resolve, reject) => {
    // Compile the Java code using javac
    const compileCommand = `javac ${javaFilePath}`;
    const compileProcess = exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError || compileStderr) {
        console.error(`Compilation error: ${compileError || compileStderr}`);
        reject(`Compilation failed: ${compileError || compileStderr}`);
        return;
      }

      // If compilation is successful, run the Java program
      const runCommand = `java -classpath ${javaFilePath.replace('submission.java', '')} submission`; // Replace 'Main' with your Java class name
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
    });

    compileProcess.on('error', (error) => {
      reject(`Compilation process error: ${error}`);
    });

    compileProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(`Compilation process exited with code ${code}`);
      }
    });
  });
};

module.exports = executeJAVA;
