package com.sahil.career_guidance_ai.controller;
import com.sahil.career_guidance_ai.service.CurrentUserService;
import com.sahil.career_guidance_ai.dto.ChatRequest;
import com.sahil.career_guidance_ai.dto.ChatResponse;
import com.sahil.career_guidance_ai.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private ChatService chatService;
    @Autowired
    private CurrentUserService currentUserService;
    @PostMapping("/send")
    public ChatResponse sendMessage(
            @RequestBody ChatRequest request
    ) {
    	Long userId =
    	        currentUserService
    	                .getCurrentUser()
    	                .getId();

    	return chatService.sendMessage(
    	        request.getMessage(),
    	        userId
    	
        );
    }
}