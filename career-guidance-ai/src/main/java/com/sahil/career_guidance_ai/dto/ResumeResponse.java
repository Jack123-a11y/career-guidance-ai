package com.sahil.career_guidance_ai.dto;

public class ResumeResponse {
    private Long resumeId;
    private Integer score;
    private String strengths;
    private String weaknesses;
    private String suggestions;

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }
    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }
}