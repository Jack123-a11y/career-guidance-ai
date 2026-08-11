package com.sahil.career_guidance_ai.service;
import org.springframework.beans.factory.annotation.Autowired;

import com.sahil.career_guidance_ai.dto.RoadmapResponse;
import org.springframework.stereotype.Service;
import com.sahil.career_guidance_ai.entity.Resume;
import com.sahil.career_guidance_ai.entity.Roadmap;
import com.sahil.career_guidance_ai.repository.ResumeRepository;
import com.sahil.career_guidance_ai.repository.RoadmapRepository;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import java.time.LocalDateTime;

@Service
public class RoadmapService {
	@Autowired
	private GoogleAiGeminiChatModel model;

	@Autowired
	private ResumeRepository resumeRepository;

	@Autowired
	private RoadmapRepository roadmapRepository;
  
    	
    	public RoadmapResponse generateRoadmap(String targetRole, Long userId) {
    	    Resume latestResume = resumeRepository.findTopByUserIdOrderByUploadedAtDesc(userId);
    	    if (latestResume == null) {
    	        throw new RuntimeException("No resume found for user");
    	    }

    	    String resumeText = latestResume.getExtractedText();
    	    String prompt = """
    	            Based on the user's resume and target role, create a personalized learning roadmap.
    	            Target Role:
    	            """ + targetRole + """
    	            Generate a detailed 12 week roadmap. For EACH week, follow this EXACT format:
    	            WEEK 1: <short title, 4-6 words>
    	            - <topic 1, one short line>
    	            - <topic 2, one short line>
    	            - <topic 3, one short line>
    	            - <topic 4, one short line>
    	            WEEK 2: <short title>
    	            - <topic 1>
    	            - <topic 2>
    	            - <topic 3>
    	            - <topic 4>
    	            Continue this exact pattern until WEEK 12.
    	            Rules: Do not write paragraphs. Do not add any text before WEEK 1 or after WEEK 12.
    	            Each week must have a short title on the same line as "WEEK N:", followed by exactly 3-5 bullet points starting with "-".
    	            Resume:
    	            """ + resumeText;

    	    String roadmapText;
    	    try {
    	        roadmapText = model.chat(prompt);
    	    } catch (Exception e) {
    	        throw new RuntimeException("Roadmap generation failed: " + e.getMessage());
    	    }

    	    Roadmap roadmap = new Roadmap();
    	    roadmap.setUserId(userId);
    	    roadmap.setTargetRole(targetRole);
    	    roadmap.setRoadmap(roadmapText);
    	    roadmap.setCreatedAt(LocalDateTime.now());
    	    roadmapRepository.save(roadmap);

    	    RoadmapResponse response = new RoadmapResponse();
    	    response.setRoadmap(roadmapText);
    	    return response;
    	}}

       

       