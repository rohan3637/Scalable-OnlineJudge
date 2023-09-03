package com.example.onlinejudge.service;

import com.example.onlinejudge.dto.CreateUserDto;
import com.example.onlinejudge.dto.UserDto;

public interface UserService {

    public void registerUser(CreateUserDto userDto);
    public UserDto getUserDetails(String userId);
}
