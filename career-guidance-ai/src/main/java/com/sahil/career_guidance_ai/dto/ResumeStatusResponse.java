package com.sahil.career_guidance_ai.dto;

public class ResumeStatusResponse {
    private boolean hasResume;
    private String fileName;
    private Long resumeId;

    public boolean isHasResume() { return hasResume; }
    public void setHasResume(boolean hasResume) { this.hasResume = hasResume; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
}