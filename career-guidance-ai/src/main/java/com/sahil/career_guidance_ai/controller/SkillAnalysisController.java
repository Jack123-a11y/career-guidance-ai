package com.sahil.career_guidance_ai.controller;

import com.sahil.career_guidance_ai.dto.SkillAnalysisRequest;
import com.sahil.career_guidance_ai.dto.SkillAnalysisResponse;
import com.sahil.career_guidance_ai.service.SkillAnalysisService;
import com.sahil.career_guidance_ai.service.UserService;
import com.sahil.career_guidance_ai.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/skills")
@CrossOrigin("*")
public class SkillAnalysisController {

    @Autowired
    private SkillAnalysisService skillAnalysisService;

    @Autowired
    private UserService userService;

    @PostMapping("/analyze")
    public SkillAnalysisResponse analyzeSkills(
            @RequestBody SkillAnalysisRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        return skillAnalysisService.analyzeSkills(request.getTargetRole(), user.getId());
    }
}