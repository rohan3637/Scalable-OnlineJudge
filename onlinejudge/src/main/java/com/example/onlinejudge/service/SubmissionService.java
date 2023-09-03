package com.example.onlinejudge.service;

import com.example.onlinejudge.dto.SubmissionDto;
import com.example.onlinejudge.dto.SubmissionRequestDto;
import com.example.onlinejudge.dto.SubmissionResultDto;
import com.example.onlinejudge.dto.TestResultDto;
import com.example.onlinejudge.models.TestCase;

import java.util.List;
import java.util.Map;

public interface SubmissionService {

    List<TestResultDto> compileAndRun(String userId, String questionId, SubmissionRequestDto submissionRequestDto) throws Exception;
    SubmissionResultDto submitCode(String userId, String questionId, SubmissionRequestDto submissionRequestDto) throws Exception;
    SubmissionDto getSubmissionDetail(String submissionId);
}
