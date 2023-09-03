package com.example.onlinejudge.dto;

import com.example.onlinejudge.models.Langauge;
import com.example.onlinejudge.models.Question;
import com.example.onlinejudge.models.Status;
import com.example.onlinejudge.models.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class SubmissionDto {

    private String submissionId;
    private UserDto user;
    private QuestionDto question;
    private Langauge langauge;
    private Status status;
}
