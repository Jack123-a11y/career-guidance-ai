package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.SkillAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillAnalysisRepository
        extends JpaRepository<SkillAnalysis, Long> {
}