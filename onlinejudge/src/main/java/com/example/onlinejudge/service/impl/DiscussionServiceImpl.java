package com.example.onlinejudge.service.impl;

import com.example.onlinejudge.dto.DiscussionDto;
import com.example.onlinejudge.exception.BadRequestException;
import com.example.onlinejudge.exception.ResourceNotFoundException;
import com.example.onlinejudge.models.Discussion;
import com.example.onlinejudge.models.Question;
import com.example.onlinejudge.models.User;
import com.example.onlinejudge.repository.DiscussionRepository;
import com.example.onlinejudge.repository.QuestionRepository;
import com.example.onlinejudge.repository.UserRepository;
import com.example.onlinejudge.service.DiscussionService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class DiscussionServiceImpl implements DiscussionService {

    @Autowired
    private DiscussionRepository discussionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public DiscussionDto createDiscussion(String userId, String questionId, DiscussionDto discussionDto) {
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if(questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Question", "id", questionId);
        }
        Discussion discussion = modelMapper.map(discussionDto, Discussion.class);
        discussion.setQuestion(questionOptional.get());
        discussion.setUser(userOptional.get());
        discussion.setTimeStamp(LocalDateTime.now());
        Discussion savedDiscussion = discussionRepository.save(discussion);
        return modelMapper.map(savedDiscussion, DiscussionDto.class);
    }

    @Override
    public DiscussionDto getDiscussion(String discussionId) {
        Optional<Discussion> discussionOptional = discussionRepository.findById(discussionId);
        if(discussionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Discusion", "id", discussionId);
        }
        return modelMapper.map(discussionOptional.get(), DiscussionDto.class);
    }

    @Override
    public DiscussionDto updateDiscussion(String userId, String discussionId, DiscussionDto discussionDto) {
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        Optional<Discussion> discussionOptional = discussionRepository.findById(discussionId);
        if(discussionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Discussion", "id", discussionId);
        }
        if(discussionOptional.get().getUser() != userOptional.get()) {
            throw new BadRequestException("Only owner can delete their comment !!");
        }
        Discussion discussion = discussionOptional.get();
        discussion.setTitle(discussionDto.getTitle());
        discussion.setComment(discussionDto.getComment());
        discussion.setTimeStamp(LocalDateTime.now());
        Discussion updatedDiscussion = discussionRepository.save(discussion);
        return modelMapper.map(updatedDiscussion, DiscussionDto.class);
    }

    @Override
    public void deleteDiscussion(String userId, String discussionId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        Optional<Discussion> discussionOptional = discussionRepository.findById(discussionId);
        if(discussionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Discussion", "id", discussionId);
        }
        if(discussionOptional.get().getUser() != userOptional.get()) {
            throw new BadRequestException("Only owner can delete their comment !!");
        }
        discussionRepository.delete(discussionOptional.get());
    }
}
