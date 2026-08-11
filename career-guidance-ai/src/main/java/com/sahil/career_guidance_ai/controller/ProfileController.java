package com.sahil.career_guidance_ai.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    @GetMapping("/profile")
    public String profile(HttpServletRequest request) {

        String email = (String) request.getAttribute("email");

        return "Welcome " + email + "! This is a protected API.";
    }
}