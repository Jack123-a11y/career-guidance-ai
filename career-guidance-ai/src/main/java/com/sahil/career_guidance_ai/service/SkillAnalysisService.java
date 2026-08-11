package com.sahil.career_guidance_ai.service;

import com.sahil.career_guidance_ai.dto.SkillAnalysisResponse;
import com.sahil.career_guidance_ai.entity.SkillAnalysis;
import com.sahil.career_guidance_ai.repository.SkillAnalysisRepository;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sahil.career_guidance_ai.repository.ResumeRepository;
import com.sahil.career_guidance_ai.entity.Resume;
@Service
public class SkillAnalysisService {

    @Autowired
    private GoogleAiGeminiChatModel model;
    @Autowired
    private ResumeRepository resumeRepository;
    @Autowired
    private SkillAnalysisRepository repository;
    public SkillAnalysisResponse analyzeSkills(
            String targetRole,
            Long userId
    )
    
    
    
    {
    	 Resume latestResume =
    	            resumeRepository
    	                    .findTopByUserIdOrderByUploadedAtDesc(userId);

    	    String resumeText =
    	            latestResume.getExtractedText();

    	    String prompt = """
    	            Analyze this resume against the target role.

    	            Target Role:
    	            """ + targetRole + """

    	            Return ONLY in this format:

    	            CURRENT_SKILLS:
    	            <skills>

    	            MISSING_SKILLS:
    	            <skills>

    	            RECOMMENDATIONS:
    	            <recommendations>

    	            Resume:
    	            """ + resumeText;
        String result;

        try {

            result = model.chat(prompt);

            System.out.println("SKILL ANALYSIS START");
            System.out.println(result);
            System.out.println("SKILL ANALYSIS END");

        } catch (Exception e) {

            result = "Skill Analysis Failed: "
                    + e.getMessage();
        }
        SkillAnalysisResponse response =
                new SkillAnalysisResponse();

        String currentSkills = "";
        String missingSkills = "";
        String recommendations = "";

        try {

            currentSkills = result
                    .split("CURRENT_SKILLS:")[1]
                    .split("MISSING_SKILLS:")[0]
                    .trim();

            missingSkills = result
                    .split("MISSING_SKILLS:")[1]
                    .split("RECOMMENDATIONS:")[0]
                    .trim();

            recommendations = result
                    .split("RECOMMENDATIONS:")[1]
                    .trim();

        } catch (Exception e) {

            System.out.println(
                    "Skill Parsing Error: "
                            + e.getMessage()
            );
        }

        response.setCurrentSkills(currentSkills);
        response.setMissingSkills(missingSkills);
        response.setRecommendations(recommendations);

        SkillAnalysis skillAnalysis = new SkillAnalysis();

        skillAnalysis.setUserId(userId);
        skillAnalysis.setCurrentSkills(currentSkills);
        skillAnalysis.setMissingSkills(missingSkills);
        skillAnalysis.setRecommendations(recommendations);

        repository.save(skillAnalysis);
        return response;
        
    }
}