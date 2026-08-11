package com.sahil.career_guidance_ai.dto;

public class InterviewReportResponse {

    private Integer overallScore;

    private String strengths;

    private String weaknesses;

    private String improvementAreas;

    private String recommendedTopics;

    private String detailedFeedback;

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(String weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getImprovementAreas() {
        return improvementAreas;
    }

    public void setImprovementAreas(String improvementAreas) {
        this.improvementAreas = improvementAreas;
    }

    public String getRecommendedTopics() {
        return recommendedTopics;
    }

    public void setRecommendedTopics(String recommendedTopics) {
        this.recommendedTopics = recommendedTopics;
    }

    public String getDetailedFeedback() {
        return detailedFeedback;
    }

    public void setDetailedFeedback(String detailedFeedback) {
        this.detailedFeedback = detailedFeedback;
    }
}