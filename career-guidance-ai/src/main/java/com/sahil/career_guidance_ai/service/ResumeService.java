package com.sahil.career_guidance_ai.service;

import com.sahil.career_guidance_ai.dto.ResumeAnalysisResponse;
import com.sahil.career_guidance_ai.dto.ResumeResponse;
import com.sahil.career_guidance_ai.entity.Resume;
import com.sahil.career_guidance_ai.entity.User;
import com.sahil.career_guidance_ai.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PdfParserService pdfParserService;

    @Autowired
    private SkillAnalysisService skillAnalysisService;
    
    @Autowired
    private ResumeAnalysisService resumeAnalysisService;

    public ResumeResponse uploadResume(MultipartFile file, String email) throws Exception {

        // Find logged-in user
        User user = userService.findByEmail(email);

        // Save file locally
        String uploadDir = System.getProperty("user.dir")
                + File.separator
                + "uploads";

        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filePath =
                uploadDir + File.separator + file.getOriginalFilename();

        File destination = new File(filePath);

        file.transferTo(destination);

        // Extract text from PDF
        String extractedText =
                pdfParserService.extractText(destination);

        // Create Resume object
        Resume resume = new Resume();

        resume.setFileName(file.getOriginalFilename());
        resume.setFilePath(filePath);
        resume.setExtractedText(extractedText);
        resume.setUploadedAt(LocalDateTime.now());
        resume.setUser(user);

        // Save Resume
        Resume savedResume = resumeRepository.save(resume);

        // AI Analysis
        ResumeAnalysisResponse analysisResponse =
                resumeAnalysisService.analyzeResume(
                        extractedText,
                        user.getId()
                );
        skillAnalysisService.analyzeSkills(
                extractedText,
                user.getId()
        );
        // Create Response DTO
        ResumeResponse response = new ResumeResponse();
        response.setResumeId(savedResume.getId());
        response.setScore(analysisResponse.getScore());
        response.setStrengths(analysisResponse.getStrengths());
        response.setWeaknesses(analysisResponse.getWeaknesses());
        response.setSuggestions(analysisResponse.getSuggestions());
        return response;
    }
}