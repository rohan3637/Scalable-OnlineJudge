package com.example.onlinejudge.service;

import com.example.onlinejudge.dto.DiscussionDto;
import com.example.onlinejudge.dto.QuestionDto;
import com.example.onlinejudge.dto.QuestionResponseDto;
import com.example.onlinejudge.models.Discussion;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuestionService {

    public void createQuestion(String userId, QuestionDto questionDto);

    public Page<QuestionResponseDto> getAllQuestionsByFilters(String userId, List<String> topics,
                List<String> difficulties, String searchQuery, Integer pageNo, Integer pageSize);

    public QuestionDto getQuestionDetails(String questionId);

    public QuestionDto updateQuestion(String userId, QuestionDto questionDto);

    public void deleteQuestion(String questionId, String userId);

    public Page<DiscussionDto> getDiscussions(String questionId, String searchQuery, Integer pageNo, Integer pageSize);
}
