package com.example.onlinejudge.service.impl;

import com.example.onlinejudge.dto.CreateUserDto;
import com.example.onlinejudge.dto.ProfileDto;
import com.example.onlinejudge.dto.UserResponseDto;
import com.example.onlinejudge.exception.BadRequestException;
import com.example.onlinejudge.exception.ResourceNotFoundException;
import com.example.onlinejudge.models.*;
import com.example.onlinejudge.repository.UserRepository;
import com.example.onlinejudge.service.UserService;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void registerUser(CreateUserDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail());
        if(user != null) {
            log.error("User already exists with this email !!");
            throw new BadRequestException("User already exists with this email.");
        }
        User newUser = modelMapper.map(userDto, User.class);
        newUser.setRole("ROLE_USER");
        userRepository.save(newUser);
    }

    @Override
    public ProfileDto getUserDetails(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        Integer easySolved = 0, mediumSolved = 0, hardSolved = 0;
        List<Submission> submissionList = userOptional.get().getSubmissions();
        Set<String> seen = new HashSet<>();
        for(Submission submission : submissionList) {
            Question question = submission.getQuestion();
            if(submission.getStatus() == Status.ACCEPTED) {
                if(!seen.contains(question.getQuestionId())) {
                    seen.add(question.getQuestionId());
                    if (question.getDifficulty() == Difficulty.EASY) easySolved++;
                    else if (question.getDifficulty() == Difficulty.MEDIUM) mediumSolved++;
                    else hardSolved++;
                }
            }
        }
        Integer totalSubmission = submissionList.size();
        Integer correctSubmission = easySolved + mediumSolved + hardSolved;
        Double accuracy = totalSubmission * 1.0 / totalSubmission;
        Integer totalPoints = easySolved * 10 + mediumSolved * 20 + hardSolved * 30;
        return new ProfileDto(userId, userOptional.get().getName(), userOptional.get().getEmail(),
                correctSubmission, easySolved, mediumSolved, hardSolved, accuracy, totalPoints);
    }
}
