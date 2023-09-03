package com.example.onlinejudge.controller;

import com.example.onlinejudge.dto.ApiResponse;
import com.example.onlinejudge.dto.CreateUserDto;
import com.example.onlinejudge.dto.ProfileDto;
import com.example.onlinejudge.dto.UserResponseDto;
import com.example.onlinejudge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register_user")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody CreateUserDto createUserDto) {
        userService.registerUser(createUserDto);
        ApiResponse apiResponse = new ApiResponse("User regsitered successfully !!", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/get_user_details")
    public ResponseEntity<ProfileDto> getUserDetails(@RequestParam String userId) {
        ProfileDto user = userService.getUserDetails(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
