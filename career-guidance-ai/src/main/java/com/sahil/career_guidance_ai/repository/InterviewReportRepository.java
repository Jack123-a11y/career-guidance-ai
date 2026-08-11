package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.InterviewReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewReportRepository
        extends JpaRepository<InterviewReport, Long> {
}