package com.sahil.career_guidance_ai.controller;
import com.sahil.career_guidance_ai.service.CurrentUserService;
import com.sahil.career_guidance_ai.dto.InterviewRequest;
import com.sahil.career_guidance_ai.dto.InterviewResponse;
import com.sahil.career_guidance_ai.dto.InterviewSubmitRequest;
import com.sahil.career_guidance_ai.dto.InterviewReportResponse;
import com.sahil.career_guidance_ai.service.InterviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interview")
@CrossOrigin("*")
public class InterviewController {


@Autowired
private InterviewService interviewService;
@Autowired
private CurrentUserService currentUserService;
@PostMapping("/start")
public InterviewResponse startInterview(
        @RequestBody InterviewRequest request
) {

	Long userId =
	        currentUserService
	                .getCurrentUser()
	                .getId();

	return interviewService.startInterview(
	        request.getRole(),
	        request.getDifficulty(),
	        request.getInterviewType(),
	        request.getQuestionCount() != null ? request.getQuestionCount() : 5,
	                
	        userId
	);
}

@PostMapping("/submit")
public InterviewReportResponse submitInterview(
        @RequestBody InterviewSubmitRequest request
) {  Long userId = currentUserService.getCurrentUser().getId();
    return interviewService.submitInterview(request,userId);
}


}
