package com.example.onlinejudge.service;

import com.example.onlinejudge.dto.CreateUserDto;
import com.example.onlinejudge.dto.ProfileDto;
import com.example.onlinejudge.dto.UserResponseDto;

public interface UserService {

    public void registerUser(CreateUserDto userDto);
    public ProfileDto getUserDetails(String userId);
}
