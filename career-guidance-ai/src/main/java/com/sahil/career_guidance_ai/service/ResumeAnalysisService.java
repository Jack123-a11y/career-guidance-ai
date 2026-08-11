package com.sahil.career_guidance_ai.service;

import com.sahil.career_guidance_ai.dto.ResumeAnalysisResponse;
import com.sahil.career_guidance_ai.entity.ResumeAnalysis;
import com.sahil.career_guidance_ai.repository.ResumeAnalysisRepository;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResumeAnalysisService {

    @Autowired
    private GoogleAiGeminiChatModel model;

    @Autowired
    private ResumeAnalysisRepository repository;

    public ResumeAnalysisResponse analyzeResume(
            String resumeText,
            Long userId
    ) {

        String prompt = """
                Analyze this resume and return response ONLY in this format.

                SCORE:
                <number>

                STRENGTHS:
                <strengths>

                WEAKNESSES:
                <weaknesses>

                SUGGESTIONS:
                <suggestions>

                Do not add any extra text.

                Resume:
                """ + resumeText;

        String result;

        try {

            result = model.chat(prompt);
        } catch (Exception e) {
            result = "SCORE:\n0\nSTRENGTHS:\nUnavailable\nWEAKNESSES:\nUnavailable\nSUGGESTIONS:\nAI analysis failed: " + e.getMessage();
        }

        ResumeAnalysisResponse response = parseAiResponse(result);

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setUserId(userId);
        analysis.setAnalysis(result);
        analysis.setScore(response.getScore() != null ? response.getScore() : 0);
        repository.save(analysis);

        return response;
    }

    private ResumeAnalysisResponse parseAiResponse(String raw) {
        ResumeAnalysisResponse response = new ResumeAnalysisResponse();
        response.setRawAnalysis(raw);
        try {
            String scoreBlock = extractSection(raw, "SCORE:", "STRENGTHS:");
            String strengths  = extractSection(raw, "STRENGTHS:", "WEAKNESSES:");
            String weaknesses = extractSection(raw, "WEAKNESSES:", "SUGGESTIONS:");
            String suggestions = extractSection(raw, "SUGGESTIONS:", null);

            response.setScore(Integer.parseInt(scoreBlock.trim().replaceAll("[^0-9]", "")));
            response.setStrengths(strengths.trim());
            response.setWeaknesses(weaknesses.trim());
            response.setSuggestions(suggestions.trim());
        } catch (Exception e) {
            // AI didn't follow the format exactly — rawAnalysis still has everything
            response.setScore(0);
        }
        return response;
    }

    private String extractSection(String text, String startTag, String endTag) {
        int start = text.indexOf(startTag) + startTag.length();
        int end = endTag != null ? text.indexOf(endTag) : text.length();
        return text.substring(start, end);
    }
}
            