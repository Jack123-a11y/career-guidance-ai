package com.sahil.career_guidance_ai.dto;

public class InterviewResponse {

    private Long interviewId;

    private String questions;

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public String getQuestions() {
        return questions;
    }

    public void setQuestions(String questions) {
        this.questions = questions;
    }
}