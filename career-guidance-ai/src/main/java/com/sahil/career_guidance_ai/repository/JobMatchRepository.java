package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.JobMatch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobMatchRepository extends JpaRepository<JobMatch, Long> {
}