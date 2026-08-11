package com.sahil.career_guidance_ai.service;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    @Autowired
    private GoogleAiGeminiChatModel model;

    public String testGemini() {

        return model.chat(
        		"You are a career guidance assistant. Say hello to Sahil and tell him AI integration is working successfully."
        );
    }
}