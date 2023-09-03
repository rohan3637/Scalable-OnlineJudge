package com.example.onlinejudge.controller;

import com.example.onlinejudge.dto.*;
import com.example.onlinejudge.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping("/add_question")
    public ResponseEntity<ApiResponse> addQuestion(@RequestParam String userId, @RequestBody QuestionDto questionDto) {
        questionService.createQuestion(userId, questionDto);
        ApiResponse apiResponse = new ApiResponse("Question added successfully !!", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/get_questions")
    public ResponseEntity<Page<QuestionResponseDto>> getAllQuestions(
            @RequestParam String userId,
            @RequestParam(required = false) List<String> topics,
            @RequestParam(required = false) List<String> difficulties,
            @RequestParam(defaultValue = "1", required = false) Integer pageNo,
            @RequestParam(defaultValue = "10", required = false) Integer pageSize,
            @RequestParam(required = false) String searchQuery
    ) {
        Page<QuestionResponseDto> questionResponseDtos = questionService.getAllQuestionsByFilters(
                userId, topics, difficulties, searchQuery, pageNo, pageSize);
        return new ResponseEntity<>(questionResponseDtos, HttpStatus.OK);
    }

    @GetMapping("/get_question_details")
    public ResponseEntity<QuestionDto> getAllQuestions(@RequestParam String questionId) {
        QuestionDto questionDto = questionService.getQuestionDetails(questionId);
        return new ResponseEntity<>(questionDto, HttpStatus.OK);
    }
}
