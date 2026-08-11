package com.sahil.career_guidance_ai.controller;

import com.sahil.career_guidance_ai.dto.RoadmapRequest;
import com.sahil.career_guidance_ai.dto.RoadmapResponse;
import com.sahil.career_guidance_ai.service.CurrentUserService;
import com.sahil.career_guidance_ai.service.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/roadmap")
@CrossOrigin("*")
public class RoadmapController {

    @Autowired
    private RoadmapService roadmapService;

    @Autowired
    private CurrentUserService currentUserService;

    @PostMapping("/generate")
    public RoadmapResponse generateRoadmap(
            @RequestBody RoadmapRequest request
    ) {

        Long userId =
                currentUserService
                        .getCurrentUser()
                        .getId();

        return roadmapService.generateRoadmap(
                request.getTargetRole(),
                userId
        );
    }
}