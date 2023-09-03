package com.example.onlinejudge.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscussionDto {

    private String id;
    private UserDto userDto;
    private String title;
    private String comment;
}
