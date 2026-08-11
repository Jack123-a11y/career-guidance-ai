package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewAnswerRepository
        extends JpaRepository<InterviewAnswer, Long> {
}