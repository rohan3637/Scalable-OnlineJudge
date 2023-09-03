package com.example.onlinejudge.service;

import com.example.onlinejudge.dto.DiscussionDto;

public interface DiscussionService {

    DiscussionDto createDiscussion(String userId, String questionId, DiscussionDto discussionDto);
    DiscussionDto getDiscussion(String discussionId);
    DiscussionDto updateDiscussion(String userId, String discussionId, DiscussionDto discussionDto);
    void deleteDiscussion(String userId, String discussionId);

}
