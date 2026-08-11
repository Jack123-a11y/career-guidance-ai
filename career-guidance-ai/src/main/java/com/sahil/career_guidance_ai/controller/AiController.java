package com.sahil.career_guidance_ai.controller;

import com.sahil.career_guidance_ai.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AiController {

    @Autowired
    private AiService aiService;
    @GetMapping("/ai/hello")
    public String hello() {
        return "AI Controller Working";
    }
    @GetMapping("/ai/test2")
    public String test2() {
        return "TEST2";
    }
    @GetMapping("/ai/test")
    public String testAi()
    {

        return aiService.testGemini();
    }
}