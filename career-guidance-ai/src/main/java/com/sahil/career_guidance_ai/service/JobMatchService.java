package com.sahil.career_guidance_ai.service;

import com.sahil.career_guidance_ai.dto.JobMatchResponse;
import com.sahil.career_guidance_ai.entity.JobMatch;
import com.sahil.career_guidance_ai.entity.Resume;
import com.sahil.career_guidance_ai.repository.JobMatchRepository;
import com.sahil.career_guidance_ai.repository.ResumeRepository;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class JobMatchService {

    @Autowired
    private GoogleAiGeminiChatModel model;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private JobMatchRepository jobMatchRepository;

    public JobMatchResponse matchJob(String jobDescription, Long userId) {

        Resume latestResume = resumeRepository.findTopByUserIdOrderByUploadedAtDesc(userId);
        if (latestResume == null) {
            throw new RuntimeException("No resume found for user");
        }

        String resumeText = latestResume.getExtractedText();

        String prompt = """
                You are an expert technical recruiter.
                Compare the candidate's resume against the job description below.
                Return ONLY in this exact format, nothing else:
                MATCH_SCORE:
                <number from 0 to 100>
                MATCHED_SKILLS:
                <comma-separated list of skills from the resume that match the job description>
                MISSING_SKILLS:
                <comma-separated list of important skills in the job description that are missing from the resume>
                RECOMMENDATION:
                <2-3 sentences of practical advice on how to improve the match>
                Job Description:
                """ + jobDescription + """
                Resume:
                """ + resumeText;

        String result;
        try {
            result = model.chat(prompt);
        } catch (Exception e) {
            result = "MATCH_SCORE:\n0\nMATCHED_SKILLS:\nUnavailable\nMISSING_SKILLS:\nUnavailable\nRECOMMENDATION:\nAI analysis failed: " + e.getMessage();
        }

        JobMatchResponse response = parseAiResponse(result);

        JobMatch jobMatch = new JobMatch();
        jobMatch.setUserId(userId);
        jobMatch.setJobDescription(jobDescription);
        jobMatch.setMatchScore(response.getMatchScore());
        jobMatch.setMatchedSkills(response.getMatchedSkills());
        jobMatch.setMissingSkills(response.getMissingSkills());
        jobMatch.setRecommendation(response.getRecommendation());
        jobMatch.setCreatedAt(LocalDateTime.now());
        jobMatchRepository.save(jobMatch);

        return response;
    }

    private JobMatchResponse parseAiResponse(String raw) {
        JobMatchResponse response = new JobMatchResponse();
        try {
            String scoreBlock = extractSection(raw, "MATCH_SCORE:", "MATCHED_SKILLS:");
            String matched = extractSection(raw, "MATCHED_SKILLS:", "MISSING_SKILLS:");
            String missing = extractSection(raw, "MISSING_SKILLS:", "RECOMMENDATION:");
            String recommendation = extractSection(raw, "RECOMMENDATION:", null);

            response.setMatchScore(Integer.parseInt(scoreBlock.trim().replaceAll("[^0-9]", "")));
            response.setMatchedSkills(matched.trim());
            response.setMissingSkills(missing.trim());
            response.setRecommendation(recommendation.trim());
        } catch (Exception e) {
            response.setMatchScore(0);
            response.setMatchedSkills("Unavailable");
            response.setMissingSkills("Unavailable");
            response.setRecommendation("Couldn't parse AI response. Please try again.");
        }
        return response;
    }

    private String extractSection(String text, String startTag, String endTag) {
        int start = text.indexOf(startTag) + startTag.length();
        int end = endTag != null ? text.indexOf(endTag) : text.length();
        return text.substring(start, end);
    }
}