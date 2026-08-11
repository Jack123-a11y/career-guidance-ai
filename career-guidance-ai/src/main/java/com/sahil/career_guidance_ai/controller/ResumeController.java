package com.sahil.career_guidance_ai.controller;

import com.sahil.career_guidance_ai.dto.ResumeResponse;
import com.sahil.career_guidance_ai.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.sahil.career_guidance_ai.dto.ResumeStatusResponse;
import com.sahil.career_guidance_ai.entity.Resume;
import com.sahil.career_guidance_ai.entity.User;
import com.sahil.career_guidance_ai.repository.ResumeRepository;
import com.sahil.career_guidance_ai.service.UserService;
import org.springframework.security.core.Authentication;
@RestController
@RequestMapping("/resume")
@CrossOrigin("*")
public class ResumeController {
   
	@Autowired
	private UserService userService;

	@Autowired
	private ResumeRepository resumeRepository;
	
    @Autowired
    private ResumeService resumeService;
    

@GetMapping("/status")
public ResumeStatusResponse getResumeStatus(Authentication authentication) {
    String email = authentication.getName();
    User user = userService.findByEmail(email);
    Resume latest = resumeRepository.findTopByUserIdOrderByUploadedAtDesc(user.getId());

    
    ResumeStatusResponse response = new ResumeStatusResponse();
    if (latest != null) {
        response.setHasResume(true);
        response.setFileName(latest.getFileName());
        response.setResumeId(latest.getId());
    } else {
        response.setHasResume(false);
    }
    return response;
}
    
    
    @GetMapping("/test")
    public String test() {
        return "Resume Controller Working";
    }

    @PostMapping("/upload")
    public ResumeResponse uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws Exception {

        String email = authentication.getName();

        return resumeService.uploadResume(file, email);
    }
}