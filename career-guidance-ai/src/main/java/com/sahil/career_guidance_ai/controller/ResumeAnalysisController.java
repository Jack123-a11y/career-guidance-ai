package com.sahil.career_guidance_ai.controller;

import com.sahil.career_guidance_ai.dto.ResumeAnalysisResponse;
import com.sahil.career_guidance_ai.service.ResumeAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resume")
public class ResumeAnalysisController {

    @Autowired
    private ResumeAnalysisService resumeAnalysisService;

    @PostMapping("/analyze")
    public ResumeAnalysisResponse analyzeResume(
            @RequestBody String resumeText
    ) {

        Long userId = 1L; // temporary

        return resumeAnalysisService.analyzeResume(
                resumeText,
                userId
        );
    }
}