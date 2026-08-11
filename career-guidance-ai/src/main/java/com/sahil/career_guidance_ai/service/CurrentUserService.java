package com.sahil.career_guidance_ai.service;

import com.sahil.career_guidance_ai.entity.User;
import com.sahil.career_guidance_ai.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser() {

        String email =
                (String) request.getAttribute("email");

        if (email == null) {
            throw new RuntimeException("User not authenticated");
        }

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }
}