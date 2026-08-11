package com.sahil.career_guidance_ai.service;
import com.sahil.career_guidance_ai.dto.InterviewEvaluationResponse;
import com.sahil.career_guidance_ai.dto.InterviewAnswerRequest;
import com.sahil.career_guidance_ai.dto.InterviewReportResponse;
import com.sahil.career_guidance_ai.dto.InterviewResponse;
import com.sahil.career_guidance_ai.dto.InterviewSubmitRequest;
import com.sahil.career_guidance_ai.entity.Interview;
import com.sahil.career_guidance_ai.entity.InterviewAnswer;
import com.sahil.career_guidance_ai.entity.InterviewReport;
import com.sahil.career_guidance_ai.entity.Resume;
import com.sahil.career_guidance_ai.repository.InterviewAnswerRepository;
import com.sahil.career_guidance_ai.repository.InterviewReportRepository;
import com.sahil.career_guidance_ai.repository.InterviewRepository;
import com.sahil.career_guidance_ai.repository.ResumeRepository;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.ObjectMapper;
@Service
public class InterviewService {


@Autowired
private GoogleAiGeminiChatModel model;

@Autowired
private ResumeRepository resumeRepository;

@Autowired
private InterviewRepository interviewRepository;

@Autowired
private InterviewAnswerRepository interviewAnswerRepository;

@Autowired
private InterviewReportRepository interviewReportRepository;

@Autowired
private ObjectMapper objectMapper;
public InterviewResponse startInterview(
        String role,
        String difficulty,
        String interviewType,
        int questionCount,

        Long userId
) {

    Resume latestResume =
            resumeRepository
                    .findTopByUserIdOrderByUploadedAtDesc(userId);

    if (latestResume == null) {
        throw new RuntimeException("No resume found");
    }

    String resumeText =
            latestResume.getExtractedText();


    String prompt = """
            You are an expert interviewer.
            Generate exactly """ + questionCount + """
             interview questions.
            Role:
            """ + role + """
            Difficulty:
            """ + difficulty + """
            Interview Type:
            """ + interviewType + """
            Resume:
            """ + resumeText + """
            Rules:
            1. Personalize questions using resume.
            2. Make questions practical.
            3. Return only questions.
            4. Number questions from 1 to
             """
            + questionCount +
            """
            5. Format each question EXACTLY as: N. <question text> on its own line.
            """;

    String questions;
    try {
        questions = model.chat(prompt);
    } catch (Exception e) {
        throw new RuntimeException("Failed to generate questions: " + e.getMessage());
    }

    Interview interview = new Interview();

    interview.setUserId(userId);
    interview.setRole(role);
    interview.setDifficulty(difficulty);
    interview.setInterviewType(interviewType);
    interview.setQuestions(questions);
    interview.setCreatedAt(LocalDateTime.now());

    interviewRepository.save(interview);

    InterviewResponse response =
            new InterviewResponse();

    response.setInterviewId(interview.getId());
    response.setQuestions(questions);

    return response;
}

public InterviewReportResponse submitInterview(
        InterviewSubmitRequest request,
        Long userId
) {

    Interview interview =
            interviewRepository
                    .findById(request.getInterviewId())
                    .orElseThrow(() ->
                            new RuntimeException("Interview not found"));
    if (!interview.getUserId().equals(userId)) {
        throw new RuntimeException("This interview does not belong to the current user");
    }


    StringBuilder interviewData =
            new StringBuilder();

    for (InterviewAnswerRequest answerRequest :
            request.getAnswers()) {

        InterviewAnswer answer =
                new InterviewAnswer();

        answer.setInterviewId(
                request.getInterviewId()
        );

        answer.setQuestionNumber(
                answerRequest.getQuestionNumber()
        );

        answer.setQuestion(
                answerRequest.getQuestion()
        );

        answer.setAnswer(
                answerRequest.getAnswer()
        );

        interviewAnswerRepository.save(answer);

        interviewData.append("Question ")
                .append(answerRequest.getQuestionNumber())
                .append(":\n")
                .append(answerRequest.getQuestion())
                .append("\n\nAnswer:\n")
                .append(answerRequest.getAnswer())
                .append("\n\n");
    }

    String prompt = """
    		You are an expert technical interviewer.

    		Evaluate the candidate's interview.

    		Return ONLY a valid JSON object.

    		Do not write markdown.
    		Do not write explanations.
    		Do not use ```json.
    		Return ONLY JSON.

    		Expected JSON format:

    		{
    		  "overallScore": 85,
    		  "strengths": "Strong Java fundamentals and Spring Boot knowledge.",
    		  "weaknesses": "Needs better understanding of Docker.",
    		  "improvementAreas": "Microservices, System Design",
    		  "recommendedTopics": "Docker, Kubernetes, AWS",
    		  "detailedFeedback": "Overall a good performance with solid backend concepts..."
    		}

    		Interview Data:

    		""" + interviewData;

    String reportText = model.chat(prompt);
    InterviewEvaluationResponse aiResponse;

    try {

        aiResponse =
                objectMapper.readValue(
                        reportText,
                        InterviewEvaluationResponse.class
                );

    } catch (Exception e) {

        throw new RuntimeException(
                "Failed to parse AI response: " + reportText
        );
    }
    InterviewReport report =
            new InterviewReport();

    report.setInterviewId(
            request.getInterviewId()
    );

    report.setOverallScore(
            aiResponse.getOverallScore()
    );

    report.setStrengths(
            aiResponse.getStrengths()
    );

    report.setWeaknesses(
            aiResponse.getWeaknesses()
    );

    report.setImprovementAreas(
            aiResponse.getImprovementAreas()
    );

    report.setRecommendedTopics(
            aiResponse.getRecommendedTopics()
    );

    report.setDetailedFeedback(
            aiResponse.getDetailedFeedback()
    );

    interviewReportRepository.save(report);

    InterviewReportResponse response =
            new InterviewReportResponse();
    response.setOverallScore(
            aiResponse.getOverallScore()
    );

    response.setStrengths(
            aiResponse.getStrengths()
    );

    response.setWeaknesses(
            aiResponse.getWeaknesses()
    );

    response.setImprovementAreas(
            aiResponse.getImprovementAreas()
    );

    response.setRecommendedTopics(
            aiResponse.getRecommendedTopics()
    );

    response.setDetailedFeedback(
            aiResponse.getDetailedFeedback()
    );
    return response;
}


}
