package com.example.onlinejudge.service.impl;

import com.example.onlinejudge.dto.*;
import com.example.onlinejudge.exception.ResourceNotFoundException;
import com.example.onlinejudge.models.*;
import com.example.onlinejudge.repository.QuestionRepository;
import com.example.onlinejudge.repository.SubmissionCustomRepository;
import com.example.onlinejudge.repository.SubmissionRepository;
import com.example.onlinejudge.repository.UserRepository;
import com.example.onlinejudge.service.SubmissionService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SubmissionServiceImpl implements SubmissionService {

    @Autowired
    private JavaCompilationService javaCompilationService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private SubmissionCustomRepository submissionCustomRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Override
    public List<TestResultDto> compileAndRun(String userId, String questionId, SubmissionRequestDto submissionRequestDto) throws Exception {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if(questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Question", "id", questionId);
        }
        List<TestCase> testCases = questionOptional.get().getTestCases().subList(0, 2);
        return javaCompilationService.runCodeOnTestCases(submissionRequestDto.getCodeContent(), testCases);
    }

    @Override
    public SubmissionResultDto submitCode(String userId, String questionId, SubmissionRequestDto submissionRequestDto) throws Exception {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if(questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Question", "id", questionId);
        }
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        List<TestCase> testCases = questionOptional.get().getTestCases();
        List<TestResultDto> testResultDtos = javaCompilationService.runCodeOnTestCases(submissionRequestDto.getCodeContent(), testCases);
        Integer testCasesPassed = 0;
        TestResultDto failedTestCase = null;
        for(TestResultDto testResultDto : testResultDtos) {
            if(testResultDto.isPassed()) testCasesPassed++;
            else if(failedTestCase == null) failedTestCase = testResultDto;
        }
        Status status = (testCasesPassed == testCases.size() ? Status.ACCEPTED : Status.REJECTED);
        Submission submission = modelMapper.map(submissionRequestDto, Submission.class);
        submission.setQuestion(questionOptional.get());
        submission.setLangauge(submissionRequestDto.getLanguage());
        submission.setUser(userOptional.get());
        submission.setSubmissionTime(LocalDateTime.now());
        submission.setTestCasePassed(testCasesPassed);
        submission.setStatus(status);
        submissionRepository.save(submission);

        Question question = questionOptional.get();
        question.setTotalSubmission(question.getTotalSubmission() + 1);
        if(status == Status.ACCEPTED) question.setCorrectSubmission(question.getCorrectSubmission() + 1);
        questionRepository.save(question);
        return new SubmissionResultDto(status, testCasesPassed, testCases.size(), failedTestCase);
    }

    @Override
    public SubmissionDto getSubmissionDetail(String submissionId) {
        Optional<Submission> submissionOptional = submissionRepository.findById(submissionId);
        if(submissionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Submission", "id", submissionId);
        }
        Submission submission = submissionOptional.get();
        QuestionResponseDto questionDto = modelMapper.map(submission.getQuestion(), QuestionResponseDto.class);
        UserResponseDto userResponseDto = modelMapper.map(submission.getUser(), UserResponseDto.class);
        SubmissionDto submissionDto = new SubmissionDto();
        submissionDto.setSubmissionId(submissionId);
        submissionDto.setStatus(submission.getStatus());
        submissionDto.setSubmissionTime(submission.getSubmissionTime());
        submissionDto.setLangauge(submission.getLangauge());
        submissionDto.setCodeContent(submission.getCodeContent());
        submissionDto.setQuestionDto(questionDto);
        submissionDto.setUserResponseDto(userResponseDto);
        return submissionDto;
    }

    @Override
    public PagedSubmissionResponse getSubmissionsByFilter(String userId, String questionId, String status,
                     List<String> languages, Integer pageNo, Integer pageSize) {
        List<Submission> submissions = submissionCustomRepository.getSubmissionByFilter(
                userId, questionId, status, languages, pageNo, pageSize);
        Integer totalCount = submissionCustomRepository.getSubmissionCount(userId, questionId, status, languages);
        List<SubmissionDto> submissionDtos = new ArrayList<>();
        submissions.forEach(submission -> {
            SubmissionDto submissionDto = modelMapper.map(submission, SubmissionDto.class);
            if(questionId == null) submissionDto.setQuestionDto(modelMapper.map(submission.getQuestion(), QuestionResponseDto.class));
            if(userId == null) submissionDto.setUserResponseDto(modelMapper.map(submission.getUser(), UserResponseDto.class));
            submissionDtos.add(submissionDto);
        });
        PageInfo pageInfo = new PageInfo(pageNo, pageSize, totalCount);
        return new PagedSubmissionResponse(pageInfo, submissionDtos);
    }
}