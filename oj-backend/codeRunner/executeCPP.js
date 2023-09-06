const { exec } = require('child_process');

const executeCPP = async (cppFilePath, input) => {
  return new Promise((resolve, reject) => {
    // Compile the C++ code using g++
    const compileCommand = `g++ ${cppFilePath} -o ${cppFilePath}.out`;
    const compileProcess = exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError || compileStderr) {
        console.error(`Compilation error: ${compileError || compileStderr}`);
        reject(`Compilation failed: ${compileError || compileStderr}`);
        return;
      }

      // If compilation is successful, run the C++ program
      console.log(cppFilePath);
      const runCommand = `./${cppFilePath.replace('.cpp', '')}.out`; // Assuming the compiled executable has the same name as the source file
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

module.exports = executeCPP;
