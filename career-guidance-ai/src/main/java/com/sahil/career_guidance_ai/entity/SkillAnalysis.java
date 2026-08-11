package com.sahil.career_guidance_ai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "skill_analysis")
public class SkillAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String currentSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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