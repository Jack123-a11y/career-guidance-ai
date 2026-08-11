package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
	Resume findTopByUserIdOrderByUploadedAtDesc(Long userId);
}