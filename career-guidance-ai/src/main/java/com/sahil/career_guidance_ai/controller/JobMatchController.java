package com.sahil.career_guidance_ai.controller;

import com.sahil.career_guidance_ai.dto.JobMatchRequest;
import com.sahil.career_guidance_ai.dto.JobMatchResponse;
import com.sahil.career_guidance_ai.service.CurrentUserService;
import com.sahil.career_guidance_ai.service.JobMatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobmatch")
@CrossOrigin("*")
public class JobMatchController {

    @Autowired
    private JobMatchService jobMatchService;

    @Autowired
    private CurrentUserService currentUserService;

    @PostMapping("/analyze")
    public JobMatchResponse analyzeJobMatch(@RequestBody JobMatchRequest request) {
        Long userId = currentUserService.getCurrentUser().getId();
        return jobMatchService.matchJob(request.getJobDescription(), userId);
    }
}