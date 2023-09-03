package com.example.onlinejudge.dto;

import com.example.onlinejudge.models.Submission;
import jakarta.persistence.Column;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {

    private String userId;
    private String name;
    private String email;
}
