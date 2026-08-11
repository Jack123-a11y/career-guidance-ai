package com.sahil.career_guidance_ai.service;

import com.sahil.career_guidance_ai.dto.ChatResponse;
import com.sahil.career_guidance_ai.entity.ChatMessage;
import com.sahil.career_guidance_ai.entity.Resume;
import com.sahil.career_guidance_ai.repository.ChatMessageRepository;
import com.sahil.career_guidance_ai.repository.ResumeRepository;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChatService {

    @Autowired
    private GoogleAiGeminiChatModel model;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;



public ChatResponse sendMessage(
        String message,
        Long userId
) {

    Resume latestResume =
            resumeRepository
                    .findTopByUserIdOrderByUploadedAtDesc(userId);

    String resumeText = "";

    if (latestResume != null) {
        resumeText =
                latestResume.getExtractedText();
    }

    ChatMessage userMessage =
            new ChatMessage();

    userMessage.setUserId(userId);
    userMessage.setRole("USER");
    userMessage.setMessage(message);
    userMessage.setCreatedAt(LocalDateTime.now());

    chatMessageRepository.save(userMessage);

    String prompt = """
            You are an AI Career Mentor.

            Your job is to help the user with:

            - Resume Review
            - Career Guidance
            - Learning Roadmaps
            - Technical Concepts
            - Interview Preparation
            - Skill Improvement
            - Project Suggestions
Always give practical, structured and easy-to-understand answers.

If the user's resume is available, use it to personalize your response.
            User Resume:

            """ + resumeText + """

            User Question:

            """ + message;

    String aiReply;
    try {
        aiReply = model.chat(prompt);
    } catch (Exception e) {
        aiReply = "Sorry, I couldn't process that right now. Please try again in a moment.";
    }
    
    
    ChatMessage aiMessage =
            new ChatMessage();

    aiMessage.setUserId(userId);
    aiMessage.setRole("AI");
    aiMessage.setMessage(aiReply);
    aiMessage.setCreatedAt(LocalDateTime.now());

    chatMessageRepository.save(aiMessage);

    ChatResponse response =
            new ChatResponse();

    response.setReply(aiReply);

    return response;
}
}