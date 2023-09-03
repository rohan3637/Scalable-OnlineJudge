package com.example.onlinejudge.service.impl;

import com.example.onlinejudge.dto.CreateUserDto;
import com.example.onlinejudge.dto.UserDto;
import com.example.onlinejudge.exception.BadRequestException;
import com.example.onlinejudge.exception.ResourceNotFoundException;
import com.example.onlinejudge.models.User;
import com.example.onlinejudge.repository.UserRepository;
import com.example.onlinejudge.service.UserService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
    public UserDto getUserDetails(String userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        return modelMapper.map(user.get(), UserDto.class);
    }
}
