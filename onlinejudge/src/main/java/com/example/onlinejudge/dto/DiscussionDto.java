package com.example.onlinejudge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscussionDto {

    private String id;
    private UserResponseDto userResponseDto;
    private String title;
    private String comment;
    private LocalDateTime timeStamp;
}
