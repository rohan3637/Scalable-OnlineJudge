package com.example.onlinejudge.service.impl;

import com.example.onlinejudge.dto.DiscussionDto;
import com.example.onlinejudge.dto.QuestionDto;
import com.example.onlinejudge.dto.QuestionResponseDto;
import com.example.onlinejudge.exception.BadRequestException;
import com.example.onlinejudge.exception.ResourceNotFoundException;
import com.example.onlinejudge.models.Discussion;
import com.example.onlinejudge.models.Question;
import com.example.onlinejudge.models.User;
import com.example.onlinejudge.repository.*;
import com.example.onlinejudge.service.QuestionService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionCustomRepository questionCustomRepository;

    @Autowired
    private DiscussionCustomRepository discussionCustomRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void createQuestion(String userId, QuestionDto questionDto) {
        Question question = modelMapper.map(questionDto, Question.class);
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        question.setCorrectSubmission(0);
        question.setTotalSubmission(0);
        question.setAuthor(userOptional.get());
        questionRepository.save(question);
    }

    @Override
    public Page<QuestionResponseDto> getAllQuestionsByFilters(String userId, List<String> topics, List<String> difficulties,
                        String searchQuery, Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        List<Question> questionList = questionCustomRepository.getQuestionByFilters(topics, difficulties, searchQuery, pageable);
        List<QuestionResponseDto> questionDtos = questionList.parallelStream()
                .map(question -> modelMapper.map(question, QuestionResponseDto.class))
                .toList();
        Integer count = questionCustomRepository.getCountByFilters(topics, difficulties, searchQuery);
        return new PageImpl<>(questionDtos, pageable, count);
    }

    @Override
    public QuestionDto getQuestionDetails(String questionId) {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if(questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Question", "id", questionId);
        }
        return modelMapper.map(questionOptional.get(), QuestionDto.class);
    }

    @Override
    public QuestionDto updateQuestion(String userId, QuestionDto questionDto) {
        Optional<Question> questionOptional = questionRepository.findById(questionDto.getQuestionId());
        if(questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Question", "id", questionDto.getQuestionId());
        }
        Question question = questionOptional.get();
        if(!question.getAuthor().getUserId().equals(userId)) {
            throw new BadRequestException("Only author can edit their question !!");
        }
        questionRepository.save(modelMapper.map(questionDto, Question.class));
        return questionDto;
    }

    @Override
    public void deleteQuestion(String questionId, String userId) {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if(questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Question", "id", questionId);
        }
        Question question = questionOptional.get();
        if(!question.getAuthor().getUserId().equals(userId)) {
            throw new BadRequestException("Only author can delete their question !!");
        }
        questionRepository.delete(question);
    }

    @Override
    public Page<DiscussionDto> getDiscussions(String questionId, String searchQuery, Integer pageNo, Integer pageSize) {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if(questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Question", "id", questionId);
        }
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        List<Discussion> discussions = discussionCustomRepository.getDiscussionBySearch(questionId, searchQuery, pageable);
        Integer totalCount = discussionCustomRepository.getDiscussionCount(questionId, searchQuery);
        List<DiscussionDto> discussionDtos = discussions.parallelStream()
                .map(discussion -> modelMapper.map(discussion, DiscussionDto.class))
                .toList();
        return new PageImpl<>(discussionDtos, pageable, totalCount);
    }
}
