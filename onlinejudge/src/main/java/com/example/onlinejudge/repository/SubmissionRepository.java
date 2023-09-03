package com.example.onlinejudge.repository;

import com.example.onlinejudge.models.Langauge;
import com.example.onlinejudge.models.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
}
