package com.sahil.career_guidance_ai.dto;

public class InterviewRequest {
    private String role;
    private String difficulty;
    private String interviewType;
    private Integer questionCount;

   
    public String getRole() { return role; }
    
    public void setRole(String role) { this.role = role; }
   
    public String getDifficulty() { return difficulty; }
   
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
   
   public String getInterviewType() { return interviewType; }
   
   public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
  
   public Integer getQuestionCount() { return questionCount; }
   
   public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }
}