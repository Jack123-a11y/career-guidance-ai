package com.sahil.career_guidance_ai.dto;

import java.util.List;

public class InterviewSubmitRequest {

    private Long interviewId;

    private List<InterviewAnswerRequest> answers;

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public List<InterviewAnswerRequest> getAnswers() {
        return answers;
    }

    public void setAnswers(List<InterviewAnswerRequest> answers) {
        this.answers = answers;
    }
}