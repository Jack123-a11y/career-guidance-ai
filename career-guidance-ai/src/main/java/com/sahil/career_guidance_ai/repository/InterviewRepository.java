package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository
        extends JpaRepository<Interview, Long> {
}