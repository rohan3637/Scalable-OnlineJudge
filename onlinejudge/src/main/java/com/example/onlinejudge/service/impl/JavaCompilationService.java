package com.example.onlinejudge.service.impl;

import com.example.onlinejudge.dto.TestResultDto;
import com.example.onlinejudge.exception.CompilationException;
import com.example.onlinejudge.models.TestCase;
import org.springframework.stereotype.Service;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JavaCompilationService {

    public List<TestResultDto> runCodeOnTestCases(String code, List<TestCase> testCases) throws Exception {
        List<TestResultDto> results = new ArrayList<>();
        File tempDir = new File("temp");
        tempDir.mkdirs();
        File javaFile = new File(tempDir, "UserSubmission.java");
        try {
            // Write code to the .java file
            try (FileWriter fileWriter = new FileWriter(javaFile)) {
                fileWriter.write(code);
            }
            // Compile the code
            Process compileProcess = Runtime.getRuntime().exec("javac " + javaFile.getAbsolutePath());
            int compilationResult = compileProcess.waitFor();
            if (compilationResult != 0) {
                throw new CompilationException("Compilation failed.");
            }
            for (TestCase testCase : testCases) {
                // Create a new process builder to execute the Java program
                ProcessBuilder processBuilder = new ProcessBuilder("java", "-classpath", tempDir.getPath(), "UserSubmission");
                Process executionProcess = processBuilder.start();

                // Write the test case input to the program's standard input
                try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(executionProcess.getOutputStream()))) {
                    writer.write(testCase.getInput());
                }

                // Capture the standard output and standard error of the program
                String standardOutput;
                String standardError;
                try (InputStreamReader inputReader = new InputStreamReader(executionProcess.getInputStream());
                     InputStreamReader errorReader = new InputStreamReader(executionProcess.getErrorStream())) {

                    // Read the program's standard output
                    standardOutput = new BufferedReader(inputReader).lines().collect(Collectors.joining("\n"));
                    // Read the program's standard error (if any)
                    standardError = new BufferedReader(errorReader).lines().collect(Collectors.joining("\n"));
                }

                // Wait for the program to complete and get its exit code
                int exitCode = executionProcess.waitFor();

                // Check if the program executed successfully (exit code 0)
                if (exitCode != 0) {
                    throw new RuntimeException("Execution failed with exit code: " + exitCode + "\nError:\n" + standardError);
                }
                String expectedOutput = testCase.getExpectedOutput();
                boolean isTestCasePassed = standardOutput.trim().equals(expectedOutput.trim());
                results.add(new TestResultDto(testCase.getInput(), standardOutput.trim(), expectedOutput.trim(), isTestCasePassed));
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            throw new Exception("Execution failed for one or more test cases.");
        } finally {
            javaFile.delete();
        }
        return results;
    }


}
