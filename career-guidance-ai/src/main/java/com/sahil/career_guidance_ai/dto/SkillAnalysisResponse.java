package com.sahil.career_guidance_ai.dto;

public class SkillAnalysisResponse {

    private String currentSkills;

    private String missingSkills;

    private String recommendations;

    public String getCurrentSkills() {
        return currentSkills;
    }

    public void setCurrentSkills(String currentSkills) {
        this.currentSkills = currentSkills;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
}