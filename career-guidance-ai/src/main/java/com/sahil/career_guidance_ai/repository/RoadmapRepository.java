package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadmapRepository
        extends JpaRepository<Roadmap, Long> {
}