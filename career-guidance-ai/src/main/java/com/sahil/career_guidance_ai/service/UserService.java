package com.sahil.career_guidance_ai.service;

import com.sahil.career_guidance_ai.entity.User;
import com.sahil.career_guidance_ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // REGISTER USER
    public User registerUser(User user) {
    	 if (userRepository.findByEmail(user.getEmail()) != null) {
    	        throw new RuntimeException("Email already registered.");
    	    }
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
              
        );

        return userRepository.save(user);
    }

    // FIND USER BY EMAIL
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}